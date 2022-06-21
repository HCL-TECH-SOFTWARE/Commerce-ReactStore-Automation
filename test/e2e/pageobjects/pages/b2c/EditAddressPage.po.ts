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
import { AddressBookPage } from "./AddressBookPage.po";

//EditAddressPage class is to handle the object of edit address page
export class EditAddressPage {
  util = new Utils();
  pageName = "//span//h4[contains(text(), 'Edit Address')]";
  addressType = $('//input[@checked=""]');
  //Buttons
  cancelButton = $("button.MuiButton-contained:nth-child(1)");
  savechangesButon = $("button.MuiButtonBase-root:nth-child(2)");
  constructor() {}
  /**
   * method to validate page load
   */
  async validate() {
    await $(this.pageName).waitForDisplayed();
  }
  /**
   * method to save address changes
   * @returns AddressBookPage()
   */
  async saveChanges() {
    await this.util.handleOnClickBtn("Save Changes");
    return new AddressBookPage();
  }
  /**
   * method to cancel address changes
   * @returns AddressBookPage()
   */
  async cancel() {
    await this.util.handleOnClickBtn("Cancel");
    return new AddressBookPage();
  }
  /**
   * method to validate save changes is enable
   */
  async verifySaveChangesButtonEnabled() {
    await expect(await this.savechangesButon.isClickable()).toBe(true);
  }
  /**
   * method to validate selected address type
   * @param addresstype : pass expected address type as a string
   * @returns EditAddressPage()
   */
  async verifyAddressType(addresstype: string) {
    const selectedValue = await this.addressType.getAttribute("Value");
    await expect(selectedValue).toMatch(addresstype);
    return this;
  }
  /**
   * method to validate existing address card
   * @param address : pass address as a json object where key as a address field and value as an expected input value
   * @returns EditAddressPage()
   */
  async verifyExistingAddress(address: object) {
    await this.util.verifyDetails(address);
    return this;
  }
  /**
   * method to edit address details
   * @returns EditAddressPage()
   */
  async edit(addressData: object) {
    await this.util.editDetails(addressData);
    return this;
  }
  /**
   * method to submit address details
   * @returns AddressBookPage()
   */
  async sumbit() {
    await this.util.verifyBtnEnable("Save Changes");
    await this.util.handleOnClickBtn("Save Changes");
    return new AddressBookPage();
  }
}
