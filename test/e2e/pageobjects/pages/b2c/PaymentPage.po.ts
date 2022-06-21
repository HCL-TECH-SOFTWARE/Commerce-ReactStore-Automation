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
import { ReviewOrderPage } from "./ReviewOrderPage.po";
import * as envConfig from "../../../../../env.config.json";

//PaymentPage class is to handle the object of payment pages
export class PaymentPage {
  util = new Utils();
  pageheading = $("//*[contains(text(),'Payment Details')]");
  codPayment = $("//*[contains(text(),'Cash on delivery')]");
  payoptions = "label.pay-option";
  usethisaddress = "//p[text() = 'Use This Address']";
  revieworderButton = "button[data-testid='button-submit-payment-go-to-review']";
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]";
  useThisAddress = "//h6[text()='shippingName']/../../following-sibling::div//button/span/p[text()='Use This Address']";
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}

  /**
   * method to validate page load
   */
  async validate() {
    await this.pageheading.waitForDisplayed();
    await (await $$(this.payoptions))[0].waitForDisplayed();
  }

  /**
   * method to select payment option
   * @param payoption : pass payment option as a string
   */
  async selectPayOption(payoption: string) {
    const m = "selectPayOption";

    let exist: boolean = false;
    await this.util.waitForElementTobeVisible(await $(this.payoptions));
    const all = await $$(this.payoptions);
    const n = all.length;
    Utils.log(m, `Found ${n} payment options`);

    await all[0].scrollIntoView();

    for (let i = 0; i < n; i++) {
      const text = await all[i].getText();

      Utils.log(m, `Current payment option: ${text}`);
      if (text === payoption) {
        Utils.log(m, `Payment option available ${text}`);
        await browser.pause(2000);
        await all[i].waitForClickable();
        await all[i].click();
        exist = true;
        break;
      }
    }

    if (!exist) {
      const msg = "payment option is not present";
      Utils.log(m, msg);
      throw new Error(msg);
    }
  }
  /**
   * method to navigate new address page
   */
  async newAddress() {
    await this.util.handleOnClickBtn("Create a New Address");
  }
  /**
   * method to select existing address
   */
  async selectExistingAddress(index: number) {
    const adddressSelector = await $$(this.usethisaddress);
    await browser.waitUntil(
      async () =>
        (await adddressSelector[index].isDisplayed()) === true &&
        (await adddressSelector[index].isClickable()) === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: "Address does not exist at given index " + index,
      }
    );
    await adddressSelector[index].click();
  }
  /**
   * method to add address details
   * @param addressData : pass addressData as a json object, key as address field name and value as input field value
   */
  async add(addressData: object) {
    await this.util.addDetails(addressData);
  }
  /**
   * method to save and select newly created address
   */
  async saveAndSelect() {
    await this.util.buttonClickById("button-checkout-address-submit");
  }
  /**
   * Method is used to verify color of save and select button
   * @param color pass RGB value
   */
  async verifySaveAndSelectBtnColor(color: string) {
    await this.util.verifyColorRGBValue(this.btnColorElement, color);
  }
  /**
   * method to validate save and select not display
   */
  async verifySaveAndSelectNotDisplayed() {
    await this.util.verifyBtnNotPresent("Save and select this address");
  }
  /**
   * method to navigate review order page
   * @returns ReviewOrderPage()
   */
  async reviewOrder() {
    await $(this.revieworderButton).waitForEnabled();
    await $(this.revieworderButton).scrollIntoView();
    await this.util.buttonClickById("button-submit-payment-go-to-review");

    const rc = await ReviewOrderPage.get();
    return rc;
  }
  /**
   * Method is used to select billing address based on the name
   * @param name : pass Shipping nickName / billing nickname
   */
  async selectBillingAddress(name: string) {
    const selector = this.useThisAddress.replace(/shippingName/, name);
    await browser.waitUntil(async () => (await $(selector).isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Unable to add billing address",
    });
    await $(selector).click();
  }
}
