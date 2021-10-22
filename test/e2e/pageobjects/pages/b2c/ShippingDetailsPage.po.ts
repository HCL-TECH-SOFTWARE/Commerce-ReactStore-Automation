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
import { PaymentPage } from './PaymentPage.po'
import { Utils } from '../Utils.po'
import * as envConfig from '../../../../../env.config.json'

//ShippingDetailPage class is to handle the object of shipping detail page
export class ShippingDetailPage {
  util = new Utils()
  pageHeading = $("//*[contains(text(),'Shipping Details')]")
  shippingAddressLabel = $("//*[contains(text(),'Shipping Address')]")
  shippingMethodLabel = $("//*[contains(text(),'Shipping Method')]")
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]"
  //New address
  addNewAddress = $$(
    "//p[@class= 'MuiTypography-root sc-aemoO bPjFCG MuiTypography-h4']"
  )
  //Shipping Method
  shippingmethodDropDown = $("//select[@id = 'checkout-ship-method']")

  timeoutValue: number = envConfig.timeout.maxtimeout
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    this.pageHeading.waitForDisplayed()
    this.shippingAddressLabel.waitForDisplayed()
    this.shippingMethodLabel.waitForDisplayed()
  }
  /**
   * method to navigate new address page
   */
  newAddress () {
    this.util.handleOnClickBtn('Create a New Address')
  }
  /**
   * method to add address details
   * @param addressData : pass address as a json object where key as field name and value as field input value
   */
  add (addressData: object) {
    this.util.addDetails(addressData)
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
   * method to validate Save and Select is not display
   */
  verifySaveAndSelectNotDisplayed () {
    this.util.verifyBtnNotPresent('Save and select this address')
  }
  /**
   * method to select shipping method
   * @param methodName : pass ship method as a string
   * @returns ShippingDetailPage()
   */
  selectShippingMethod (methodName: string): ShippingDetailPage {
    this.shippingmethodDropDown.scrollIntoView()
    this.shippingmethodDropDown.selectByVisibleText(methodName)
    return this
  }
  /**
   * method to navigate payment page
   * @returns PaymentPage()
   */
  continuePayment (): PaymentPage {
    this.util.handleOnClickBtn('Continue to Payment')
    return new PaymentPage()
  }
}
