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
import { AddressBookPage } from './AddressBookPage.po'

//AddAddressPage class is to handle the object of add address page
export class AddAddressPage {
  util = new Utils()
  pageName = $("//span//h4[contains(text(), 'Add a new address')]")
  //Buttons
  createAddressButton = $('button.MuiButtonBase-root:nth-child(2)')
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */

  validate () {
    this.pageName.waitForDisplayed()
  }
  /**
   * method to submit address details
   * @returns AddressBookPage()
   */

  submit (): AddressBookPage {
    this.util.verifyBtnEnable('Create Address')
    this.util.handleOnClickBtn('Create Address')
    return new AddressBookPage()
  }
  /**
   * method to add address on add new address page
   * @param addressData pass address as a json object where key as a address field and value as an input field value
   */

  add (addressData: object) {
    this.util.addDetails(addressData)
  }
  /**
   * method to select address type
   * @param addresstype pass string as Shipping/Billing/Both
   * @returns AddAddressPage()
   */

  selectAddressType (addresstype: string): AddAddressPage {
    console.log('Address type is ' + addresstype)
    const addressSelector = $("//input[@value='" + addresstype + "']")
    addressSelector.click()
    return this
  }
  /**
   * method to validate create address button disable
   */

  verifyCreateAddressButtonDisable () {
    expect(this.createAddressButton.isClickable()).toBe(
      false,
      'Create Address Button is enabled'
    )
  }
}
