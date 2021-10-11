/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 1996, 2020
•	
*-----------------------------------------------------------------
*/
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import { MegaMenu } from '../../pageobjects/pages/MegaMenu.po'
import { ProductDetailPage } from '../../pageobjects/pages/b2c/ProductDetailPage.po'
import { ProductListingPage } from '../../pageobjects/pages/b2c/ProductListingPage.po'
import { ShoppingCartPage } from '../../pageobjects/pages/b2c/ShoppingCartPage.po'
import { ShippingDetailPage } from '../../pageobjects/pages/b2c/ShippingDetailsPage.po'
import { PaymentPage } from '../../pageobjects/pages/b2c/PaymentPage.po'
import { ReviewOrderPage } from '../../pageobjects/pages/b2c/ReviewOrderPage.po'
import { OrderConfirmationPage } from '../../pageobjects/pages/b2c/OrderConfirmationPage.po'
import configFile = require('../data/UserManagementData.json')
import CATALOG = require('../data/b2c/EmeraldProducts.json')
import dataFile = require('../data/b2c/CheckoutPageAsGuestShopper.json')

describe('B2C- User views checkout page in Emerald store as a guest user', () => {
  let homepage: HomePage
  const storeName = configFile.store
  beforeEach(function () {
    //GIVEN the homepage is loaded and user is not signed in
    browser.maximizeWindow()
    browser.url(storeName.emerald)
    //Sign out if the user is signed in
    homepage = new HomePage()
    homepage.signOutIfSignedIn()
  })
  it('Test01- To complete guest checkout with a product in emerald store', () => {
    console.log(
      'Test01- To complete guest checkout with a product in emerald store'
    )
    const testData = dataFile.test01
    let parentcategory = CATALOG.AllCategories
    let subcategory = CATALOG.LivingRoom.Furniture
    let product1 = subcategory['Wooden Cafe Chair']
    let sku1 = product1['LR-FNTR-0008-0001']
    //GIVEN the homepage is loaded and guest users shopping cart is empty
    //AND
    //WHEN user navigates to sku page and adds a product to their cart
    let megaMenu: MegaMenu = homepage.headerMenu(parentcategory.categoryName)
    megaMenu.goToProductListingPage(subcategory.subCategoryName)
    const plp: ProductListingPage = new ProductListingPage()
    const pdp: ProductDetailPage = plp.productThumbnail(
      product1.productInfo.name
    )
    //Select product and add to cart
    pdp.selectSwatch(sku1.attributes.Color).addToCart()
    pdp.verifyAlertMessage(dataFile.alertmsg.addcartAlertMsg)
    //View cart from confirmation modal
    const shoppingcart: ShoppingCartPage = pdp.viewCartOnConfirmationModal()
    //verify product details on shopping cart page and promo code, order summary section
    shoppingcart.verifyOrderItemTable(sku1, dataFile.quantity.One)
    shoppingcart.verifyOrderSummarySection(sku1.priceOffering)
    shoppingcart.verifyPromoCodeSection()
    const shipping: ShippingDetailPage = shoppingcart.checkOut()
    //WHEN user inputs all manditory and optional fields for shipping address and clicks save and select address
    console.log('User is filling shipping address information')
    shipping.newAddress()
    shipping.add(testData.addressBook[0])
    shipping.saveAndSelect()
    //THEN wait for save&select address to disappear and shipping method to appear
    shipping.verifySaveAndSelectNotDisplayed()
    //WHEN user selected method for shipping and clicks on continue payment
    const payment: PaymentPage = shipping
      .selectShippingMethod(testData.shippingMethod)
      .continuePayment()
    payment.selectPayOption(testData.paymentMethod)
    //WHEN user inputs all manditory and optional fields for billing address and clicks save and continue
    console.log('User is filling billing address information')
    payment.newAddress()
    payment.add(testData.addressBook[1])
    payment.saveAndSelect()
    //THEN wait for save&select address to dissapear and review order button to enable
    payment.verifySaveAndSelectNotDisplayed()
    const revieworder: ReviewOrderPage = payment.reviewOrder()
    //AND
    //THEN verifies totalproducts, product details, shipaddress, payment and order summary detail
    revieworder
      .verifyTotalProducts(dataFile.totalProducts.One)
      .verifyReviewOrderItemTable(sku1, dataFile.quantity.One)
      .verifyAllImagesIsLoaded()
      .verifyShipAddressName(testData.addressBook[0].firstName)
      .verifyShipAddressMethod(testData.shippingMethod)
      .verifyBillAddressName(testData.addressBook[1].firstName)
      .verifyPaymentMethod(testData.paymentMethod)
    //When user clicks on place order button and verify order id to be greater than 0
    const orderconfirmation: OrderConfirmationPage = revieworder.placeOrder()
    orderconfirmation.verifyOrderId()
    orderconfirmation.verifyOrderConfirmationPage(dataFile.orderConfirmation)
  })
})
