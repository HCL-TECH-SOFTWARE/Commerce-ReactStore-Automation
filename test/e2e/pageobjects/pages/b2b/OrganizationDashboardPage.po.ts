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
//OrganizationDashboard Page Page class is used to handle the object of Organization Dashboard Page
export class OrganizationDashboardPage {
  commentOnRejectUserRegistration = $("//textarea[@formcontrolname='comments']");
  constructor() {}

  /**
   * Used to select a particular link like address book , personal information
   * @param subtitle : pass subtitle or section heading
   * @param linkName : pass link name
   */
  async dashboard(subtitle: string, linkName: string) {
    const selector = "//h6[text()='" + subtitle + "']/following-sibling::div//h6[text()='" + linkName + "']";
    const locator = $(selector);
    await locator.waitForDisplayed();
    await locator.click();
  }
  /**
   * Used to handle action action on requestion ( Admin user only)
   * @param requestorName : pass requestor name
   * @param action : pass action name like Approve
   */
  async handleActionOnRequestor(requestorName: string, action: string) {
    const xpath =
      "//tbody[@role='rowgroup']/tr/td[1]/a[contains(text(),'" + requestorName + "')]/../following-sibling::td[5]";
    if (action === "Approve") {
      const locator = $(`${xpath}//button[1]`);
      await locator.waitForDisplayed();
      await locator.click();
    } else {
      const locator = $(`${xpath}//button[2]`);
      await locator.waitForDisplayed();
      await locator.click();
    }
  }
  /**
   * Used to Comment on Reject Alert
   * @param enterCommnet : pass comment
   */
  async commentOnRejectAlert(enterCommnet: string) {
    await this.commentOnRejectUserRegistration.waitForDisplayed();
    await this.commentOnRejectUserRegistration.setValue(enterCommnet);
  }
  /**
   * Used to reject User registration
   * @param enterbtnName : pass button name
   */
  async rejectUserRegistration(enterbtnName: string) {
    const selector = $("//button[text()='" + enterbtnName + "']");
    await selector.waitForDisplayed();
    await selector.click();
  }
  /**
   * Used to verify Requestor rejected
   * @param requestorName : pass requestor name
   */
  async verifyRequestorRejected(requestorName: string) {
    const selector = $(
      "//tbody[@role='rowgroup']/tr/td[1]/a[contains(text(),'" + requestorName + "')]/../following-sibling::td[3]"
    );
    await expect(await selector.getText()).toBe("Rejected");
  }
}
