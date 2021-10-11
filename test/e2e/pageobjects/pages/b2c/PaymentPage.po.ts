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
import { Utils } from '../Utils.po'
import { ReviewOrderPage } from './ReviewOrderPage.po'
import * as envConfig from '../../../../../env.config.json'

//PaymentPage class is to handle the object of payment pages
export class PaymentPage {
  util = new Utils()
  pageheading = $("//*[contains(text(),'Payment Details')]")
  codPayment = $("//*[contains(text(),'Cash on delivery')]")
  payoptions = 'label.pay-option'
  usethisaddress = "//p[text() = 'Use This Address']"
  revieworderButton = "//span[contains(text(),'Review Order')]"
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]"
  useThisAddress =
    "//h6[text()='shippingName']/../../following-sibling::div//button/span/p[text()='Use This Address']"
  timeoutValue: number = envConfig.timeout.maxtimeout
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */

  validate () {
    this.pageheading.waitForDisplayed()
    $$(this.payoptions)[0].waitForDisplayed()
  }
  /**
   * method to select payment option
   * @param payoption : pass payment option as a string
   */

  selectPayOption (payoption: string) {
    console.log('Inside select payment method')
    let exist: boolean = false
    $$(this.payoptions)[0].scrollIntoView()
    const payoptions = $$(this.payoptions)
    for (let option of payoptions) {
      if (option.getText() === payoption) {
        console.log('Payment option available ' + option.getText())
        option.click()
        exist = true
        break
      }
    }
    if (!exist) {
      throw new Error('payment option is not present')
    }
  }
  /**
   * method to navigate new address page
   */

  newAddress () {
    this.util.handleOnClickBtn('Create a New Address')
  }
  /**
   * method to select existing address
   */

  selectExistingAddress (index: number) {
    const adddressSelector = $$(this.usethisaddress)
    browser.waitUntil(
      () =>
        adddressSelector[index].isDisplayed() === true &&
        adddressSelector[index].isClickable() === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: 'Address does not exist at given index ' + index
      }
    )
    adddressSelector[index].click()
  }
  /**
   * method to add address details
   * @param addressData : pass addressData as a json object, key as address field name and value as input field value
   */

  add (addressData: object) {
    for (let [key, value] of Object.entries(addressData)) {
      let selector = "//input[@name= '" + key + "']"
      this.util.setValue(value, selector)
    }
  }
  /**
   * method to save and select newly created address
   */
  saveAndSelect () {
    this.util.handleOnClickBtn('Save and select this address')
  }
  /**
   * Method is used to verify color of save and select button
   * @param color pass RGB value
   */
  verifySaveAndSelectBtnColor (color: string) {
    this.util.verifyColorRGBValue(this.btnColorElement, color)
  }
  /**
   * method to validate save and select not display
   */

  verifySaveAndSelectNotDisplayed () {
    this.util.verifyBtnNotPresent('Save and select this address')
  }
  /**
   * method to navigate review order page
   * @returns ReviewOrderPage()
   */

  reviewOrder (): ReviewOrderPage {
    $$(this.revieworderButton)[1].waitForEnabled()
    $$(this.revieworderButton)[1].scrollIntoView()
    $$(this.revieworderButton)[1].click()
    return new ReviewOrderPage()
  }
  /**
   * Method is used to select billing address based on the name
   * @param name : pass Shipping nickName / billing nickname
   */
  selectBillingAddress (name: string) {
    const selector = this.useThisAddress.replace(/shippingName/, name)
    browser.waitUntil(() => $(selector).isDisplayed() === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: 'Unable to add billing address'
    })
    $(selector).click()
  }
}
