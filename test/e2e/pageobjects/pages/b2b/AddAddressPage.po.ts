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
import { Utils } from '../Utils.po'

//AddAddressPage class is used to handle the object of add address page
export class AddAddressPage {
  newaddressTitle = $('//h4[text() = "Add a new address"]')
  addressType = $('//input[@checked=""]')
  fieldLocator = "//input[@name= 'field']"
  util = new Utils()
  constructor () {
    this.validate()
  }
  /**
   * Validate function used to validate the new address title from the add address page
   */
  validate () {
    expect(this.newaddressTitle.isDisplayed()).toBe(true)
  }
  /**
   * Used to select address type
   * @param addresstype : pass string as Shipping/Billing
   */
  selectAddressType (addresstype: string): AddAddressPage {
    console.log('address type is ' + addresstype)
    const addressSelector = $("//input[@value='" + addresstype + "']")
    addressSelector.click()
    return this
  }
  /**
   * Used to add address details on the add address page
   * @param addressDetails : pass address as a json object where key as a address field and value as input field value
   */
  add (addressDetails: object) {
    this.util.addDetails(addressDetails)
  }
  /**
   * Used to submit an address/create address
   */
  submitAddress () {
    this.util.handleOnClickBtn('Create Address')
  }
}
