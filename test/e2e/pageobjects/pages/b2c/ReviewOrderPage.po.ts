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
import { OrderConfirmationPage } from "./OrderConfirmationPage.po";
import { RestHelper } from "../../base/RestHelper";
import * as envConfig from "../../../../../env.config.json";

//ReviewOrderPage class is to handle the object of review order page
export class ReviewOrderPage {
  util = new Utils();
  helper = new RestHelper();
  //section heading
  cartdetails = $("//*[contains(text(),'Cart Details')]");
  paymentdetails = "//*[contains(text(),'Payment Details')]";
  ordersummary = "//*[contains(text(),'Order Summary')]";
  shippingdetails = $("//*[contains(text(),'Shipping Details')]");

  //cart details
  totalProducts = $$('//table/tbody/tr//*[contains(@data-testid,"order-item-sku")]');
  //Shiping detais
  shippingAddressNickName = "//h5[text()='Shipping Address']//..//..//following-sibling::div/p[1]";
  shippingAddressMethod = "//h5[text()='Shipping Method']//..//..//following-sibling::div/p";
  //payment details
  billingAddressNickName = "//h5[text()='Billing Address']//..//..//following-sibling::div/p[1]";
  paymentMethod = "//h5[text()='Payment Method']//..//..//following-sibling::div/p[1]";
  //Order summary
  subtotalHeading = "//p[text()='Subtotal']";
  subtotalValue = "//p[text()='Subtotal']//..//following-sibling::div[1]//p";
  placeorderButton = "button[data-testid='button-order-details-next']";
  backToPayment = $("//span[contains(text(),'Back to Payment Details')]");
  productImages = "img.MuiAvatar-img";
  shipmentGroup = "//div[contains(@class,'shipment-group-summary')]//h5[text()='ShipmentGroup']";

  static async get() {
    const p = new ReviewOrderPage();
    await p.validate();
    return p;
  }

  private constructor() {}

  async validate() {
    await $(this.paymentdetails).waitForDisplayed();
    await $(this.ordersummary).waitForDisplayed();
  }

  /**
   * method to validate total products display
   * @param expectedCount : pass expected count as a number
   * @returns ReviewOrderPage()
   */
  async verifyTotalProducts(expectedCount: number) {
    const _tp = await this.totalProducts;
    const total: number = _tp.length;
    await expect(total).toBe(expectedCount);
    return this;
  }
  /**
   * method to validate shipping address name display
   * @param expectedNickName : pass expected name
   * @returns ReviewOrderPage()
   */
  async verifyShipAddressName(expectedNickName: string) {
    await $(this.shippingAddressNickName).scrollIntoView();
    await this.util.verifyText(expectedNickName, this.shippingAddressNickName, "ship address name");
    return this;
  }
  /**
   * method to validate shipping address method display
   * @param expectedMethod : pass expected method as a string
   * @returns ReviewOrderPage()
   */
  async verifyShipAddressMethod(expectedMethod: string) {
    await $(this.shippingAddressMethod).scrollIntoView();
    await this.util.verifyText(expectedMethod, this.shippingAddressMethod, "ship method");
    return this;
  }
  /**
   * method to validate billing address name display
   * @param expectedName : pass expected name as a string
   * @returns ReviewOrderPage()
   */
  async verifyBillAddressName(expectedName: string) {
    await $(this.billingAddressNickName).scrollIntoView();
    await this.util.verifyText(expectedName, this.billingAddressNickName, "bill address");
    return this;
  }
  /**
   * method to validate payment method display
   * @param expectedMethod : pass expected method as a string
   * @returns ReviewOrderPage()
   */
  async verifyPaymentMethod(expectedMethod: string) {
    await $(this.paymentMethod).scrollIntoView();
    await this.util.verifyText(expectedMethod, this.paymentMethod, "payment method");
    return this;
  }
  /**
   * method to validate sub total amount display
   * @param expectedsubtotal : pass expected amount as a string
   * @returns ReviewOrderPage()
   */
  async verifySubTotal(expectedsubtotal: string) {
    await $(this.subtotalHeading).scrollIntoView();
    await this.util.verifyText(expectedsubtotal, this.subtotalValue, "subtotal value");
    return this;
  }
  /**
   * method to place order
   * @returns OrderConfirmationPage()
   */
  async placeOrder() {
    await this.util.buttonClickById("button-order-details-next");
    const rc = await OrderConfirmationPage.get();
    return rc;
  }
  /**
   * method to verify order item table
   * @param sku : sku as a json object from emeraldproduct.json
   * @param quantity : pass expected quantity as a number
   */
  async verifyReviewOrderItemTable(sku: object, quantity: number) {
    await this.util.verifyReviewOrderItemTable(sku, quantity);
    return this;
  }
  /**
   * Method is used to verify image loaded properly on Review Order Page
   * @returns ReviewOrderPage()
   */
  async verifyAllImagesIsLoaded() {
    await this.helper.verifyImageLoadedBySource(this.productImages);
    return this;
  }
  /**
   * Method is used to get order summary details
   * @returns text
   */
  async getOrderSummarySectionDetails(type: string) {
    const typeSelector = "//p[text()='" + type + "']//..//following-sibling::div[1]//p";
    await $(typeSelector).scrollIntoView();
    return $(typeSelector).getText();
  }
  /**
   * Method is used to get order total amount
   * @returns text
   */
  async getOrderTotalAmount() {
    const typeSelector = "//h6[text()='Total']//..//following-sibling::div[1]";
    await $(typeSelector).scrollIntoView();
    return $(typeSelector).getText();
  }
  /**
   * Method is used to verify shipping details on Review Page
   * @param shippingGroup : pass shipping Group 1 or 2 as string
   * @param shipMethod : Shipping Method value
   */
  async verifyShippingDetailsOnReviewPage(shippingGroup: string, shipMethod: string) {
    const loc = this.shipmentGroup.replace(/ShipmentGroup/, shippingGroup);
    await this.util.waitForElementTobeVisible(await $(loc));

    const method = $(
      `${loc}/../../following-sibling::div/p[text()='Shipping Method']/following-sibling::p[text()='${shipMethod}']`
    );
    await method.waitForDisplayed();
    expect(await method.isDisplayed()).toBe(true);

    await browser.pause(envConfig.timeout.lowtimeout);

    const details = $(`${loc}/../../../../following-sibling::div//p`);
    await details.waitForClickable();
    await details.click();
  }
  /**
   * Method is used to click on Hide Group details link
   * @param shippingGroup : pass shipping Group 1 or 2 as string
   */
  async hideGroupDetails(shippingGroup: string) {
    const shippmentGroupLocator = this.shipmentGroup.replace(/ShipmentGroup/, shippingGroup);
    const showGroupDetails = $(shippmentGroupLocator + "/../../../../following-sibling::div//div[2]//p");
    await browser.waitUntil(async () => (await showGroupDetails.isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Hide Group details are not available",
    });
    await showGroupDetails.click();
    await browser.pause(envConfig.timeout.lowtimeout);
  }
  /**
   * Scroll to Checkout Heading
   */
  async scrollToCheckoutHeading() {
    await $("//h4").scrollIntoView();
  }
}
