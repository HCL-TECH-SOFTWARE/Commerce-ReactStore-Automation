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
import { AddressBookPage } from "../b2b/AddressBookPage.po";
import { Utils } from "../Utils.po";

//AddAddressPage class is used to handle the object of add address page
export class AddAddressPage {
  newaddressTitle = $('//h4[text() = "Add a new address"]');
  addressType = $('//input[@checked=""]');
  fieldLocator = "//input[@name='field']";
  util = new Utils();

  constructor() {}

  /**
   * Validate function used to validate the new address title from the add address page
   */
  async validate() {
    await expect(await this.newaddressTitle.isDisplayed()).toBe(true);
    // the fieldset changes to the radio with the "checked" attribute after DOM loads -- wait a little extra
    await browser.pause(1000);
  }

  /**
   * Used to select address type
   * @param addresstype : pass string as Shipping/Billing
   */
  async selectAddressType(addresstype: string) {
    const selector = `//input[@value="${addresstype}"]`;
    const typeSelector = await $(selector);
    await typeSelector.waitForExist();
    await typeSelector.click();
    return this;
  }

  /**
   * Used to add address details on the add address page
   * @param addressDetails : pass address as a json object where key as a address field and value as input field value
   */
  async add(addressDetails: object) {
    await this.util.addDetails(addressDetails);
  }

  /**
   * Used to submit an address/create address
   */
  async submitAddress() {
    await this.util.buttonClickById("button-address-book-create-address");
  }

  /**
   * method to cancel address on add new address page
   */
  async cancel() {
    await this.util.buttonClickById("button-address-book-cancel");
    return new AddressBookPage();
  }

  /**
   * Used to verify Btn disable
   * @param buttonName : pass button name as a string
   */
  async verifyButtonNotClickable(buttonName: string) {
    await this.util.verifyBtnNotClickable(buttonName);
  }

  /**
   * Used to verify error msg text
   * @param fieldName : pass field name as a string
   * @param expectedMsg : pass expeceted message as a string
   */
  async verifyErrorMsg(fieldName: string, expectedMsg: string) {
    const selector = $(this.fieldLocator.replace(/field/, fieldName) + "//parent::div//following-sibling::p");
    await selector.waitForDisplayed();
    await expect(await selector.getText()).toBe(expectedMsg);
    return this;
  }

  /**
   * Used to verify invalid css
   * @param fieldName : pass field name as a string
   * @param cssPropery : pass cssProperty as a string
   * @param expectedCssValue : pass expected expectedCssValue as a string
   */
  async verifyInputCss(fieldName: string, cssProperty: string, expectedCssValue: string) {
    const selector = this.fieldLocator.replace(/field/, fieldName) + "//following-sibling::fieldset";
    const cssValue = (await $(selector).getCSSProperty("border-color")).value;
    await expect(cssValue).toContain(expectedCssValue);
    return this;
  }
}
