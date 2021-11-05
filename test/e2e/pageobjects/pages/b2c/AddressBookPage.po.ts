/*
# Copyright 2021 HCL America, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# The script sets up necessary environment variables to run DX in a docker-compose environment
*/
import { AddAddressPage } from './AddAddressPage.po'
import { EditAddressPage } from './EditAddressPage.po'
import { Utils } from '../Utils.po'
import * as envConfig from '../../../../../env.config.json'

//AddressBookPage class is to handle the object of address book page
export class AddressBookPage {
  util = new Utils()
  pageName = '#address-book-title'
  addresscard = $('div.address-card')
  sidePanelAddressBookMenu = "//span[contains(text(), 'Address Book')]"
  alertMsg = $("//div[@class='MuiAlert-message']")
  editLink = $$("//a[text() = 'Edit']")
  deleteLink = $$("//p[text() = 'Delete']")
  confirmDeleteBtn = $('button.confirm-action-button')
  timeoutValue: number = envConfig.timeout.maxtimeout
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    this.util.verifyText('Address Book', this.pageName, 'pagename')
    this.util.verifyText('Address Book', this.sidePanelAddressBookMenu, 'menu')
  }
  /**
   * method to navigate add new address page
   * @returns AddAddressPage()
   */
  addAddress (): AddAddressPage {
    this.util.handleOnClickBtn('Add Address')
    return new AddAddressPage()
  }
  /**
   * method to click on delete
   * @returns EditAddressPage()
   */
  removeAddress (index: number): AddressBookPage {
    this.deleteLink[index - 1].waitForDisplayed()
    this.deleteLink[index - 1].click()
    return this
  }
  /**
   * method to confirm delete address
   */
  confirmDelete () {
    this.confirmDeleteBtn.waitForDisplayed()
    this.confirmDeleteBtn.click()
  }
  /**
   * method to navigate edit address page
   * @returns EditAddressPage()
   */
  editAddress (index: number): EditAddressPage {
    this.editLink[index - 1].waitForDisplayed()
    this.editLink[index - 1].click()
    return new EditAddressPage()
  }
  /**
   * method to validate address card
   */
  verifyAddressCardDisplayed () {
    expect(this.addresscard.isDisplayed()).toBe(
      true,
      'Created address is not displayed yet'
    )
  }
  /**
   * method to validate alert message
   * @param expecetedAlertMessage : pass expected alert msg as a string
   */
  verifyDialogAlertMsg (expecetedAlertMessage: string) {
    this.alertMsg.waitForDisplayed()
    browser.waitUntil(
      () => this.alertMsg.getText().includes(expecetedAlertMessage),
      {
        timeout: this.timeoutValue,
        timeoutMsg: 'alert message for successful address save is not displayed'
      }
    )
  }
}
