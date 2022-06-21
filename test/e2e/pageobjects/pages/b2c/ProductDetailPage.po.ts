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
import { ShoppingCartPage } from "./ShoppingCartPage.po";
import * as envConfig from "../../../../../env.config.json";
import { RestHelper } from "../../base/RestHelper";

//ProductDetailPage class is to handle the object of product detail page
export class ProductDetailPage {
  util = new Utils();
  helper = new RestHelper();
  categoryBreadcrumb = "//li[@class='MuiBreadcrumbs-li'][1]";
  plpBreadcrumb = "//li[@class='MuiBreadcrumbs-li'][2]";
  productName = $("//h4[@itemprop = 'name']");
  productSKU = $("//p[contains(text(), 'SKU')]");
  shortDescription = $("//p[@itemprop = 'description']");
  productDisplayPrice = $("//span[@class='strikethrough']");
  productOfferPrice = $("//span[@class='product-price']");
  colorSwatch = $$("//div[@aria-label='Color']//button");
  productQuantityIncrement = $(".react-numeric-input > b:nth-child(2)");
  productQuantityDecrement = $(".react-numeric-input > b:nth-child(3)");
  addToCartConfirmation = "div.MuiAlert-message";
  viewcartLink = "//a[text() = 'View Cart']";
  closeButtonOnCart = "//button[@title='Close']";
  //Tabs for product description and product descriptive details
  productLongDescription = $("//div[@aria-labelledby= 'productDetails-tab-0']");
  quantityValue = "//p[text()='Quantity']//following-sibling::p/span/input";
  imagesList = "//img[@itemprop='image']";
  page = "//div[@class = 'page']";
  addToCartButton = "//button//span[text()='Add to Cart']";

  constructor() {}
  /**
   * method to validate page load
   */
  async validate() {
    await this.productName.waitForDisplayed();
    await this.productSKU.waitForDisplayed();
  }
  /**
   * method to add item into cart
   * @returns ProductDetailPage()
   */
  async addToCart(opts: any = {}) {
    const { waitForMiniCart = true } = opts;
    await browser.waitUntil(async () => await $(`//p[text()="In stock online"]`).isDisplayed());
    await $(this.addToCartButton).waitForClickable();
    await $(this.addToCartButton).click();

    if (waitForMiniCart) {
      await browser.waitUntil(async () => await $(`//*[@data-testid="button-handle-cart-on-click"]`).isDisplayed());
    }
    return this;
  }

  /**
   * method to add item into cart by using data-testid
   * @returns ProductDetailPage()
   */
  async addToCartById(partNumber: string) {
    const testId = "button-product_add_to_cart_" + partNumber;
    await this.util.buttonClickById(testId);
    return this;
  }

  /**
   * Method is used to check whether add to cart button is enabled or not
   * @returns ProductDetailPage()
   */
  async verifyAddToCartNotEnabled() {
    await this.util.verifyBtnNotClickable("Add to Cart");
    return this;
  }
  /**
   * Method is used to verify add to cart is enabled or not
   * @returns ProductDetailPage()
   */
  async verifyAddToCartDisplayed() {
    await this.util.verifyButtonDisplay("Add to Cart");
    return this;
  }
  /**
   * method to navigate cart page
   * @returns ShoppingCartPage()
   */
  async viewCartOnConfirmationModal() {
    const vcLink = $(this.viewcartLink);
    await vcLink.waitForDisplayed();
    await vcLink.scrollIntoView({ block: "center" });
    await vcLink.click();
    const rc = await ShoppingCartPage.get();
    await rc.waitForCheckoutButton();
    return rc;
  }
  /**
   * method to close cart confirmation modal
   * @returns ProductDetailPage
   */
  async closeCartConfirmationModal() {
    await $(this.closeButtonOnCart).click();
    return this;
  }
  /**
   * Used to set quality with skuname
   * @param skuName : pass skuname as string
   * @param numberOfQuantity : pass quantity as number
   */
  async quantity(numberOfQuantity: number) {
    await Utils.setInputValue(this.quantityValue, numberOfQuantity);
    return this;
  }
  /**
   * method to increase item quantity
   * @returns ProductDetailPage()
   */
  async quantityIncrement() {
    await this.productQuantityIncrement.click();
    return this;
  }
  /**
   * method to decrease item quantity
   * @returns ProductDetailPage()
   */
  async quantityDecrement() {
    await this.productQuantityDecrement.click();
    return this;
  }
  /**
   * Used to verfiy Product Information
   * @param subproduct : pass json array of child of subproduct from sappireproduct.json
   */
  async verifyProductInfo(subproduct: object) {
    const m = "ProductDetailPage.verifyProductInfo";
    for (const [key, value] of Object.entries(subproduct)) {
      if (key !== "subproduct") {
        Utils.log(m, `${key}: ${value}`);
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
          // case 'descriptiveAttributes':
          //     if (value !== '') {
          //         index = 0;
          //         const attributes: object = value;
          //         this.productDetails.click();
          //         const nameSelector = this.descriptiveAttribute.$$('b')
          //         const valueSelector = this.descriptiveAttribute.$$('span')
          //         for (let [key1, value1] of Object.entries(attributes)) {
          //             Utils.log(m, 'Expected attribute name is -- ' + key1 + '  value is--' + value1)
          //             expect(nameSelector[index].getText()).toContain(key1, "attribute name not matches")
          //             expect(valueSelector[index].getText()).toMatch(value1, "attribute value not matches")
          //             index++;
          //         }
          //     }
          //     break;
          case "definingAttributes":
            if (value !== "") {
              const attributes: object = value;
              for (const [key2, value2] of Object.entries(attributes)) {
                if (key2 === "color" && value2 !== "") {
                  await expect(await this.colorSwatch.length).toBe(value2.length);
                }
              }
            }
            break;
        }
      }
    }
  }
  /**
   * method to select swatch on product detail page
   * @param color pass color name as a string
   */
  async selectSwatch(color: string) {
    const m = "ProductDetailPage.selectSwatch";
    Utils.log(m, `Swatch to select: ${color.toLowerCase()}`);

    const swatchSelector = "//button[contains(@style,'" + color.toLowerCase() + "')]";
    await Utils.closeMiniCart();
    await browser.waitUntil(
      async () => (await $(swatchSelector).isDisplayed()) === true && (await $(swatchSelector).isClickable()) === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: "swatch with " + color + " is either not displayed or clickable",
      }
    );
    await $(swatchSelector).click();
    return this;
  }
  /**
   * method to validate products exist
   */
  async verifyProductExists() {
    if ((await this.productName.getText()).length > 0) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * method to validate produt name
   * @param expectedProductName : pass expected product name as a string
   */
  async verifyProductName(expectedProductName: string) {
    await expect(await this.productName.getText()).toBe(expectedProductName);
  }
  /**
   * method to validate sku
   * @param expectedSKU : pass expected sku as a string
   */
  async verifySKU(expectedSKU: string) {
    const m = "ProductDetailPage.verifySKU";
    Utils.log(m, `Expected SKU name is: ${expectedSKU}`);
    await expect(await this.productSKU.getText()).toContain(expectedSKU);
  }
  /**
   * method to validate display price
   * @param expectedDisplayPrice : pass expected display price as a string
   */
  async verifyProductListPrice(expectedDisplayPrice: string) {
    const m = "ProductDetailPage.verifySKU";
    Utils.log(m, `Expected list price to be: ${expectedDisplayPrice}`);
    await expect(await this.productDisplayPrice.getText()).toContain(expectedDisplayPrice);
  }
  /**
   * method to validate offer price
   * @param expectedOfferPrice : pass expected offer price as a string
   */
  async verifyProductOfferPrice(expectedOfferPrice: string) {
    const m = "ProductDetailPage.verifySKU";
    Utils.log(m, `Expected offer price to be: ${expectedOfferPrice}`);
    await expect(await this.productOfferPrice.getText()).toContain(expectedOfferPrice);
  }
  /**
   * method to validate quantity
   * @param expectedQuantity : pass expected quantity as a string
   */
  async verifyProductQuantity(expectedQuantity: string) {
    await expect(await this.productOfferPrice.getValue()).toBe(expectedQuantity);
  }
  /**
   * method to validate alert message
   * @param msg : pass expected message as a string
   */
  async verifyAlertMessage(msg: string) {
    await this.util.verifyDialogAlertMsg(msg, this.addToCartConfirmation);
  }
  /**
   * Method is used to verify that product is out of stock or not
   * @returns isDisplayed boolean value
   */
  async verifyOutOfStockProduct() {
    const selector = $("//p[contains(text(), 'Out of stock')]");
    const isDisplayed = await selector.isDisplayed();
    return isDisplayed;
  }
  /**
   * Method is used to verify image loaded properly on PDP
   * @returns ProductDetailPage()
   */
  async verifyImagesIsLoaded() {
    await browser.pause(envConfig.timeout.midtimeout);
    await this.helper.verifyImageLoadedBySource(this.imagesList);
    return this;
  }
  /**
   * Method is used to navigate product listing page via breadcrumb
   */
  async navigateToPLP() {
    await $(this.plpBreadcrumb).scrollIntoView({ block: "center" });
    await $(this.plpBreadcrumb).click();
  }
  /**
   * Method is used to navigate product listing page
   */
  async navigateToCategory() {
    await $(this.categoryBreadcrumb).scrollIntoView({ block: "center" });
    await $(this.categoryBreadcrumb).click();
  }
}
