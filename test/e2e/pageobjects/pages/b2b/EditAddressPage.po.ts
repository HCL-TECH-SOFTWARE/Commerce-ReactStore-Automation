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
//EditAddressPage class is used to handle the object of Edit Address Page
export class EditAddressPage {
  //edit address page
  editaddressTitle = $('//h4[text() = "Edit Address"]');
  addressType = $('//input[@checked=""]');
  cancelButton = $("//span[text()='Cancel']");
  util = new Utils();

  constructor() {}

  /**
   * Used to validate edit address page title
   */
  async validate() {
    await expect(await this.editaddressTitle.isDisplayed()).toBe(true);
  }
  /**
   * Used to verify address type
   * @param addresstype pass expected address type
   */
  async verifyAddressType(addresstype: string) {
    const selectedValue = await this.addressType.getAttribute("Value");
    await expect(selectedValue).toMatch(addresstype);
    return this;
  }
  /**
   * Used to verfy existing details
   * @param expectedDetails : pass expected details
   */
  async verifyExistingDetails(expectedDetails: object) {
    await this.util.verifyDetails(expectedDetails);
  }
  /**
   * Used to click on cancel button/link
   */
  async cancel() {
    await this.cancelButton.scrollIntoView();
    await this.util.handleOnClickBtn("Cancel");
    return new AddressBookPage();
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
  async submit() {
    await this.util.verifyBtnEnable("Save Changes");
    await this.util.handleOnClickBtn("Save Changes");
    return new AddressBookPage();
  }
}
