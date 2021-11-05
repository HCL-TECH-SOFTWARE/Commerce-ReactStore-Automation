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
import * as envConfig from '../../../../../env.config.json'
//OrganizationDashboard Page Page class is used to handle the object of Organization Dashboard Page
export class OrganizationDashboardPage {
  commentOnRejectUserRegistration = $("//textarea[@formcontrolname='comments']")
  /**
   * Used to select a particular link like address book , personal information
   * @param subtitle : pass subtitle or section heading
   * @param linkName : pass link name
   */
  dashboard (subtitle: string, linkName: string) {
    const selector =
      "//h6[text()='" +
      subtitle +
      "']/following-sibling::div//h6[text()='" +
      linkName +
      "']"
    browser.waitUntil(() => $(selector).isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Dashboard Page is not displayed'
    })
    $(selector).click()
  }
  /**
   * Used to handle action action on requestion ( Admin user only)
   * @param requestorName : pass requestor name
   * @param action : pass action name like Approve
   */
  handleActionOnRequestor (requestorName: string, action: string) {
    const selector =
      "//tbody[@role='rowgroup']/tr/td[1]/a[contains(text(),'" +
      requestorName +
      "')]/../following-sibling::td[5]"
    if (action === 'Approve') {
      $(selector + '//button[1]').waitForDisplayed()
      $(selector + '//button[1]').click()
    } else {
      $(selector + '//button[2]').waitForDisplayed()
      $(selector + '//button[2]').click()
    }
  }
  /**
   * Used to Comment on Reject Alert
   * @param enterCommnet : pass comment
   */
  commentOnRejectAlert (enterCommnet: string) {
    this.commentOnRejectUserRegistration.waitForDisplayed()
    this.commentOnRejectUserRegistration.setValue(enterCommnet)
  }
  /**
   * Used to reject User registration
   * @param enterbtnName : pass button name
   */
  rejectUserRegistration (enterbtnName: string) {
    const selector = "//button[text()='" + enterbtnName + "']"
    $(selector).waitForDisplayed()
    $(selector).click()
  }
  /**
   * Used to verify Requestor rejected
   * @param requestorName : pass requestor name
   */
  verifyRequestorRejected (requestorName: string) {
    const selector =
      "//tbody[@role='rowgroup']/tr/td[1]/a[contains(text(),'" +
      requestorName +
      "')]/../following-sibling::td[3]"
    expect($(selector).getText()).toBe(
      'Rejected',
      'Requestor request is not rejected'
    )
  }
}
