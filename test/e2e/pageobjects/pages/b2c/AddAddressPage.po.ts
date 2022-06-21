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
import envConfig from "../../../../../env.config.json";

//AddAddressPage class is to handle the object of add address page
export class AddAddressPage {
  util = new Utils();
  addressDialogTitle = $(".MuiBreadcrumbs-ol");
  fieldLocator = "//input[@name= 'field']";
  pageName = $("//h4[contains(text(), 'Add a new address')]");
  //Buttons
  addAddressCancelButton = $("button.MuiButton-contained:nth-child(1)");
  createAddressButton = $("button[data-testid='button-address-book-create-address']");
  constructor() {
    this.validate();
  }
  /**
   * method to validate page load
   */
  async validate() {
    await this.pageName.waitForDisplayed();
  }
  /**
   * method to submit address details
   * @returns AddressBookPage()
   */
  async submit() {
    await this.util.verifyBtnEnable("Create Address");
    await this.util.handleOnClickBtn("Create Address");

    return new AddressBookPage();
  }
  /**
   * method to add address on add new address page
   * @param addressData pass address as a json object where key as a address field and value as an input field value
   */
  async add(addressData: object) {
    await this.util.addDetails(addressData);
  }
  /**
   * method to cancel address on add new address page
   */
  async cancel() {
    await this.util.handleOnClickBtn("Cancel");
    return new AddressBookPage();
  }
  /**
   * method to select address type
   * @param addresstype pass string as Shipping/Billing/Both
   * @returns AddAddressPage()
   */
  async selectAddressType(addresstype: string) {
    const m = "AddAddressPage.selectAddressType";
    Utils.log(m, "Address type is " + addresstype);
    if (addresstype !== "Shipping") {
      const addressSelector = $("//input[@value='" + addresstype + "']");
      await addressSelector.click();
      let count = 0;
      await browser.waitUntil(
        async () => {
          ++count;
          const sel = await addressSelector.isSelected();
          if (!sel) {
            await addressSelector.click();
            count = 0;
          }

          // the radio is "truly" selected if we've verified like 5 times that it hasn't moved back to shipping
          return count === 5;
        },
        { timeout: envConfig.timeout.maxtimeout, interval: 1000 }
      );
    }
    return this;
  }
  /**
   * method to validate create address button disable
   */
  async verifyCreateAddressButtonDisable() {
    await expect(await this.createAddressButton.isClickable()).toBe(false);
  }
  /**
   * method to validate create address button enable
   */
  async verifyCreateAddressButtonEnable() {
    await expect(await this.createAddressButton.isClickable()).toBe(true);
  }
  /**
   * Used to verify Btn not clickable
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
    let selector;
    if (fieldName !== null) {
      switch (fieldName) {
        case "nickName":
          selector = "//p[@id='newAddress-nickName-helper-text']";
          await expect(await $(selector).getText()).toBe(expectedMsg);
          break;
        case "phone":
          selector = "//p[@id='newAddress-phone-helper-text']";
          await expect(await $(selector).getText()).toBe(expectedMsg);
          break;
        case "email":
          selector = "//p[@id='newAddress-email-helper-text']";
          await expect(await $(selector).getText()).toBe(expectedMsg);
          break;
      }
    }
    return this;
  }
  /**
   * Used to verify invalid css
   * @param fieldName : pass field name as a string
   * @param cssPropery : pass cssProperty as a string
   * @param expectedCssValue : pass expected expectedCssValue as a string
   */
  async verifyInputCss(fieldName: string, cssProperty: string, expectedCssValue: string) {
    let selector;
    let cssValue;
    if (fieldName !== null) {
      switch (fieldName) {
        case "nickName":
          selector = this.fieldLocator.replace(/field/, "nickName") + "//following-sibling::fieldset";
          cssValue = (await $(selector).getCSSProperty("border-color")).value;
          await expect(cssValue).toContain(expectedCssValue);
          break;
        case "phone":
          selector = this.fieldLocator.replace(/field/, "phone1") + "//following-sibling::fieldset";
          cssValue = (await $(selector).getCSSProperty("border-color")).value;
          await expect(cssValue).toContain(expectedCssValue);
          break;
        case "email":
          selector = this.fieldLocator.replace(/field/, "email1") + "//following-sibling::fieldset";
          cssValue = (await $(selector).getCSSProperty("border-color")).value;
          await expect(cssValue).toContain(expectedCssValue);
          break;
      }
    }
    return this;
  }
}
