/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 1996, 2020
 *
 *--------------------------------------------------
 */
import { Utils } from '../Utils.po'
import { RestHelper } from '../../base/RestHelper'
import * as envConfig from '../../../../../env.config.json'

//CheckoutPage class is used to handle the object of Checkout Page
export class CheckoutPage {
  util = new Utils()
  helper = new RestHelper()
  checkoutHeading = $('//h3')
  shippingAddressHeading = $("//h5[text()='Shipping Address']")
  shippingMethodHeading = $("//h5[text()='Shipping Method']")
  createNew_Address = $("//span[text()='Create a New Address']")
  breadCrumbShippingDetails = $(
    "//div[@class='MuiGrid-root sc-ezrdKe gdrbsr MuiGrid-item']/button/span/p[text()='Shipping Details']"
  )
  breadCrumbAddNewAddress = $(
    "//div[@class='MuiGrid-root sc-ezrdKe gdrbsr MuiGrid-item']/p[text()='Add new address']"
  )
  cancelbtn = $("//span[text()='Cancel']")
  saveSeletAddress = $("//span[text()='Save and select this address']")
  alertMsg_newAddress = $(
    "//div[contains(text(),'has been added successfully')]"
  )
  editbtn = "//button/span/p[text()= 'Edit']"
  checkoutShipMethod = $("//select[@id='checkout-ship-method']")
  continuePayment = $("//span[text()='Continue to Payment']")
  paymentMethodHeading = $("//h5[text()='Payment Method']")
  paymentDetailsHeading = $("//p[text()='Payment Details']")
  review_order = $("//button/span[text()='Review Order']")
  orderItemTable = "//tbody[@class='MuiTableBody-root']/tr/td"
  reviewOrderSummaryHeading = $("//h4[contains(text(),'Order Summary')]")
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]")
  orderSummaryTotalPrice = $(
    "//h6[contains(text(),'Total')]//..//following-sibling::div/h6"
  )
  reviewShippingAddressName =
    "//h5[text()='Shipping Address']//..//..//following-sibling::div/p[1]"
  reviewShippingMethod =
    "//h5[text()='Shipping Method']//..//..//following-sibling::div/p"
  reviewBillingAddressName =
    "//h5[text()='Billing Address']//..//..//following-sibling::div/p[1]"
  reviewPaymentMethod =
    "//h5[text()='Payment Method']//..//..//following-sibling::div/p[1]"
  place_Order = $("//span[text()='Place Order']")
  place_recurring_Order = $("//span[text()='Place Recurring Order']")
  recurringOrderSection = $("//*[text() = 'Recurring Order']")
  reviewFrequencyValue = "//span[text() = 'Frequency']//following-sibling::p"
  reviewStartDateValue = "//span[text() = 'Start Date']//following-sibling::p"
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]"
  productImages = 'img.MuiAvatar-img'
  confirmSelectionBtn = $("//button/span[text()='Confirm Selection']")
  useThisAddress =
    "//h6[text()='shippingName']/../../following-sibling::div//button/span/p[text()='Use This Address']"
  shipmentGroup =
    "//div[contains(@class,'shipment-group-summary')]//h5[text()='ShipmentGroup']"

  //Shipping Address
  shipToMultipleAddress = $("//span[contains(@class,'MuiSwitch-switchBase')]")
  maxtimeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to validate checkout heading and shipping address heading
   */
  validate () {
    this.checkoutHeading.waitForDisplayed()
    this.shippingAddressHeading.waitForDisplayed()
  }
  /**
   * Used to create a new address
   */
  createNewAddress () {
    browser.waitUntil(() => this.createNew_Address.isDisplayed() === true, {
      timeout: this.maxtimeoutValue,
      timeoutMsg: 'Create new address button is not displayed '
    })
    this.createNew_Address.click()
  }
  /**
   * Used to add address details
   * @param addDetails : pass address as a json object where key as a address field and value as input field value
   */
  addAddressDetails (addDetails: object) {
    this.util.addDetails(addDetails)
  }
  /**
   * Used to click on save and select address ( button/link )
   */
  saveAndSelectThisAddress () {
    this.saveSeletAddress.scrollIntoView()
    this.saveSeletAddress.click()
    browser.waitUntil(() => this.alertMsg_newAddress.isDisplayed() === true, {
      timeout: this.maxtimeoutValue,
      timeoutMsg: 'New Address is not saved '
    })
    $(this.editbtn).scrollIntoView()
    const count = $$(this.editbtn).length
    if (count === 1) {
      console.log('New Address is selected')
    }
  }
  /**
   * Method is used to verify color of save and select button
   * @param color : pass rgb value
   */
  verifySaveAndSelectBtnColor (color: string) {
    this.util.verifyColorRGBValue(this.btnColorElement, color)
  }
  /**
   * Used to select shipping method from dropdown
   * @param shippingMethod : pass shipping method as string
   */
  selectShippingMethod (shippingMethod: string) {
    this.shippingMethodHeading.scrollIntoView()
    expect(this.shippingMethodHeading.isDisplayed()).toBe(
      true,
      'Shipping method section is missing'
    )
    this.checkoutShipMethod.selectByVisibleText(shippingMethod)
  }
  /**
   * Used to click on continue to payment button/link
   */
  continueToPayment () {
    browser.waitUntil(() => this.continuePayment.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Continue Payment button is not displayed'
    })
    this.continuePayment.scrollIntoView()
    this.continuePayment.click()
    browser.pause(envConfig.timeout.lowtimeout)
  }
  /**
   * Used to select payment method
   * @param paymentMethod pass payment method as a string
   */
  selectPaymentMethod (paymentMethod: string) {
    this.paymentDetailsHeading.scrollIntoView()
    expect(this.paymentDetailsHeading.isDisplayed()).toBe(
      true,
      'Payment Details heading is missing '
    )
    expect(this.paymentMethodHeading.isDisplayed()).toBe(
      true,
      'Payment method heading is missing '
    )
    const selector =
      "//p[text()='" + paymentMethod + "']/../..//span/input[@name='payOption']"
    $(selector).click()
  }
  /**
   * Used to click on Review order button/link
   */
  reviewOrder () {
    browser.waitUntil(() => this.review_order.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Review Order button is not displayed'
    })
    this.review_order.scrollIntoView()
    this.review_order.click()
    console.log('Clicked on Review Order')
    browser.pause(envConfig.timeout.lowtimeout)
  }
  /**
   * Used for verification of order item table on review section
   * @param subprodut : json object of sub product type 1/type 2 from sappireproduct.json
   * @param quantity : subproduct quantity in number from data file
   */
  verifyReviewOrderItemTable (subprodut: object, quantity: number) {
    let skuName
    let skuPrice
    for (let [key, value] of Object.entries(subprodut)) {
      if (key == 'sku') {
        skuName = value
      }
      if (key == 'price') {
        skuPrice = value
      }
    }
    browser.pause(envConfig.timeout.lowtimeout)
    $(this.orderItemTable).scrollIntoView()
    const actualSkuName = this.orderItemTable + "/p[text()='" + skuName + "']"
    console.log('Sku Name :' + $(actualSkuName).getText())
    expect($(actualSkuName).getText()).toBe(
      'SKU: ' + skuName,
      'In Shopping cart , expected order item is not present'
    )
    expect($(actualSkuName + '/..//following-sibling::td[1]').getText()).toBe(
      'In Stock',
      'In Shopping cart - Stock is not available'
    )
    expect($(actualSkuName + '/..//following-sibling::td[2]/p').getText()).toBe(
      quantity.toString(),
      'In Shopping car - Mentioned Quantity is not availabe'
    )
    const expectedPrice =
      quantity * parseFloat(skuPrice.replace(/[^\d\.]*/g, ''))
    expect(
      $(actualSkuName + '/..//following-sibling::td[3]/p').getText()
    ).toContain('$' + expectedPrice, '')
    return expectedPrice
  }
  /**
   * Used for verification of order summary on review order section
   * @param totalPrice : total price from test data or test case
   */
  verifyReviewOrderSummarySection (totalPrice: number) {
    this.reviewOrderSummaryHeading.scrollIntoView()
    expect(this.reviewOrderSummaryHeading.getText()).toBe(
      'Order Summary',
      'Order Summary Heading is not available'
    )
    expect(this.verifyReviewOrderSummarytable('Subtotal')).toContain(
      '$' + totalPrice.toString(),
      'SubTotal Price is different - Fail'
    )
    expect(this.verifyReviewOrderSummarytable('Tax')).toContain(
      '$0.00',
      'Tax Price is different - Fail'
    )
    expect(this.verifyReviewOrderSummarytable('Shipping')).toContain(
      '$0.00',
      'Shipping Price is different - Fail'
    )
    expect(this.verifyReviewOrderSummarytable('Shipping tax')).toContain(
      '$0.00',
      'Shipping Tax Price is different - Fail'
    )
    expect(this.orderSummaryTotalHeading.getText()).toBe(
      'Total',
      'Total Heading is not displayed'
    )
    expect(this.orderSummaryTotalPrice.getText()).toContain(
      '$' + totalPrice.toString(),
      'Total Price is different -Fail '
    )
  }
  /**
   * Used to verify review order summary table
   * @param labelName pass expected label name as a string
   * @return : label Value
   */
  verifyReviewOrderSummarytable (labelName: string) {
    let selector
    if (labelName == 'Shipping') {
      selector = "//p[text()='" + labelName + "']"
    } else {
      selector = "//p[contains(text(),'" + labelName + "')]"
    }
    $(selector).scrollIntoView()
    expect($(selector).isDisplayed()).toBe(
      true,
      'Subtotal is not displayed in order summary section'
    )
    return $(selector + '//..//following-sibling::div[1]/p').getText()
  }
  /**
   * Used to verify shipping address name
   * @param shippingaddress : Pass expected shipping address name
   */
  verifyShipAddressName (shippingaddress: string) {
    $(this.reviewShippingAddressName).scrollIntoView()
    this.util.verifyText(
      shippingaddress,
      this.reviewShippingAddressName,
      'Shipping Address Name'
    )
  }
  /**
   * Used to verify shipping Address method
   * @param shippingMethod : Pass expected shipping method as string
   */
  verifyShipAddressMethod (shippingMethod: string) {
    $(this.reviewShippingMethod).scrollIntoView()
    this.util.verifyText(
      shippingMethod,
      this.reviewShippingMethod,
      'Shipping Method'
    )
  }
  /**
   * Used to verify billing address name
   * @param billingaddress : Pas expected billing addres name as a string
   */
  verifyBillAddressName (billingaddress: string) {
    $(this.reviewBillingAddressName).scrollIntoView()
    this.util.verifyText(
      billingaddress,
      this.reviewBillingAddressName,
      'Billing Address Name'
    )
  }
  /**
   * Used to verify payment method
   * @param paymentMethod : pass expected payment method
   */
  verifyPaymentMethod (paymentMethod: string) {
    $(this.reviewPaymentMethod).scrollIntoView()
    this.util.verifyText(
      paymentMethod,
      this.reviewPaymentMethod,
      'Payment Method'
    )
  }
  /**
   * Used to click on place order button/click
   */
  placeOrder () {
    browser.waitUntil(() => this.place_Order.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Place Order button is not displayed'
    })
    this.place_Order.scrollIntoView()
    this.place_Order.click()
  }
}
