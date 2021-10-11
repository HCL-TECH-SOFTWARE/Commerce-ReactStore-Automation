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

//EditAddressPage class is to handle the object of edit address page
export class EditAddressPage {
  util = new Utils()
  pageName = "//span//h4[contains(text(), 'Edit Address')]"
  addressType = $('//input[@checked=""]')
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    $(this.pageName).waitForDisplayed()
  }
  /**
   * method to cancel address changes
   * @returns AddressBookPage()
   */
  cancel (): AddressBookPage {
    this.util.handleOnClickBtn('Cancel')
    return new AddressBookPage()
  }
  /**
   * method to validate selected address type
   * @param addresstype : pass expected address type as a string
   * @returns EditAddressPage()
   */
  verifyAddressType (addresstype: string): EditAddressPage {
    const selectedValue = this.addressType.getAttribute('Value')
    expect(selectedValue).toMatch(
      addresstype,
      'selected address type is not matches with ' + addresstype
    )
    return this
  }
  /**
   * method to validate existing address card
   * @param address : pass address as a json object where key as a address field and value as an expected input value
   * @returns EditAddressPage()
   */
  verifyExistingAddress (address: object): EditAddressPage {
    this.util.verifyDetails(address)
    return this
  }
}
