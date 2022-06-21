/*
# Copyright 2022 HCL America, Inc.
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
*/
import { AddAddressPage } from "./AddAddressPage.po";
import { EditAddressPage } from "./EditAddressPage.po";
import { Utils } from "../Utils.po";
import envConfig from "../../../../../env.config.json";

//AddressBookPage class is to handle the object of address book page
export class AddressBookPage {
  util = new Utils();
  pageName = "#address-book-title";
  noAddressMessage = $("div.MuiGrid-direction-xs-column:nth-child(2) > div:nth-child(2) > div:nth-child(1)");
  addresscard = $("div.address-card");
  sidePanelAddressBookMenu = "//span[contains(text(), 'Address Book')]";
  alertMsg = $("//div[@class='MuiAlert-message']");
  alertClose = $("//button[@title='Close']");
  get editLink() {
    return $$("//a[text() = 'Edit']");
  }
  deleteLink = $$("//p[text() = 'Delete']");
  confirmDeleteBtn = $("button.confirm-action-button");
  confirmCancelBtn = $("button.cancel-action-button");
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}
  /**
   * method to validate page load
   */
  async validate() {
    await this.util.verifyText("Address Book", this.pageName, "pagename");
    await this.util.verifyText("Address Book", this.sidePanelAddressBookMenu, "menu");
  }
  /**
   * method to navigate add new address page
   * @returns AddAddressPage()
   */
  async addAddress() {
    // please update to testid
    await this.util.handleOnClickBtn("Add Address");
    return new AddAddressPage();
  }
  /**
   * method to click on delete
   * @returns EditAddressPage()
   */
  async removeAddress(index: number) {
    await (await this.deleteLink)[index - 1].waitForDisplayed();
    await (await this.deleteLink)[index - 1].click();
    return this;
  }
  /**
   * method to confirm delete address
   */
  async confirmDelete() {
    await this.confirmDeleteBtn.waitForDisplayed();
    await this.confirmDeleteBtn.click();
  }
  /**
   * method to cancel delete address
   */
  async cancelDelete() {
    await this.confirmCancelBtn.waitForDisplayed();
    await this.confirmCancelBtn.click();
  }
  /**
   * method to navigate edit address page
   * @returns EditAddressPage()
   */
  async editAddress(index: number) {
    const _editLink = await this.editLink;
    await _editLink[index - 1].waitForDisplayed();
    await _editLink[index - 1].click();
    return new EditAddressPage();
  }
  /**
   * method to validate no address card
   */
  async verifyNoAddressCardDisplayed() {
    await expect(await this.addresscard.isDisplayed()).toBe(false);
  }
  /**
   * method to validate address card
   */
  async verifyAddressCardDisplayed() {
    await expect(await this.addresscard.isDisplayed()).toBe(true);
  }
  /**
   * method to validate alert message
   * @param expectedAlertMessage : pass expected alert msg as a string
   */
  async verifyDialogAlertMsg(expectedAlertMessage: string) {
    const alert = await browser.getAlertText();
    await expect(alert).toEqual(expectedAlertMessage);
  }
  /**
   * method to validate saved address card data
   * @param expectedAddressData : pass expected address data as a object
   */
  async verifyAddressCardDetails(expectedAddressData: object) {
    await browser.pause(envConfig.timeout.lowtimeout);
    for (const [key, value] of Object.entries(expectedAddressData)) {
      const selector = await this.addresscard.$("//p[contains(text(), '" + value + "')]");
      console.log("address card not contains" + key + "  value as :" + value);
      await expect(await selector.isDisplayed()).toBe(true);
    }
  }
  /**
   * Used to delete all the available address from address book page
   */
  async deleteAllAddress() {
    const _deleteLink = await this.deleteLink;
    for (const del of _deleteLink) {
      await del.click();
      await this.confirmDelete();
      await browser.pause(envConfig.timeout.lowtimeout);
      await this.alertClose.click();
    }
  }
}
