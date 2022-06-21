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
import { PaymentPage } from "./PaymentPage.po";
import { Utils } from "../Utils.po";
import { RestHelper } from "../../base/RestHelper";
import * as envConfig from "../../../../../env.config.json";

//ShippingDetailPage class is to handle the object of shipping detail page
export class ShippingDetailPage {
  util = new Utils();
  helper = new RestHelper();
  pageHeading = $("//*[contains(text(),'Shipping Details')]");
  shippingAddressLabel = $("//*[contains(text(),'Shipping Address')]");
  shippingMethodLabel = $("//*[contains(text(),'Shipping Method')]");
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]";
  //New address
  addNewAddress = $$("//p[@class= 'MuiTypography-root sc-aemoO bPjFCG MuiTypography-h4']");
  usethisaddress = "//p[text() = 'Use This Address']";
  editAddress = "//p[text() = 'Edit']";

  //Shipping Method
  shipMethod = `//label[contains(@class,"MuiFormControlLabel-root")]//p[contains(text(),"\${method}")]`;
  shipToMultipleAddress = $("//span[contains(@class,'MuiSwitch-switchBase')]");
  orderItemTable = "//tbody/tr/td";
  //Select common address
  commonAddressBtn = "//button/span[text()= 'Select Shipping Address and Method']";
  //product images
  productImages = "img.MuiAvatar-img";

  timeoutValue: number = envConfig.timeout.maxtimeout;

  static async get() {
    const p = new ShippingDetailPage();
    await p.validate();
    return p;
  }

  private constructor() {}

  /**
   * method to validate page load
   */
  async validate() {
    await this.pageHeading.waitForDisplayed();
    await this.shippingAddressLabel.waitForDisplayed();
    await this.shippingMethodLabel.waitForDisplayed();
  }
  /**
   * method to navigate new address page
   */
  async newAddress() {
    await this.util.buttonClickById("button-checkout-new-address-button");
  }
  /**
   * method to add address details
   * @param addressData : pass address as a json object where key as field name and value as field input value
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
   * method to validate Save and Select is not display
   */
  async verifySaveAndSelectNotDisplayed() {
    await this.util.verifyBtnNotPresent("Save and select this address");
  }
  /**
   * method to select shipping method
   * @param methodName : pass ship method as a string
   * @returns ShippingDetailPage()
   */
  async selectShippingMethod(methodName: string) {
    const sel = this.shipMethod.replace(/\$\{method\}/, methodName);
    const loc = $(sel);
    await loc.waitForClickable();
    await loc.click();
    return this;
  }
  /**
   * method to navigate payment page for single shipping
   * @returns PaymentPage()
   */
  async continuePayment() {
    await this.util.buttonClickById("button-single-shipping-can-continue");
    return new PaymentPage();
  }
  /**
   * method to navigate payment page for multiple shipping
   * @returns PaymentPage()
   */
  async continuePaymentForMultipleShipment() {
    await this.util.buttonClickById("button-shipping-can-continue");
    return new PaymentPage();
  }
  /**
   * Method is used to click on Ship to multiple Addresses
   */
  async shipToMultipleAddressBtn() {
    const _sm = await this.shipToMultipleAddress;
    await this.util.waitForElementTobeVisible(_sm);
    await _sm.waitForClickable();
    await _sm.click();
    await $(`//table//td//button[@data-testid="button-multiple-shipment-select-address-method"]`).waitForExist();
  }

  /**
   * Method to Select Shipping Address and Method with sku name
   * @param skuName : pass skuName
   */
  async selectShippingAddressAndMethod(skuName: string) {
    await this.pageHeading.scrollIntoView({ block: "center" });
    const actualSkuName = await $(
      `${this.orderItemTable}/p[text()[contains(.,"${skuName}")]]/..//following-sibling::td[2]/button//p`
    );
    await this.util.waitForElementTobeVisible(actualSkuName);
    await actualSkuName.click();
  }
  /**
   * Method to Select Shipping Address and Method link is Disabled
   * @param skuName : pass skuName
   */
  async verifyShippingAddressMethodLinkIsDisabled(skuName: string) {
    await this.pageHeading.scrollIntoView({ block: "center" });
    const checkboxSkuName = this.orderItemTable + "/p[text()='" + skuName + "']/../preceding-sibling::td//input";
    await $(checkboxSkuName).click();
    const shippingDetailLink = this.orderItemTable + "/p[text()='" + skuName + "']/..//following-sibling::td[2]/button";
    await expect(await $(shippingDetailLink).getAttribute("disabled")).toBe("true");
    await $(checkboxSkuName).click();
  }
  /**
   * Method to Select Shipping Address and Method for multiple product
   */
  async selectCommonAddressForMultiProduct() {
    await browser.waitUntil(
      async () =>
        (await $(this.commonAddressBtn).isDisplayed()) === true &&
        (await $(this.commonAddressBtn).isEnabled()) === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: "Select Shipping Address and Method button is either not displayd or enabled",
      }
    );
    await $(this.commonAddressBtn).click();
  }
  /**
   * Method is used to click on confirm selection
   */
  async confirmSelection() {
    const loc = "//button/span[text()='Confirm Selection']";
    await browser.waitUntil(async () => await $(loc).isDisplayed(), {
      timeoutMsg: "Confirmation Selection button is not Displayed",
    });
    await $(loc).waitForClickable();
    await $(loc).click();
  }
  /**
   * Method used to vrify that address is added or  not
   * @param skuName : pass sku name
   */
  async verifyShippingDetailsOnShippingPage(skuName: string) {
    const actualName = this.orderItemTable + "/p[text()='" + skuName + "']/..//following-sibling::td[2]/p";
    await browser.waitUntil(
      async () => {
        const a = await $$(actualName);
        return a.length === 4;
      },
      {
        timeout: envConfig.timeout.midtimeout,
        interval: 1000,
        timeoutMsg: "Address is not added or is not Displayed",
      }
    );
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
   * method to edit existing address
   */
  async editExistingAddress() {
    const adddressSelector = $(this.editAddress);
    await adddressSelector.click();
  }

  /**
   * method to verify address is edited or not
   */
  async verifyAddressIsEdited(address: string) {
    await browser.waitUntil(async () => (await $$(`//p[text()="${address}"]`).length) === 2, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: `Edit doesn't appear to have been successful; searched for 2 instances of text: ${address}`,
    });
  }
  /**
   * method is used to select checkbox for given sku
   */
  async selectCheckbox(skuName: string) {
    const checkboxSelector = this.orderItemTable + "/p[text()='" + skuName + "']/..//parent::tr/td[1]//input";
    await $(checkboxSelector).waitForEnabled();
    if (await $(checkboxSelector).isSelected()) {
      console.log("Checkbox is already selected for given sku " + skuName);
    } else {
      await $(checkboxSelector).click();
    }
    return this;
  }
  /**
   * Method is used to verify image loaded properly on Cart Page
   * @returns ShoppingCartPage()
   */
  async verifyAllImagesIsLoaded() {
    await browser.pause(envConfig.timeout.midtimeout);
    await this.helper.verifyImageLoadedBySource(this.productImages);
    return this;
  }
}
