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
import { AddAddressPage } from './AddAddressPage.po'
import { EditAddressPage } from './EditAddressPage.po'
import * as envConfig from '../../../../../env.config.json'

//AddressBookPage class used to handle the object of AddressBookPage
export class AddressBookPage {
  addressbookTitle = '//h3[@id = "address-book-title"]'
  addressbookMenu = '//nav//span[text() = "Address Book"]'
  alertMsg = '//div[@class="MuiAlert-message"]'
  addresscard = $('div.address-card')
  editLink = "//a[text() = 'Edit']"
  deleteLink = "//p[text()='Delete']"
  deleteAlertMsg = "//div[contains(text(),'has been deleted successfully')]"
  alertClose = $("//button[@title='Close']")
  maxtimeoutValue: number = envConfig.timeout.maxtimeout
  util = new Utils()

  constructor () {
    this.validate()
  }
  /**
   * Used to validate the title and address book menu
   */
  validate () {
    this.util.verifyText('Address Book', this.addressbookTitle, 'pagetitle')
    this.util.verifyText('Address Book', this.addressbookMenu, 'menu')
  }
  /**
   * Used to add address on address book page
   */
  addAddress (): AddAddressPage {
    this.util.handleOnClickBtn('Add Address')
    return new AddAddressPage()
  }
  /**
   * Used to edit the address on address book page
   * @param index pass address card number as a number
   */
  editAddress (index: number): EditAddressPage {
    index = index - 1
    $$(this.editLink)[index].waitForDisplayed()
    $$(this.editLink)[index].click()
    return new EditAddressPage()
  }
  /**
   * Used to verify alert message from address book page
   * @param expectedMsg : pass expected messaged as string
   */
  verifyAlertMessage (expectedMsg: string) {
    this.util.verifyDialogAlertMsg(expectedMsg, this.alertMsg)
    return this
  }
  /**
   * Method is used to close the alert message
   */
  closeAlertMsg () {
    this.alertClose.waitForDisplayed()
    this.alertClose.click()
  }
  /**
   * Used to verify that no address card displayed
   */
  verifyNoAddressCardDisplay () {
    expect(this.addresscard.isDisplayed()).toBe(
      false,
      'address card is displayed'
    )
    return this
  }
  /**
   * Used to verify the address card display
   */
  verifyAddressCardDisplay () {
    expect(this.addresscard.isDisplayed()).toBe(
      true,
      'address card is not displayed'
    )
    return this
  }
  /**
   * Used to delete the address from address book
   * @param index pass index as address card number
   */
  deleteAddress (index: number) {
    index = index - 1
    $$(this.deleteLink)[index].waitForDisplayed()
    $$(this.deleteLink)[index].click()
    return this
  }
  /**
   * On pop up of confirming delete address, used to delete
   */
  confirmDelete () {
    this.util.handleOnClickBtn('Confirm Delete')
  }
  /**
   * On pop up of confirming delete address, used to cancel if not want to delete the address from an address book page
   */
  cancelDelete () {
    this.util.handleOnClickBtn('Cancel')
  }
  /**
   * Used to delete all the available address from address book page
   */
  deleteAllAddress () {
    $$(this.deleteLink).forEach(del => {
      del.click()
      this.confirmDelete()
      browser.waitUntil(() => this.alertClose.isDisplayed() === true, {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: 'Alert Close is not displayed'
      })
      this.alertClose.click()
      browser.pause(envConfig.timeout.lowtimeout)
    })
  }
}
