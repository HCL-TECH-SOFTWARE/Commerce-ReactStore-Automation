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

//Personal Information Page Page class is used to handle the object of Organization Dashboard Page
export class PersonalInformation {
  util = new Utils();
  personalInformationHeader = "//h5[contains(text(),'Personal Information')]";
  welcomeMsg = "//h4[contains(text(),'Welcome')]";
  alertMsgForChangePassword = $("//div[@role='dialog']/div[2]");
  dashboardLink = $("//a[contains(@href,'dashboard')]");
  incorrectCurrentPasswordAlert = "//div[@class='MuiAlert-message']";
  private savePI = "button-personal-information-save-edit";
  private editPI = "button-edit-personal-info";
  private chgPw = "button-change-password-dialog-open";
  private savePw = "button-change-password-dialog-submit";
  private dialogClose = "close-dialog-title-icon-button";

  static async get() {
    const p = new PersonalInformation();
    await p.validate();
    return p;
  }

  private constructor() {}

  async validate() {
    await $(this.personalInformationHeader).waitForDisplayed();
    await this.util.waitForElementTobeVisible(await $(`//button[@data-testid="${this.chgPw}"]`));
  }

  async editPersonalInfo() {
    await this.util.buttonClickById(this.editPI);
    await this.util.waitForElementTobeVisible(await $(`//button[@data-testid="${this.savePI}"]`));
  }

  async changePassword() {
    await this.util.buttonClickById(this.chgPw);
    await this.util.waitForElementTobeVisible(await $(`//button[@data-testid="${this.savePw}"]`));
  }

  async savePassword() {
    await this.util.buttonClickById(this.savePw);
  }

  /**
   * Used to verfiy text value
   * @param fieldName pass field name
   * @param expectedValue pass expected value
   */
  async verifyTextValue(fieldName: String, expectedValue: string) {
    const selector = "//label[text()='" + fieldName + "']/../div/input";
    await expect(await $(selector).getAttribute("value")).toBe(expectedValue);
  }
  /**
   * Used to verify broken links from the page
   */
  async verifyBrokenlinks() {
    //get all links on the page
    const links = await $$("a");
    const urls = await Promise.all(links.map(async (links) => await links.getAttribute("href")));
    for (const url of urls) {
      console.log(url);
    }
  }
  /**
   * Used to verify single link
   * @param linkName pass link name
   */
  async verifylinks(linkName: string) {
    const links = "//a[contains(@href,'" + linkName + "')]";
    await expect(await $(links).isDisplayed()).toBe(true);
  }
  /**
   * Used to verify Personal Information Page heading
   */
  async verifyPersonalInformationPageHeading() {
    await this.util.verifyText("Personal Information", this.personalInformationHeader, "Page Heading");
  }
  /**
   * Used to verify Welcome message
   */
  async verifyWelcomeMsg() {
    await this.util.verifyText("Welcome", this.welcomeMsg, "Welcome Message");
  }

  /**
   * Used to set value on web page
   * @param fieldName : pass field name
   * @param fieldValue : pass field value
   */
  async type(fieldName: string, fieldValue: string) {
    const selector = `//label[text()="${fieldName}"]/../div/input`;
    await this.util.clearValue(selector);
    await this.util.setValue(fieldValue, selector);
  }

  async verifySaveDisabled() {
    await this.util.verifyBtnNotClickableById(this.savePI);
  }

  async verifySavePwDisabled() {
    await this.util.verifyBtnNotClickableById(this.savePw);
  }

  /**
   * Used to verify update button is disabled
   * @deprecated
   */
  async verifyUpdatebtnDisabled() {
    await this.util.verifyBtnNotClickable("Change Password");
  }

  /**
   * Used to verify change password alert
   * @param expectedAlertMessage : pass expected message
   */
  async verifyChangePasswordAlert(expectedAlertMessage: string) {
    await expect(await this.alertMsgForChangePassword.getText()).toBe(expectedAlertMessage);
    await this.util.buttonClickById(this.dialogClose);
  }

  /**
   * Method is used to verify the alert Message for incorrect password
   * @param expectedAlertMessage : pass the expected message to be display
   */
  async verifyIncorrectCurrentPasswordAlert(expectedAlertMessage: string) {
    await this.util.verifyDialogAlertMsg(expectedAlertMessage, this.incorrectCurrentPasswordAlert);
  }
  /**
   * Method is used to verify the Password policy alert message
   * @param expectedAlertMessage : pass the expected message to be display
   */
  async verifyPasswordPolicyAlertMessage(expectedAlertMessage: string) {
    await this.util.verifyDialogAlertMsg(expectedAlertMessage, this.incorrectCurrentPasswordAlert);
  }
  /**
   * Used to store password to runtime json
   */
  async storePassword(testDataPassword: string) {
    RestHelper.writeRuntimeJSON({ password: testDataPassword });
  }
}
