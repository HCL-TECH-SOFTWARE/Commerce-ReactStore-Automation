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
import { AddressBookPage } from './AddressBookPage.po'
//EditAddressPage class is used to handle the object of Edit Address Page
export class EditAddressPage {
  //edit address page
  editaddressTitle = $('//h4[text() = "Edit Address"]')
  addressType = $('//input[@checked=""]')
  cancelButton = $("//span[text()='Cancel']")
  util = new Utils()
  constructor () {
    this.validate()
  }
  /**
   * Used to validate edit address page title
   */
  validate () {
    expect(this.editaddressTitle.isDisplayed()).toBe(true)
  }
  /**
   * Used to verify address type
   * @param addresstype pass expected address type
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
   * Used to verfy existing details
   * @param expectedDetails : pass expected details
   */
  verifyExistingDetails (expectedDetails: object) {
    this.util.verifyDetails(expectedDetails)
  }
  /**
   * Used to click on cancel button/link
   */
  cancel (): AddressBookPage {
    this.cancelButton.scrollIntoView()
    this.util.handleOnClickBtn('Cancel')
    return new AddressBookPage()
  }
}
