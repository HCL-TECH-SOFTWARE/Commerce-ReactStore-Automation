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
import { Utils } from "../Utils.po";
import { AddAddressPage } from "./AddAddressPage.po";
import { EditAddressPage } from "./EditAddressPage.po";
import * as envConfig from "../../../../../env.config.json";

//AddressBookPage class used to handle the object of AddressBookPage
export class AddressBookPage {
  addressbookTitle = '//h3[@id = "address-book-title"]';
  addressbookMenu = '//nav//span[text() = "Address Book"]';
  alertMsg = '//div[@class="MuiAlert-message"]';
  addresscard = $("div.address-card");
  addressCardSelector = "div.address-card";
  editLink = "//a[text() = 'Edit']";
  deleteLink = "//p[text()='Delete']";
  deleteAlertMsg = "//div[contains(text(),'has been deleted successfully')]";
  alertClose = $("//button[@title='Close']");
  maxtimeoutValue: number = envConfig.timeout.maxtimeout;
  util = new Utils();

  constructor() {}

  /**
   * Used to validate the title and address book menu
   */
  async validate() {
    await this.util.verifyText("Address Book", this.addressbookTitle, "pagetitle");
    await this.util.verifyText("Address Book", this.addressbookMenu, "menu");
  }
  /**
   * Used to add address on address book page
   */
  async addAddress() {
    await this.util.buttonClickById("button-address-book-add");
    const rc = new AddAddressPage();
    await rc.validate();
    return rc;
  }

  /**
   * Used to edit the address on address book page
   * @param index pass address card number as a number
   */
  async editAddress(index: number = -1) {
    const links = await $$(this.editLink);
    index = index === -1 ? links.length - 1 : index - 1;
    await links[index].waitForClickable();
    await links[index].click();
    return new EditAddressPage();
  }

  /**
   * Used to verify alert message from address book page
   * @param expectedMsg : pass expected messaged as string
   */
  async verifyAlertMessage(expectedMsg: string) {
    await this.util.verifyDialogAlertMsg(expectedMsg, this.alertMsg);
    return this;
  }
  /**
   * Method is used to close the alert message
   */
  async closeAlertMsg() {
    await this.alertClose.waitForClickable();
    await this.alertClose.click();
  }

  async getNumAddressCards() {
    const cards = await $$(this.editLink);
    return cards.length;
  }

  /**
   * Verify n number of address card are displayed
   * @returns this
   */
  async verifyNumAddressCards(n: number) {
    const len = await this.getNumAddressCards();
    await expect(len).toEqual(n);
    return this;
  }

  /**
   * Used to verify the address card display
   */
  async verifyAddressCardDisplay() {
    await expect(await this.addresscard.isDisplayed()).toBe(true);
    return this;
  }
  /**
   * Used to delete the address from address book
   * @param index pass index as address card number
   */
  async deleteAddress(index: number = -1) {
    const links = await $$(this.deleteLink);
    index = index === -1 ? links.length - 1 : index - 1;
    await links[index].waitForClickable();
    await links[index].click();
    return this;
  }
  /**
   * On pop up of confirming delete address, used to delete
   */
  async confirmDelete() {
    await this.util.handleOnClickBtn("Confirm Delete");
  }
  /**
   * On pop up of confirming delete address, used to cancel if not want to delete the address from an address book page
   */
  async cancelDelete() {
    await this.util.handleOnClickBtn("Cancel");
  }
  /**
   * Used to delete all the available address from address book page
   */
  async deleteAllAddress() {
    await this.validate();
    const links = await $$(this.deleteLink);

    for (const del of links) {
      await del.waitForClickable();
      await del.click();
      await this.confirmDelete();
      await this.alertClose.waitForClickable();
      await this.alertClose.click();
    }
  }
  /**
   * method to validate saved address card data
   * @param expectedAddressData : pass expected address data as a object
   */
  async verifyAddressCardDetails(expectedAddressData: object, cardNumber: number = -1) {
    const cards = await $$(this.addressCardSelector);
    const index = cardNumber === -1 ? cards.length - 1 : cardNumber - 1;
    await browser.pause(envConfig.timeout.lowtimeout);
    const card = cards[index];
    for (const [, value] of Object.entries(expectedAddressData)) {
      const selector = await card.$(`//p[contains(text(), "${value}")]`);
      await expect(await selector.isDisplayed()).toBe(true);
    }
  }
}
