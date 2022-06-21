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
import { ShippingDetailPage } from "./ShippingDetailsPage.po";
import { Utils } from "../Utils.po";
import { RestHelper } from "../../base/RestHelper";

//ShoppingCartPage class is to handle the object of shopping cart page
export class ShoppingCartPage {
  util = new Utils();
  helper = new RestHelper();
  productTable = "//table";
  shoppingCartHeading = "//h1[text()='Shopping Cart']";
  totalProducts = $$("//img[@class = 'MuiAvatar-img']");
  emptyCart = $("//h1[text()= 'Shopping Cart']//following-sibling::div//div[contains(@class, 'MuiGrid-item')]");
  deleteItemBtn = "//tr[@class = 'MuiTableRow-root']//button[@title='Delete']";
  //Promo code
  promoCodeHeading = $("//h6[contains(text(),'Promo Code')]");
  promoCodeLabel = $("//label[@id='cart_input_promocode-label']");
  promoCodeInput = $("//input[@id='cart_input_promocode']");
  promoCodeApply = $("//button[@id='cart_link_2_promocode']");
  //button
  checkoutButton = $("//span[contains(text(), 'Checkout')]");
  emptyShoppingCart = $("p.MuiTypography-body2:nth-child(1)");
  //Order Summary
  orderSummaryHeading = "//h6[contains(text(),'Order Summary')]";
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]");
  orderSummarySubTotalPrice = $("//p[contains(text(),'Subtotal')]/parent::div/following-sibling::div[1]/p");
  //product images
  productImageList = "img.MuiAvatar-img";
  buttonOfInterest = `//button[@data-testid="button-sign-in-register"]`;

  static async get() {
    const p = new ShoppingCartPage();
    await p.validate();
    return p;
  }

  private constructor() {}

  /**
   * method to validate page load
   */
  async validate() {
    await $(this.shoppingCartHeading).waitForDisplayed();
  }

  async waitForCheckoutButton() {
    await browser.waitUntil(async () => (await this.checkoutButton).isDisplayed());
  }
  /**
   * method to validate empty cart
   * @param emptyCartMessage pass empty cart text as a strings
   */
  async verifyEmptyShoppingCart(emptyCartMessage: string) {
    const emptyCartMsg = await this.emptyShoppingCart.getText();
    await expect(emptyCartMsg).toContain(emptyCartMessage);
  }
  /**
   * method to validate shopping cart page loaded
   * @param expectedHeading : pass expected cart page heading as a string
   */
  async verifyShoppingCartPageLoaded(expectedHeading: string) {
    const heading = await $(this.shoppingCartHeading).getText();
    await expect(heading).toEqual(expectedHeading);
  }
  /**
   * method to validate product at defined table row
   * @param index : pass row number starts from 0
   * @param expectedproduct : pass expected product name as a string
   * @returns ShoppingCartPage()
   */
  async verifyProductNameAtIndex(index: number, expectedproduct: string) {
    const productName = this.productTable + "//tr[" + index + "]//td[2]/p[1]";
    await expect(await $(productName).getText()).toEqual(expectedproduct);
    return this;
  }
  /**
   * method to validate sku at defined table row
   * @param index : pass row number starts from 0
   * @param expectedSKU : pass expected sku as a string
   * @returns ShoppingCartPage()
   */
  async verifyProductSKUAtIndex(index: number, expectedSKU: string) {
    const skuSelector = this.productTable + "//tr[" + index + "]//td[2]/p[2]";
    await expect(await $(skuSelector).getText()).toContain(expectedSKU);
    return this;
  }
  /**
   * method to validate price at defined table row
   * @param index : pass row number starts from 0
   * @param expectedprice : pass expected price as a string
   * @returns ShoppingCartPage()
   */
  async verifyProductPriceAtIndex(index: number, expectedprice: number) {
    const priceSelector = this.productTable + "//tr[" + index + "]//td[5]";
    await expect(await $(priceSelector).getText()).toContain(expectedprice.toString());
    return this;
  }
  /**
   * method to validate item quantity at defined table row
   * @param index : pass row number starts from 0
   * @returns ShoppingCartPage()
   */
  async verifyProductQuantityAtIndex(index: number) {
    const quantitySelector = this.productTable + "//tr[" + index + "]//td[4]/p[1]//input";
    console.log("product quantity is " + (await $(quantitySelector).getValue()));
    return this;
  }
  /**
   * method to validate number of products loaded on cart page
   * @param expectedRows : expected number of products as a number
   * @returns ShoppingCartPage()
   */
  async verifyNumberOfProductsLoaded(expectedRows: number) {
    const totalProductRows = this.totalProducts.length;
    console.log("total number of products loaded " + totalProductRows);
    await expect(totalProductRows).toEqual(expectedRows);
    return this;
  }
  /**
   * method to verify order item table
   * @param sku : sku as a json object from emeraldproduct.json
   * @param quantity : pass quantity as a number
   */
  async verifyOrderItemTable(sku: object, quantity: number) {
    let skuName;
    let skuPrice;
    for (const [key, value] of Object.entries(sku)) {
      if (key == "sku") {
        skuName = value;
      }
      if (key == "priceOffering") {
        skuPrice = value;
      }
    }
    const actualSkuName = await $("p[data-testid='order-item-sku-" + skuName + "']");
    await expect(await actualSkuName.getText()).toBe("SKU: " + skuName);
    await expect(await $("p[data-testid='order-item-inventory-status-" + skuName + "']").getText()).toBe(
      "In stock online for delivery"
    );
    await expect(await $("input[data-testid='order-item-quantity-input-" + skuName + "']").getAttribute("value")).toBe(
      quantity.toString()
    );
    const expectedPrice = quantity * skuPrice;
    await expect(await $("p[data-testid='order-item-price-" + skuName + "']").getText()).toContain("$" + expectedPrice);
    await expect(await $("button[data-testid='order-remove-item-button-" + skuName + "']").isDisplayed()).toBe(true);
  }
  /**
   * method to verify Promo code section
   */
  async verifyPromoCodeSection() {
    await expect(await this.promoCodeHeading.getText()).toBe("Promo Code");
    await expect(await this.promoCodeLabel.isDisplayed()).toBe(true);
    await expect(await this.promoCodeInput.isDisplayed()).toBe(true);
    await expect(await this.promoCodeApply.isDisplayed()).toBe(true);
  }
  /**
   * method to verify Order Summary section
   * @param totalPrice Pass total price as number
   */
  async verifyOrderSummarySection(totalPrice: number) {
    await expect(await $(this.orderSummaryHeading).getText()).toBe("Order Summary");
    await expect(await this.orderSummaryTotalHeading.getText()).toBe("Total");
    await expect(await this.orderSummarySubTotalPrice.getText()).toContain(totalPrice.toString());
  }

  /**
   * method to navigate to shipping detail page as guest
   * @returns ShippingDetailPage
   */
  async checkOutAsGuest() {
    await expect(await this.checkoutButton.isClickable()).toBe(true);
    await this.util.handleOnClickBtn("Checkout");

    // now on user-type page
    await browser.waitUntil(async () => await $(this.buttonOfInterest).isDisplayed());
    await $(this.buttonOfInterest).waitForClickable();
    await $(this.buttonOfInterest).click();

    // now on shipping page
    const rc = await ShippingDetailPage.get();
    return rc;
  }

  /**
   * method to navigate shipping detail page
   * @returns ShippingDetailPage()
   */
  async checkOut() {
    await expect(await this.checkoutButton.isClickable()).toBe(true);
    await this.util.handleOnClickBtn("Checkout");
    const rc = await ShippingDetailPage.get();
    return rc;
  }

  /**
   * Method is used to verify checkout button is present
   */
  async verifyCheckoutBtnPresent() {
    await this.util.verifyBtnPresent("Checkout");
    return this;
  }
  /**
   * Method is used to verify checkout button is not clickable
   */
  async verifyCheckoutBtnIsNotClickable() {
    await this.util.verifyBtnNotClickable("Checkout");
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
   * Method is use to delete the item from shopping cart with repect to sku name
   * @param sku : pass subproduct object
   */
  async DeleteOrderItemTable(sku: object) {
    let skuName;
    for (const [key, value] of Object.entries(sku)) {
      if (key == "sku") {
        skuName = value;
      }
    }
    await $("button[data-testid='order-remove-item-button-" + skuName + "']").click();
  }
  /**
   * Using for verify the shopping cart is empty or not
   */
  async verifyShoppingCartIsEmpty() {
    await this.emptyCart.waitForDisplayed();
    await expect(await this.emptyCart.getText()).toBe("Your shopping cart is empty. Shop now!");
  }
  /**
   * Method is used to verify quantity on shopping cart page
   * @param skuName : pass sku name
   * @param quantity : pass expected quantity
   */
  async verifyQuantityOnCart(skuName: string, quantity: number) {
    const loc = `input[data-testid='order-item-quantity-input-${skuName}']`;
    await $(loc).waitForExist();
    expect(await $(loc).getAttribute("value")).toBe(quantity.toString());
  }
  /**
   * Method is used to add the quantity on shopping cart
   * @param skuName : partNumber
   */
  async quantityIncrement(skuName: string) {
    const selector = `input[data-testid='order-item-quantity-input-${skuName}']`;
    const incrementButton = await $(selector).$$("//b");
    await incrementButton[0].click();
  }
  /**
   * Method is used to reduce the quantity on shopping cart
   * @param skuName : pass subcategory Name
   */
  async quantityDecrement(skuName: string) {
    const selector = `input[data-testid='order-item-quantity-input-${skuName}']`;
    const incrementButton = await $(selector).$$("//b");
    await incrementButton[1].click();
  }
  /**
   * Method is used to verify image loaded properly on Cart Page
   * @returns ShoppingCartPage()
   */
  async verifyAllImagesIsLoaded() {
    await this.helper.verifyImageLoadedBySource(this.productImageList);
    return this;
  }
  /**
   * Method is used to get order summary details
   * @returns ShoppingCartPage()
   */
  async getOrderSummarySectionDetails(type: string) {
    const typeSelector =
      this.orderSummaryHeading +
      "/following-sibling::div[1]//*[text() = '" +
      type +
      "']/parent::div/following-sibling::div[1]";
    await $(typeSelector).scrollIntoView();
    return $(typeSelector).getText();
  }

  /**
   * Method is used to delete all items from cart
   * @returns ShoppingCartPage()
   */
  async deleteAllItemFromCart() {
    const codemod_placeholder_6624 = await $$(this.deleteItemBtn);

    for (const deleteBtn of codemod_placeholder_6624) {
      await deleteBtn.click();
      await browser.refresh();
    }
    await this.verifyShoppingCartIsEmpty();
    return this;
  }
}
