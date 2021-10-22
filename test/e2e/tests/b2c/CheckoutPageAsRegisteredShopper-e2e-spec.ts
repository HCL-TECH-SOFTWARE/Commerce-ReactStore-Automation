/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 2020, 2021
•	
*-----------------------------------------------------------------
*/
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import { RegistrationPage } from '../../pageobjects/pages/b2c/RegistrationPage.po'
import { MegaMenu } from '../../pageobjects/pages/MegaMenu.po'
import { ProductDetailPage } from '../../pageobjects/pages/b2c/ProductDetailPage.po'
import { ProductListingPage } from '../../pageobjects/pages/b2c/ProductListingPage.po'
import { ShoppingCartPage } from '../../pageobjects/pages/b2c/ShoppingCartPage.po'
import { ShippingDetailPage } from '../../pageobjects/pages/b2c/ShippingDetailsPage.po'
import { PaymentPage } from '../../pageobjects/pages/b2c/PaymentPage.po'
import { ReviewOrderPage } from '../../pageobjects/pages/b2c/ReviewOrderPage.po'
import { OrderConfirmationPage } from '../../pageobjects/pages/b2c/OrderConfirmationPage.po'
import { RestHelper } from '../../pageobjects/base/RestHelper'
import configFile = require('../data/UserManagementData.json')
import CATALOG = require('../data/b2c/EmeraldProducts.json')
import dataFile = require('../data/b2c/CheckoutPageAsRegisteredShopper.json')

describe('B2C- User views checkout page in emerald store as a registered user', () => {
  let homepage: HomePage
  const storeName = configFile.store
  const registerData = dataFile.register
  beforeAll(function () {
    //delete if user exist
    const helper = new RestHelper()
    helper.deleteUser(registerData.email, configFile.store.emeraldId)
    //GIVEN the homepage is loaded and user is not signed in
    browser.maximizeWindow()
    browser.url(storeName.emerald)
    //Navigate to sign-in/registration page
    homepage = new HomePage()
    const buyer: RegistrationPage = homepage.signIn()
    buyer.registernow()
    //create user
    buyer.register('email', registerData.email)
    buyer.register('firstName', registerData.firstName)
    buyer.register('lastName', registerData.lastName)
    buyer.register('password1', registerData.password)
    buyer.register('password2', registerData.password)
    buyer.submitRegister()
    //Verify the user is logged in to storefront
    homepage.verifyMyAccount(registerData.firstName)
  })
  beforeEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01- To complete registered user checkout with a product in emerald store', () => {
    console.log(
      'Test01- To complete registered user checkout with a product in emerald store'
    )
    const testData = dataFile.test01
    let parentcategory = CATALOG.AllCategories
    let subcategory = CATALOG.LivingRoom.Furniture
    let product1 = subcategory['Wooden Cafe Chair']
    let sku1 = product1['LR-FNTR-0008-0001']
    //GIVEN the homepage is loaded and user is not signed in
    browser.url(storeName.emerald)
    //Navigate to sign-in/registration page
    homepage = new HomePage()
    var buyer: RegistrationPage = homepage.signIn()
    buyer.login('email', registerData.email)
    buyer.login('password', registerData.password)
    buyer.submitLogin()
    //Verify the user is logged in to storefront
    homepage.verifyMyAccount(registerData.firstName)
    //GIVEN the homepage is loaded and registered user's shopping cart is empty
    //AND
    //WHEN user navigates to sku page and adds a product to their cart
    const megaMenu: MegaMenu = homepage.headerMenu(parentcategory.categoryName)
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
    var shipping: ShippingDetailPage = shoppingcart.checkOut()
    //WHEN user inputs all manditory and optional fields for shipping address and clicks save and select address
    console.log('-------User is filling shipping address information-------')
    shipping.newAddress()
    shipping.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorDisabled
    )
    shipping.add(testData.addressBook[0])
    shipping.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorEnabled
    )
    shipping.saveAndSelect()
    //THEN wait for save&select address to disappear and shipping method to appear
    shipping.verifySaveAndSelectNotDisplayed()
    //WHEN user selected method for shipping and clicks on continue payment
    console.log(
      '-------User selects shipping method then click on continue payment-------'
    )
    const payment: PaymentPage = shipping
      .selectShippingMethod(testData.shippingMethod)
      .continuePayment()
    payment.selectPayOption(testData.paymentMethod)
    //WHEN user inputs all manditory and optional fields for billing address and clicks save and continue
    console.log('-------User is filling billing address information------')
    payment.newAddress()
    payment.add(testData.addressBook[1])
    payment.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorEnabled
    )
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
