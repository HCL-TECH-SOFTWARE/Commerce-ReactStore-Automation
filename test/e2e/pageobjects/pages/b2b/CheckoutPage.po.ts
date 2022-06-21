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
import { RestHelper } from "../../base/RestHelper";
import * as envConfig from "../../../../../env.config.json";

//CheckoutPage class is used to handle the object of Checkout Page
export class CheckoutPage {
  util = new Utils();
  helper = new RestHelper();
  pageHeading = $("//*[contains(text(),'Shipping Details')]");
  shippingAddressHeading = $("//*[contains(text(),'Shipping Address')]");
  shippingMethodHeading = $("//*[contains(text(),'Shipping Method')]");
  createNew_Address = $("//span[text()='Create a New Address']");
  saveSelectAddress = $("//span[text()='Save and select this address']");
  alertMsg_newAddress = $("//div[contains(text(),'has been added successfully')]");
  editbtn = "//button/span/p[text()= 'Edit']";

  continuePayment = $("//span[text()='Continue to Payment']");
  paymentMethodHeading = $("//h5[text()='Payment Method']");
  paymentDetailsHeading = $("//p[text()='Payment Details']");
  review_order = $("//button/span[text()='Review Order']");
  orderItemTable = "//table";
  reviewOrderSummaryHeading = $("//h4[contains(text(),'Order Summary')]");
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]");
  orderSummaryTotalPrice = $("//h6[contains(text(),'Total')]//..//following-sibling::div/h6");
  reviewShippingAddressName = "//h5[text()='Shipping Address']//..//..//following-sibling::div/p[1]";
  reviewShippingMethod = "//h5[text()='Shipping Method']//..//..//following-sibling::div/p";
  reviewBillingAddressName = "//h5[text()='Billing Address']//..//..//following-sibling::div/p[1]";
  reviewPaymentMethod = "//h5[text()='Payment Method']//..//..//following-sibling::div/p[1]";
  place_Order = $("//span[text()='Place Order']");
  place_recurring_Order = $("//span[text()='Place Recurring Order']");
  recurringOrderSection = $("//*[text() = 'Recurring Order']");
  reviewFrequencyValue = "//span[text() = 'Frequency']//following-sibling::p";
  reviewStartDateValue = "//span[text() = 'Start Date']//following-sibling::p";
  btnColorElement = "//button[contains(@class,'MuiButton-containedPrimary')]";
  productImages = "img.MuiAvatar-img";
  confirmSelectionBtn = $("//button/span[text()='Confirm Selection']");
  useThisAddress = "//h6[text()='shippingName']/../../following-sibling::div//button/span/p[text()='Use This Address']";
  shipmentGroup = "//div[contains(@class,'shipment-group-summary')]//h5[text()='ShipmentGroup']";

  //Shipping Address
  shipToMultipleAddress = $("//span[contains(@class,'MuiSwitch-switchBase')]");
  shipMethod = `//label[contains(@class,"MuiFormControlLabel-root")]//p[contains(text(),"\${method}")]`;
  maxtimeoutValue: number = envConfig.timeout.maxtimeout;

  static async get() {
    const p = new CheckoutPage();
    await p.validate();
    return p;
  }

  private constructor() {}

  /**
   * Used to validate checkout heading and shipping address heading
   */
  async validate() {
    await this.pageHeading.waitForDisplayed();
    await this.shippingAddressHeading.waitForDisplayed();
  }
  /**
   * Used to create a new address
   */
  async createNewAddress() {
    await browser.waitUntil(async () => (await this.createNew_Address.isDisplayed()) === true, {
      timeout: this.maxtimeoutValue,
      timeoutMsg: "Create new address button is not displayed ",
    });
    await this.createNew_Address.click();
  }
  /**
   * Used to add address details
   * @param addDetails : pass address as a json object where key as a address field and value as input field value
   */
  async addAddressDetails(addDetails: object) {
    await this.util.addDetails(addDetails);
  }
  /**
   * Used to click on save and select address ( button/link )
   * checkForOneAddress: verify only one address card
   */
  async saveAndSelectThisAddress(checkForOneAddress: boolean = true) {
    const m = "CheckoutPage.saveAndSelectThisAddress";
    await this.saveSelectAddress.click();

    await browser.waitUntil(async () => (await this.alertMsg_newAddress.isDisplayed()) === true, {
      timeout: this.maxtimeoutValue,
      timeoutMsg: "New Address is not saved ",
    });
    await browser.pause(envConfig.timeout.lowtimeout);

    if (checkForOneAddress) {
      await $(this.editbtn).scrollIntoView();
      const count = (await $$(this.editbtn)).length;
      if (count === 1) {
        Utils.log(m, "New Address is selected");
      }
    }
  }
  /**
   * Method is used to verify color of save and select button
   * @param color : pass rgb value
   */
  async verifySaveAndSelectBtnColor(color: string) {
    await this.util.verifyColorRGBValue(this.btnColorElement, color);
  }
  /**
   * Used to select shipping method from dropdown
   * @param shippingMethod : pass shipping method as string
   */
  async selectShippingMethod(shippingMethod: string) {
    await this.shippingMethodHeading.scrollIntoView();
    await expect(await this.shippingMethodHeading.isDisplayed()).toBe(true);
    const sel = this.shipMethod.replace(/\$\{method\}/, shippingMethod);
    const loc = $(sel);
    await loc.waitForClickable();
    await loc.click();
  }
  /**
   * Used to click on continue to payment button/link
   */
  async continueToPayment() {
    await this.continuePayment.click();
    await browser.pause(envConfig.timeout.midtimeout);
  }
  /**
   * Used to select payment method
   * @param paymentMethod pass payment method as a string
   */
  async selectPaymentMethod(paymentMethod: string) {
    await this.paymentDetailsHeading.scrollIntoView();
    await expect(await this.paymentDetailsHeading.isDisplayed()).toBe(true);
    await expect(await this.paymentMethodHeading.isDisplayed()).toBe(true);
    const selector = "//p[text()='" + paymentMethod + "']/../..//span/input[@name='payOption']";
    await $(selector).click();
  }
  /**
   * Used to click on Review order button/link
   */
  async reviewOrder() {
    await browser.pause(envConfig.timeout.lowtimeout);
    //this.review_order.scrollIntoView();
    await this.review_order.click();
    Utils.log("CheckoutPage.reviewOrder", "Clicked on Review Order");
    await browser.pause(envConfig.timeout.midtimeout);
  }
  /**
   * Used for verification of order item table on review section
   * @param sku: json object of sku type 1/type 2 from sapphireproduct.json
   * @param quantity: subproduct quantity in number from data file
   */
  async verifyReviewOrderItemTable(sku: object, quantity: number) {
    const rc = await this.util.verifyReviewOrderItemTable(sku, quantity, "price");
    return rc;
  }
  /**
   * Used for verification of order summary on review order section
   * @param totalPrice : total price from test data or test case
   */
  async verifyReviewOrderSummarySection(totalPrice: number) {
    await this.reviewOrderSummaryHeading.scrollIntoView();
    await expect(await this.reviewOrderSummaryHeading.getText()).toBe("Order Summary");
    await expect(await this.verifyReviewOrderSummarytable("Subtotal")).toContain("$" + totalPrice.toString());
    await expect(await this.verifyReviewOrderSummarytable("Tax")).toContain("$0.00");
    await expect(await this.verifyReviewOrderSummarytable("Shipping")).toContain("$0.00");
    await expect(await this.verifyReviewOrderSummarytable("Shipping tax")).toContain("$0.00");
    await expect(await this.orderSummaryTotalHeading.getText()).toBe("Total");
    await expect(await this.orderSummaryTotalPrice.getText()).toContain("$" + totalPrice.toString());
  }
  /**
   * Used to verify review order summary table
   * @param labelName pass expected label name as a string
   * @return : label Value
   */
  async verifyReviewOrderSummarytable(labelName: string) {
    let selector;
    if (labelName == "Shipping") {
      selector = "//p[text()='" + labelName + "']";
    } else {
      selector = "//p[contains(text(),'" + labelName + "')]";
    }
    await $(selector).scrollIntoView();
    await expect(await $(selector).isDisplayed()).toBe(true);
    const selectorValue = await $(selector + "//..//following-sibling::div[1]/p").getText();
    return selectorValue;
  }
  /**
   * Used to verify shipping address name
   * @param shippingaddress : Pass expected shipping address name
   */
  async verifyShipAddressName(shippingaddress: string) {
    await $(this.reviewShippingAddressName).scrollIntoView();
    await this.util.verifyText(shippingaddress, this.reviewShippingAddressName, "Shipping Address Name");
  }
  /**
   * Used to verify shipping Address method
   * @param shippingMethod : Pass expected shipping method as string
   */
  async verifyShipAddressMethod(shippingMethod: string) {
    await $(this.reviewShippingMethod).scrollIntoView();
    await this.util.verifyText(shippingMethod, this.reviewShippingMethod, "Shipping Method");
  }
  /**
   * Used to verify billing address name
   * @param billingaddress : Pas expected billing addres name as a string
   */
  async verifyBillAddressName(billingaddress: string) {
    await $(this.reviewBillingAddressName).scrollIntoView();
    await this.util.verifyText(billingaddress, this.reviewBillingAddressName, "Billing Address Name");
  }
  /**
   * Used to verify payment method
   * @param paymentMethod : pass expected payment method
   */
  async verifyPaymentMethod(paymentMethod: string) {
    await $(this.reviewPaymentMethod).scrollIntoView();
    await this.util.verifyText(paymentMethod, this.reviewPaymentMethod, "Payment Method");
  }
  /**
   * Used to click on place order button/click
   */
  async placeOrder() {
    await browser.pause(envConfig.timeout.lowtimeout);
    //this.place_Order.scrollIntoView();
    await this.place_Order.click();
  }
  /**
   * Used to verify recurring order section
   * @param frequency : pass frequency as a string
   * @param date : pass start date as a Date type
   */
  async verifyRecuringOrderSection(frequency: string, date: Date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    await this.recurringOrderSection.scrollIntoView();
    await this.util.verifyText(frequency, this.reviewFrequencyValue, "Frequency");
    await this.util.verifyText(month, this.reviewStartDateValue, "Start date");
    await this.util.verifyText(String(date.getDate()), this.reviewStartDateValue, "Start date");
    await this.util.verifyText(String(date.getFullYear()), this.reviewStartDateValue, "Start date");
  }
  /**
   * Used to click on place recurring order
   */
  async placeRecurringOrder() {
    await browser.pause(envConfig.timeout.lowtimeout);
    //this.place_recurring_Order.scrollIntoView();
    await this.place_recurring_Order.click();
    await browser.pause(envConfig.timeout.midtimeout);
  }
  /**
   * Method is used to verify Payment method types
   */
  async verifyPaymentMethodTypes(paymentMethod: object) {
    const m = "CheckoutPage.verifyPaymentMethodTypes";
    let selector;
    for (const [, value] of Object.entries(paymentMethod)) {
      selector = `//div[@role='radiogroup']/label//p[text()="${value}"]`;
      await expect(await $(selector).getText()).toBe(value);
      Utils.log(m, `Payment Method Value: ${value}`);
      await expect(await $(`${selector}/../../span[1]`).isDisplayed()).toBe(true);
    }
  }
  /**
   * Method is used to verify image loaded properly on Review Order Page
   * @returns CheckoutPage()
   */
  async verifyAllImagesIsLoaded() {
    await browser.pause(envConfig.timeout.midtimeout);
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
   * Method is used to click on Ship to multiple Addresses
   */
  async shipToMultipleAddressBtn() {
    await this.util.waitForElementTobeVisible(await this.shipToMultipleAddress);
    await this.shipToMultipleAddress.click();
  }
  /**
   * Method to Select Shipping Address and Method with sku name
   * @param skuName : pass skuName
   */
  async selectShippingAddressAndMethod(skuName: string) {
    const actualSkuName = await $(
      `${this.orderItemTable}//p[text()[contains(.,"${skuName}")]]/..//following-sibling::td[2]/button`
    );
    await actualSkuName.scrollIntoView({ block: "center" });
    await this.util.waitForElementTobeVisible(actualSkuName);
    await $(actualSkuName).click();
  }
  /**
   * Method is used to click on confirm selection
   */
  async confirmSelection() {
    await browser.waitUntil(async () => (await this.confirmSelectionBtn.isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Confirmation Selection button is not Displayed",
    });
    await this.confirmSelectionBtn.click();
  }
  /**
   * Method used to vrify that address is added or  not
   */
  async verifyShippingDetailsOnShippingPage(skuName: string) {
    const actualName = this.orderItemTable + "//p[text()='" + skuName + "']/..//following-sibling::td[2]/p";
    await browser.waitUntil(
      async () => (await $(actualName).isDisplayed()) === true && (await $$(actualName)).length == 4,
      {
        timeout: envConfig.timeout.midtimeout,
        timeoutMsg: "Address is not added or is not Displayed",
      }
    );
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

  /**
   * Method is used to verify shipping details on Review Page
   * @param shippingGroup : pass shipping Group 1 or 2 as string
   * @param value : Shipping Method value
   */
  async verifyShippingDetailsOnReviewPage(shippingGroup: string, value: string) {
    const sel = this.shipmentGroup.replace(/ShipmentGroup/, shippingGroup);
    const _sltr = await $(sel);
    await this.util.waitForElementTobeVisible(_sltr);
    const shippingMethod = $(
      `${sel}/../../following-sibling::div/p[text()='Shipping Method']/following-sibling::p[text()="${value}"]`
    );

    await expect(await shippingMethod.isDisplayed()).toBe(true);
    await browser.pause(envConfig.timeout.lowtimeout);
    const showGroupDetails = $(`${sel}/../../../../following-sibling::div//p`);
    await browser.waitUntil(async () => await showGroupDetails.isDisplayed(), {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Show Group details are not available",
    });

    await showGroupDetails.click();
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
   * Method is used to scroll to shipping group
   */
  async scrollToShipppingGroup() {
    await this.pageHeading.scrollIntoView({ block: "center" });
  }

  /**
   * Used to click on save and select address ( button/link )
   */
  async saveAndSelectThisAddressPaymentPage() {
    await this.saveSelectAddress.click();
    await browser.waitUntil(async () => (await this.alertMsg_newAddress.isDisplayed()) === true, {
      timeout: this.maxtimeoutValue,
      timeoutMsg: "New Address is not saved ",
    });
  }
}
