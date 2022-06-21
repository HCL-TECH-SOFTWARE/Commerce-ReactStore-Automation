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
import * as envConfig from "../../../../../env.config.json";
import { RestHelper } from "../../base/RestHelper";

//Product Detail Page Page class is used to handle the object of Product Detail Page
export class ProductDetailPage {
  util = new Utils();
  helper = new RestHelper();
  productName = $("//h4[@itemprop = 'name']");
  productSKU = $("//p[contains(text(), 'SKU')]");
  shortDescription = $("//p[@itemprop = 'description']");
  productLongDescription = $("//div[@role='tabpanel']/div");
  productSubtypeQuantity = $("table[data-testid='table']");
  pleaseSignInToShop = $("//a/span[@class='MuiButton-label']");
  sign_in = $("//h1[text()='Sign In']");
  addToOrder = $("//button/span[text()='Add to Order']");
  addToCartAlertMessage = "//div[@class='MuiAlert-message']";
  addToCartConfirmation = "div.MuiAlert-message";
  productImages = "//div[contains(@class, 'product-image')]//img[@itemprop='image']";
  skuQ = `//table[contains(@class,'responsiveTable')]/tbody/tr/td/span[text()="\${sku}"]/ancestor::td/following-sibling::td[last()-1]//input[@type='text']`;
  // cart-page nav
  miniCartId = "button-header-mini-cart-button";
  viewFullCartId = "button-handle-cart-on-click";
  cartPageHeading = `//h1[text()="Shopping Cart"]`;

  static async get() {
    const p = new ProductDetailPage();
    await p.validate();
    return p;
  }

  private constructor() {}

  /**
   * used to validate product name , product sku , product description
   */
  async validate() {
    await this.productName.waitForDisplayed();
    await this.productSKU.waitForDisplayed();
    await this.shortDescription.waitForDisplayed();
  }
  /**
   * Used to verfiy Product Information
   * @param subproduct : pass json array of child of subproduct from sappireproduct.json
   */
  async verifyProductInfo(subproduct: object) {
    for (const [key, value] of Object.entries(subproduct)) {
      if (key !== "subproduct") {
        switch (key) {
          case "name":
            await expect(await this.productName.getText()).toMatch(value);
            break;
          case "sku":
            await expect(await this.productSKU.getText()).toBe(value);
            break;
          case "shortDescription":
            await expect(await this.shortDescription.getText()).toBe(value);
            break;
          case "longDescription":
            await expect(await this.productLongDescription.getText()).toBe(value);
            break;
          case "numberofsubtype":
            expect(await this.productSubtypeQuantity.$$(".//tr[@style='display: none;']").length).toBe(Number(value));
            break;
        }
      }
    }
  }
  /**
   * Used to verify sub product type
   * @param productInfo : json object of sub product type 1/type 2 from sappireproduct.json
   */
  async verifySubProductType(productInfo: object) {
    const m = "ProductDetailPage.verifySubProductType";
    const subcategories: string[] = Object.keys(productInfo);
    Utils.log(m, subcategories);

    let skuValue;
    let i = 0;
    for (const [key, value] of Object.entries(productInfo)) {
      if (key === "sku") {
        skuValue = await this.productSubtypeQuantity.$(".//tr/td/span").getText();
        expect(skuValue).toBe(value);
        Utils.log(m, "Pass = " + key);
      } else if (key !== "quantity") {
        const text = await this.productSubtypeQuantity
          .$(`.//tr/td/span[text()="${skuValue}"]/ancestor::td/following-sibling::td[${i}]`)
          .getText();
        expect(text).toBe(value);
        Utils.log(m, "Pass = " + key);
      }
      ++i;
    }
  }
  /**
   * Used to verify quantity column is disabled
   * @param sku: pass skuName as string
   */
  async verifyQuantityIsDisabled(sku: string) {
    const sel = this.skuQ.replace(/\$\{sku\}/, sku);
    const loc = $(sel);
    const isEnabled = await loc.isEnabled();
    if (!isEnabled) await expect(isEnabled).toMatch("false");
  }
  /**
   * Used to set quality with skuname
   * @param sku: pass skuname as string
   * @param quantity: pass quantity as number
   */
  async quantity(sku: string, quantity: number) {
    const sel = this.skuQ.replace(/\$\{sku\}/, sku);
    const loc = $(sel);
    await loc.scrollIntoView();
    const isEnabled = await loc.isEnabled();
    if (isEnabled) {
      await loc.setValue(quantity);
      await browser.pause(500); // give contextual-table some time to finish updating
    }
  }
  /**
   * Used to click on pleasesingintoshop button
   */
  async pleaseSignIntoShop() {
    const IsEnabled = await this.pleaseSignInToShop.isEnabled();
    await expect(IsEnabled).toBe(true);
    if (IsEnabled) {
      await this.pleaseSignInToShop.click();
    }
  }
  /**
   * Used to verify sing in page displayed
   */
  async verifySignInPage() {
    await this.sign_in.waitForDisplayed();
    await expect(await this.sign_in.isDisplayed()).toBe(true);
  }
  /**
   * Used to click on addtoCurrentOrder button
   */
  async addToCurrentOrder() {
    await this.addToOrder.waitForDisplayed();
    await this.addToOrder.click();
  }
  /**
   * Used to verify Alert Message
   * @param expectedMsg : pass expected message
   */
  async verifyAlertMessage(expectedMsg: string) {
    await this.util.verifyDialogAlertMsg(expectedMsg, this.addToCartAlertMessage);
  }

  async navFromMiniCart() {
    await browser.waitUntil(async () => await $(`//*[@data-testid="${this.viewFullCartId}"]`).isDisplayed());
    await this.util.buttonClickById(this.viewFullCartId);
    await browser.waitUntil(async () => await $(this.cartPageHeading).isDisplayed());
  }

  /**
   * Method is used to verify that product is out of stock or not
   * @param skuName : pass skuname
   * @param verification: value to verify against
   */
  async verifyOutOfStockProduct(skuName: string, verification: boolean = false) {
    const m = "ProductDetailPage.verifyOutOfStockProduct";
    const sel = `//table/tbody//td/span[text()="${skuName}"]/ancestor::td/following-sibling::td[last()]//span[text()[contains(.,"Out of")]]`;
    const oos = await $(sel).isDisplayed();
    Utils.log(m, `Out of stock: ${oos}`);
    expect(oos).toBe(verification);
  }

  /**
   * Verify Insufficent alert message
   * @param expectedMsg : pass expected message
   */
  async verifyDialogAlertMsg(expectedMsg: string) {
    await this.util.verifyDialogAlertMsg(expectedMsg, this.addToCartConfirmation);
  }
  /**
   * Method is used to verify image loaded properly on PDP
   * @returns ProductDetailPage()
   */
  async verifyImagesIsLoaded() {
    await browser.pause(envConfig.timeout.maxtimeout);
    await this.helper.verifyImageLoadedBySource(this.productImages);
    return this;
  }
}
