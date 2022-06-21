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
import envConfig from "../../../../../env.config.json";

//OrderConfirmationPage class is to handle the object of order confirmation page
export class OrderConfirmationPage {
  util = new Utils();
  pageheading = "//*[contains(text(), 'Order Confirmation')]";
  orderId = "//*[contains(text(), 'Order #')]";
  orderReceivedMsg = "//h3";
  receiptDetailsMsg = "//h3//following-sibling::p[1]";
  acknowledgeMsg = "//h3//following-sibling::p[2]";

  private constructor() {}

  static async get() {
    const OCP = new OrderConfirmationPage();
    await OCP.ready();
    return OCP;
  }

  async ready() {
    await browser.waitUntil(
      async () => (await $(this.pageheading).isDisplayed()) && (await $(this.orderId).isDisplayed()),
      {
        timeout: envConfig.timeout.maxtimeout,
      }
    );
  }
  /**
   * method to validate order id
   */
  async verifyOrderId() {
    let id: string = await $(this.orderId).getText();
    id = id.split("#")[1];
    await expect(id).toBeGreaterThan(0);
  }
  /**
   * Used to verify Order Confirmation details
   * @param orderconfirmation pass array of orderconfirmation from checkoutpage data file
   */
  async verifyOrderConfirmationPage(orderconfirmation: object) {
    for (const [key, value] of Object.entries(orderconfirmation)) {
      if (key == "orderReceived") {
        await this.util.verifyText(value, this.orderReceivedMsg, "Order Review Message");
      } else if (key == "receiptDetails") {
        await this.util.verifyText(value, this.receiptDetailsMsg, "Receipt Details Message");
      } else if (key == "acknowledgeMsg") {
        await this.util.verifyText(value, this.acknowledgeMsg, "Thank you Message");
      }
    }
  }
  /**
   * Method is used to store order id
   * @return order id
   */
  async storeOrderID() {
    const orderId = (await $(this.orderId).getText()).replace(/[^0-9]/g, "");
    return orderId;
  }
}
