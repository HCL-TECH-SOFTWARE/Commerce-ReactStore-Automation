/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 2020, 2021
 *
 *--------------------------------------------------
 */
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { ProductDetailPage } from '../../pageobjects/pages/b2b/ProductDetailPage.po'
import { ProductListingPage } from '../../pageobjects/pages/b2b/ProductListingPage.po'
import { ShoppingCartPage } from '../../pageobjects/pages/b2b/ShoppingCartPage.po'
import { CheckoutPage } from '../../pageobjects/pages/b2b/CheckoutPage.po'
import { OrderConfirmationPage } from '../../pageobjects/pages/b2b/OrderConfirmationPage.po'
import { OrganizationDashboardPage } from '../../pageobjects/pages/b2b/OrganizationDashboardPage.po'
import { AddressBookPage } from '../../pageobjects/pages/b2b/AddressBookPage.po'
import CATALOG = require('../data/b2b/SapphireProducts.json')
import dataFile = require('../data/b2b/b2bCheckoutPageAsRegisteredShopper.json')
import configFile = require('../data/UserManagementData.json')
import { RestHelper } from '../../pageobjects/base/RestHelper'

describe('B2B - User views checkout page in sappire store as a guest user', () => {
  const storeName = configFile.store
  const helper = new RestHelper()
  const password = helper.readPassword()
  beforeEach(function () {
    browser.maximizeWindow()
  })
  it('Test01- User unable to add a product in Shopping cart', () => {
    console.log('Test01- User unable to add a product in Shopping cart')
    let parentcategory = CATALOG.AllCategories.categoryName
    let category = CATALOG.Categories.Fasteners
    let subcategory = category.Bolts
    let product1 = subcategory['T-Handle Bolt']
    let subproduct1 = product1.subproduct
    browser.url(storeName.sappire)
    const homePage = new HomePage()
    const megaMenu = homePage.headerMenu(parentcategory)
    //Navigate to parent category
    megaMenu.goTOParentCategoryFrom3TierMenu(subcategory.subCategoryName)
    const productListingPage = new ProductListingPage()
    let productDetailPage: ProductDetailPage = productListingPage.productSelect(
      product1.name
    )
    productDetailPage.verifyProductInfo(product1)
    productDetailPage.verifySubProdcutType(subproduct1.type1)
    productDetailPage.verifyQuantityIsDisabled(subproduct1.type1.sku)
    productDetailPage.pleaseSignIntoShop()
    productDetailPage.verifySignInPage()
  })
  it('Test02- To complete registered user checkout with a product', () => {
    console.log('Test02- To complete registered user checkout with a product')
    const testData = dataFile.test01
    let parentcategory = CATALOG.AllCategories.categoryName
    let category = CATALOG.Categories.Fasteners
    let subcategory = category.Bolts
    let product1 = subcategory['T-Handle Bolt']
    let subproduct1 = product1.subproduct
    let shippingaddress = testData.addressBook[0]
    const billingaddress = testData.addressBook[1]
    let homepage = new HomePage()
    homepage.login(configFile.user.logonId, password)
    const megaMenu = homepage.headerMenu(parentcategory)
    //Navigate to parent category
    megaMenu.goTOParentCategoryFrom3TierMenu(subcategory.subCategoryName)
    const productListingPage = new ProductListingPage()
    const productDetailPage: ProductDetailPage = productListingPage.productSelect(
      product1.name
    )
    productDetailPage.quantity(subproduct1.type1.sku, dataFile.quantity.One)
    productDetailPage.quantity(subproduct1.type2.sku, dataFile.quantity.Two)
    productDetailPage.addToCurrentOrder()
    productDetailPage.verifyAlertMessage(dataFile.alertmsg.itemAdded1)
    productDetailPage.viewCartFromAlertMessage()
    const shoppingCartPage = new ShoppingCartPage()
    let type1expectedPrice = shoppingCartPage.verifyOrderItemTable(
      subproduct1.type1,
      dataFile.quantity.One
    )
    let type2expectedPrice = shoppingCartPage.verifyOrderItemTable(
      subproduct1.type2,
      dataFile.quantity.Two
    )
    shoppingCartPage.verifyPromoCodeSection()
    shoppingCartPage.verifyOrderSummarySection(
      type1expectedPrice + type2expectedPrice
    )
    shoppingCartPage.checkout()
    const checkoutPage = new CheckoutPage()
    checkoutPage.createNewAddress()
    checkoutPage.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorDisabled
    )
    checkoutPage.addAddressDetails(testData.addressBook[0])
    checkoutPage.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorEnabled
    )
    checkoutPage.saveAndSelectThisAddress()
    checkoutPage.selectShippingMethod(testData.shippingMethod)
    checkoutPage.continueToPayment()
    checkoutPage.selectPaymentMethod(testData.paymentMethod)
    checkoutPage.createNewAddress()
    checkoutPage.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorDisabled
    )
    checkoutPage.addAddressDetails(testData.addressBook[1])
    checkoutPage.verifySaveAndSelectBtnColor(
      dataFile.buttonColor.backgroundColorEnabled
    )
    checkoutPage.saveAndSelectThisAddress()
    checkoutPage.reviewOrder()
    type1expectedPrice = checkoutPage.verifyReviewOrderItemTable(
      subproduct1.type1,
      dataFile.quantity.One
    )
    type2expectedPrice = checkoutPage.verifyReviewOrderItemTable(
      subproduct1.type2,
      dataFile.quantity.Two
    )
    checkoutPage.verifyReviewOrderSummarySection(
      type1expectedPrice + type2expectedPrice
    )
    checkoutPage.verifyShipAddressName(shippingaddress.firstName)
    checkoutPage.verifyShipAddressMethod(testData.shippingMethod)
    checkoutPage.verifyBillAddressName(billingaddress.firstName)
    checkoutPage.verifyPaymentMethod(testData.paymentMethod)
    checkoutPage.placeOrder()
    const orderConfimationPage = new OrderConfirmationPage()
    orderConfimationPage.verifyOrderConfirmationPage(dataFile.orderConfirmation)
    orderConfimationPage.verifyOrderId()
    homepage = new HomePage()
    homepage.goToYourAccount().goToAccountWindow('Dashboard')
    // Go to address book page
    const dashboardPage = new OrganizationDashboardPage()
    dashboardPage.dashboard('Account Settings', 'Address Book')
    const addressbook = new AddressBookPage()
    addressbook.deleteAllAddress()
  })
})
