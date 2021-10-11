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
import * as envConfig from '../../../../../env.config.json'
import { RestHelper } from '../../base/RestHelper'

//Shopping Cart Page class is used to handle the object of Shopping Cart Page
export class ShoppingCartPage {
  util = new Utils()
  helper = new RestHelper()
  orderItemTable = "//tbody[@class='MuiTableBody-root']/tr/td"
  shoppingCartHeading = $("//h1[text() = 'Shopping Cart']")
  promoCodeHeading = $("//h6[contains(text(),'Promo Code')]")
  promoCodeLabel = $("//label[@id='cart_input_promocode-label']")
  promoCodeInput = $("//input[@id='cart_input_promocode']")
  promoCodeApply = $("//button[@id='cart_link_2_promocode']")
  orderSummaryHeading = $("//h6[contains(text(),'Order Summary')]")
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]")
  orderSummaryTotalPrice = $(
    "//h6[contains(text(),'Total')]//..//following-sibling::div/h6"
  )
  checkOut = $("//button/span[text()='Checkout']")
  emptyCart = $('//h1//following-sibling::div//p')
  recurringCheckbox = "//span[text() = 'Schedule this as a recurring order']"
  frequency = "//select[@name='frequency']"
  startDate = 'input.MuiInput-input'
  deleteItemBtn = "//tr[@class = 'MuiTableRow-root']//button[@title='Delete']"
  //product images
  productImages = 'img.MuiAvatar-img'
  maxtimeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to validate shopping cart heading
   */
  validate () {
    this.shoppingCartHeading.waitForDisplayed()
  }
  /**
   * Used to verify order item table
   * @param subprodut : json object of sub product type 1/type 2 from sappireproduct.json
   * @param quantity : pass qunatity as number
   */
  verifyOrderItemTable (subprodut: object, quantity: number) {
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
    const actualSkuName = this.orderItemTable + "/p[text()='" + skuName + "']"
    expect($(actualSkuName).getText()).toBe(
      'SKU: ' + skuName,
      'In Shopping cart , expected order item is not present'
    )
    expect($(actualSkuName + '/..//following-sibling::td[1]').getText()).toBe(
      'In Stock',
      'In Shopping cart - Stock is not available'
    )
    expect(
      $(actualSkuName + '/..//following-sibling::td[2]/p//input').getAttribute(
        'value'
      )
    ).toBe(
      quantity.toString(),
      'In Shopping car - Mentioned Quantity is not availabe'
    )
    let expectedPrice = quantity * parseFloat(skuPrice.replace(/[^\d\.]*/g, ''))
    expect(
      $(actualSkuName + '/..//following-sibling::td[3]/p').getText()
    ).toContain('$' + expectedPrice, '')
    expect(
      $(
        actualSkuName + '/..//following-sibling::td[4]/div/button'
      ).getAttribute('title')
    ).toBe('Delete', 'In Shopping cart -  Delete cart is not available')
    return expectedPrice
  }
  /**
   * Used to verify Promo code section
   */
  verifyPromoCodeSection () {
    expect(this.promoCodeHeading.getText()).toBe(
      'Promo Code',
      'Promo Code Heading is not available'
    )
    expect(this.promoCodeLabel.isDisplayed()).toBe(
      true,
      "Promo code label 'Enter Your Promo Code' - is not displayed"
    )
    expect(this.promoCodeInput.isDisplayed()).toBe(
      true,
      'Promo code text field is not displayed'
    )
    expect(this.promoCodeApply.isDisplayed()).toBe(
      true,
      'Promo code - Apply button is not displayed'
    )
  }
  /**
   * Used to verify Order Summary section
   * @param totalPrice Pass total price as number
   */
  verifyOrderSummarySection (totalPrice: number) {
    expect(this.orderSummaryHeading.getText()).toBe(
      'Order Summary',
      'Order Summary Heading is not available'
    )
    expect(this.verifyOrderSummarytable('Subtotal')).toContain(
      '$' + totalPrice.toString(),
      'SubTotal Price is different - Fail'
    )
    expect(this.verifyOrderSummarytable('Tax')).toContain(
      '$0.00',
      'Tax Price is different - Fail'
    )
    expect(this.verifyOrderSummarytable('Shipping')).toContain(
      '$0.00',
      'Shipping Price is different - Fail'
    )
    expect(this.verifyOrderSummarytable('Shipping tax')).toContain(
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
   * Used to Verify order summary table
   * @param labelName : pass lable name
   */
  verifyOrderSummarytable (labelName: string) {
    let selector = "//p[contains(text(),'" + labelName + "')]"
    $(selector).scrollIntoView()
    expect($(selector).isDisplayed()).toBe(
      true,
      'Subtotal is not displayed in order summary section'
    )
    return $(selector + '//..//following-sibling::div[1]/p').getText()
  }
  /**
   * Used to click on checkout button
   */
  checkout () {
    this.checkOut.waitForDisplayed()
    this.checkOut.scrollIntoView()
    this.checkOut.click()
  }
}
