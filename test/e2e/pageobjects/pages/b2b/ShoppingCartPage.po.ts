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

//Shopping Cart Page class is used to handle the object of Shopping Cart Page
export class ShoppingCartPage {
  util = new Utils();
  helper = new RestHelper();
  orderItemTable = "//table/";
  shoppingCartHeading = $("//h1[text() = 'Shopping Cart']");
  promoCodeHeading = $("//h6[contains(text(),'Promo Code')]");
  promoCodeLabel = $("//label[@id='cart_input_promocode-label']");
  promoCodeInput = $("//input[@id='cart_input_promocode']");
  promoCodeApply = $("//button[@id='cart_link_2_promocode']");
  orderSummaryHeading = $("//h6[contains(text(),'Order Summary')]");
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]");
  orderSummaryTotalPrice = $("//h6[contains(text(),'Total')]//..//following-sibling::div/h6");
  checkOut = $("//button/span[text()='Checkout']");
  emptyCart = $("//h1//following-sibling::div//p");
  recurringCheckbox = "//span[text() = 'Schedule this as a recurring order']";
  frequency = "//select[@name='frequency']";
  startDate = "input.MuiInput-input";
  deleteItemBtn = "//tr/td[last()]//button";
  remButtonSku = `//button[@data-testid="order-remove-item-button-\${sku}"]`;
  quantity = `//button[@data-testid="order-remove-item-button-\${sku}"]/ancestor::td/preceding-sibling::td[2]//input`;

  //product images
  productImages = "img.MuiAvatar-img";
  maxtimeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}

  /**
   * Used to validate shopping cart heading
   */
  async validate() {
    await this.shoppingCartHeading.waitForDisplayed();
  }

  /**
   * Used to verify order item table
   * @param subprodut : json object of sub product type 1/type 2 from sappireproduct.json
   * @param quantity : pass qunatity as number
   */
  async verifyOrderItemTable(subprodut: object, quantity: number) {
    let skuName;
    let skuPrice;
    for (const [key, value] of Object.entries(subprodut)) {
      if (key == "sku") {
        skuName = value;
      }
      if (key == "price") {
        skuPrice = value;
      }
    }
    const expectedPrice = quantity * parseFloat(skuPrice.replace(/[^\d.]*/g, ""));

    const sel = `${this.orderItemTable}/p[text()[contains(.,"${skuName}")]]`;
    const selTd = `${sel}/ancestor::td`;
    const s = `${selTd}/following-sibling::td[1]`;
    const q = `${selTd}/following-sibling::td[2]/p//input`;
    const p = `${selTd}/following-sibling::td[3]/p`;
    const a = `${selTd}/following-sibling::td[4]/button`;

    await expect(await $(sel).getText()).toBe(`SKU: ${skuName}`);
    await expect(await $(s).getText()).toBe("In stock online for delivery");
    await expect(await $(q).getAttribute("value")).toBe(quantity.toString());
    await expect(await $(p).getText()).toContain(`$${expectedPrice}`);
    await expect(await $(a).isDisplayed()).toBe(true);

    return expectedPrice;
  }

  /**
   * Used to verify Promo code section
   */
  async verifyPromoCodeSection() {
    await expect(await this.promoCodeHeading.getText()).toBe("Promo Code");
    await expect(await this.promoCodeLabel.isDisplayed()).toBe(true);
    await expect(await this.promoCodeInput.isDisplayed()).toBe(true);
    await expect(await this.promoCodeApply.isDisplayed()).toBe(true);
  }

  /**
   * Used to verify Order Summary section
   * @param totalPrice Pass total price as number
   */
  async verifyOrderSummarySection(totalPrice: number) {
    await expect(await this.orderSummaryHeading.getText()).toBe("Order Summary");
    await expect(await this.verifyOrderSummarytable("Subtotal")).toContain("$" + totalPrice.toString());
    await expect(await this.verifyOrderSummarytable("Tax")).toContain("$0.00");
    await expect(await this.verifyOrderSummarytable("Shipping")).toContain("$0.00");
    await expect(await this.verifyOrderSummarytable("Shipping tax")).toContain("$0.00");
    await expect(await this.orderSummaryTotalHeading.getText()).toBe("Total");
    await expect(await this.orderSummaryTotalPrice.getText()).toContain("$" + totalPrice.toString());
  }

  /**
   * Used to Verify order summary table
   * @param labelName : pass lable name
   */
  async verifyOrderSummarytable(labelName: string) {
    const selector = "//p[contains(text(),'" + labelName + "')]";
    await $(selector).scrollIntoView();
    await expect(await $(selector).isDisplayed()).toBe(true);
    const selectorValue = await $(selector + "//..//following-sibling::div[1]/p").getText();
    return selectorValue;
  }

  /**
   * Used to click on checkout button
   */
  async checkout() {
    await this.checkOut.waitForDisplayed();
    await this.checkOut.scrollIntoView();
    await this.checkOut.click();
  }

  /**
   * Method is used to verify checkout button is present
   */
  async verifyCheckoutBtnPresent() {
    await this.util.verifyBtnPresent("Checkout");
    return this;
  }

  /**
   * Method is used to verify checkout button is not present
   */
  async verifyCheckoutBtnNotPresent() {
    await this.util.verifyBtnNotPresent("Checkout");
    return this;
  }

  /**
   * Method used to delete the item from shopping cart with respect to sku name
   * @param sku
   */
  async deleteFromOrderItemTable(skus: object) {
    const entry = Object.entries(skus).find(([key]) => key === "sku") as [string, string];
    const skuName = entry[1];
    const sel = this.remButtonSku.replace(/\$\{sku\}/, skuName);
    const button = $(sel);
    await button.waitForClickable();
    await button.click();
  }

  /**
   * Method is use to verify the shopping cart is empty or not
   */
  async verifyShoppingCartIsEmpty() {
    await this.emptyCart.waitForDisplayed();
    expect(await this.emptyCart.getText()).toContain("Your shopping cart is empty. ");
  }

  /**
   * Method is use to verify the check recurring order checkbox
   */
  async checkRecurringOrderBox() {
    await $(this.recurringCheckbox).click();
  }

  /**
   * Method is place recurring order checkbox
   * @param frequency pass frequency as a string
   * @param date pass date as a string format dd/mm/yyyy
   */
  async recurringOrder(frequency: string, date: Date) {
    const startDate = String(date.getMonth() + 1) + "/" + String(date.getDate()) + "/" + String(date.getFullYear());
    await browser.waitUntil(async () => (await $(this.frequency).isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "frequency dropdown is not displayed",
    });
    await $(this.frequency).click();
    const frequencyValue = this.frequency + "//option[text() = '" + frequency + "']";
    await $(frequencyValue).click();
    await $(this.startDate).click();
    await $(this.startDate).setValue(startDate);
  }

  /**
   * Method is used to verify quantity on shopping cart page
   * @param skuName : pass sku name
   * @param quantity : pass expected quantity
   */
  async verifyQuantityOnCart(skuName: string, quantity: number) {
    const sel = this.quantity.replace(/\$\{sku\}/, skuName);
    await $(sel).waitForDisplayed();
    await expect(await $(sel).getAttribute("value")).toBe(quantity.toString());
  }

  /**
   * Method is used to add the quantity on shopping cart
   * @param skuName : pass sku name
   */
  async quantityIncrement(skuName: string) {
    const inp = this.quantity.replace(/\$\{sku\}/, skuName);
    const sel = `${inp}/../b[1]`;
    await $(sel).waitForClickable();
    await $(sel).click();
  }

  /**
   * Method is used to reduce the quantity on shopping cart
   * @param skuName : pass sku name
   */
  async quantityDecrement(skuName: string) {
    const inp = this.quantity.replace(/\$\{sku\}/, skuName);
    const sel = `${inp}/../b[2]`;
    await $(sel).waitForClickable();
    await $(sel).click();
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

  /**
   * Method is used to delete all items from cart
   * @returns ShoppingCartPage()
   */
  async deleteAllItemFromCart() {
    await browser.pause(envConfig.timeout.lowtimeout);
    const delButtons = await $$(this.deleteItemBtn);
    const n = delButtons.length;

    for (let i = 0; i < n; ++i) {
      const loc = $(this.deleteItemBtn);
      await loc.waitForClickable();
      await loc.click();
      await browser.refresh();
      await browser.pause(envConfig.timeout.midtimeout);
    }
    await this.verifyShoppingCartIsEmpty();
    return this;
  }

  /**
   * Method is used to verify checkout button is not clickable
   */
  async verifyCheckoutBtnIsNotClickable() {
    await this.util.verifyBtnNotClickable("Checkout");
    return this;
  }
}
