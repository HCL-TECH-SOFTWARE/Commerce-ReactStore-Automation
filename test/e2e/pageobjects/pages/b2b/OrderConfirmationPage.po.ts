/*
# Copyright 2021 HCL America, Inc.
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

# The script sets up necessary environment variables to run DX in a docker-compose environment
*/
import { Utils } from '../Utils.po'
//OrderConfirmation Page class is used to handle the object of Order Confirmation Page
export class OrderConfirmationPage {
  util = new Utils()
  pageheading = $("//*[contains(text(), 'Order Confirmation')]")
  orderId = $("//*[contains(text(), 'Order #')]")
  orderReceivedMsg = '//h3'
  receiptDetailsMsg = '//h3//following-sibling::p[1]'
  acknowledgeMsg = '//h3//following-sibling::p[2]'
  constructor () {
    this.pageheading.waitForDisplayed()
    this.orderId.waitForDisplayed()
  }
  /**
   * Used to verify Order ID
   */
  verifyOrderId () {
    let id: string = this.orderId.getText()
    id = id.split('#')[1]
    expect(id).toBeGreaterThan(0, 'order id is not greater than 0')
  }
  /**
   * Method is use to store order id
   * @return order id
   */
  storeOrderID (): string {
    return this.orderId.getText().replace(/[^0-9]/g, '')
  }
  /**
   * Used to verify Order Confirmation details
   * @param orderconfirmation pass array of orderconfirmation from checkoutpage data file
   */
  verifyOrderConfirmationPage (orderconfirmation: object) {
    for (let [key, value] of Object.entries(orderconfirmation)) {
      if (key == 'orderReceived') {
        this.util.verifyText(
          value,
          this.orderReceivedMsg,
          'Order Review Message'
        )
      } else if (key == 'receiptDetails') {
        this.util.verifyText(
          value,
          this.receiptDetailsMsg,
          'Receipt Details Message'
        )
      } else if (key == 'acknowledgeMsg') {
        this.util.verifyText(value, this.acknowledgeMsg, 'Thank you Message')
      }
    }
  }
}
