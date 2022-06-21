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

//RegistrationPage class is to handle the object of registration and sign-in page
export class RegistrationPage {
  util = new Utils();
  fieldLocator = "//input[@name= 'field']";
  registerBtn = "button[data-testid='button-sign-in-register']";
  signInHeading = $('//h1[contains(text(),"Sign In")]');
  registerHeading = $('//h1[contains(text(),"Register")]');
  registrationform = "form[name='registrationForm']";
  loginform = "//div[@id = 'sectionone_sign-in-registration-page']//form";
  alertMsg = "div.MuiAlert-message";
  alertClose = "div.MuiAlert-action";
  constructor() {}
  /**
   * method to navigate register new user screen
   * @returns RegistrationPage()
   */
  async registernow() {
    await this.util.buttonClickById("button-sign-in-register");
    await this.registerHeading.waitForDisplayed();
  }
  /**
   * method to register a new user
   * @param textboxName : pass field name
   * @param textboxValue : pass input value
   * @returns RegistrationPage()
   */
  async register(textboxName: string, textboxValue: string) {
    await $(this.registrationform + " input[name = '" + textboxName + "']").clearValue();
    await $(this.registrationform + " input[name = '" + textboxName + "']").setValue(textboxValue);
    return this;
  }
  /**
   * method to login
   * @param textboxName : pass field name
   * @param textboxValue : pass input value
   * @returns RegistrationPage()
   */
  async login(textboxName: string, textboxValue: string) {
    await $(this.loginform + "//input[@name = '" + textboxName + "']").clearValue();
    await $(this.loginform + "//input[@name = '" + textboxName + "']").setValue(textboxValue);
    return this;
  }
  /**
   * method to submit register
   */
  async submitRegister() {
    await this.util.buttonClickById("button-register-submit");
  }
  /**
   * method to submit register
   */
  async verifyBtnNotClickable(btnName: string) {
    await this.util.verifyBtnNotClickable(btnName);
  }
  /**
   * method to submit login
   */
  async submitLogin() {
    await this.util.buttonClickById("button-sign-in-submit");
  }
  /**
   * method to verify the alert messsage
   */
  async verifyAlertMsg(Msg: string) {
    await this.util.verifyDialogAlertMsg(Msg, this.alertMsg);
  }
  /**
   * method to close alert messsage
   */
  async closeAlert() {
    await browser.waitUntil(async () => (await $(this.alertClose).isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Either the alert or close action is not displayed",
    });
    await $(this.alertClose).click();
  }
  /**
   * verify no error msg display
   * @param fieldName : pass field name as a string
   */
  async verifyNoErrorMsgDisplay(fieldName: string) {
    let selector;
    if (fieldName !== null) {
      switch (fieldName) {
        case "email":
          selector = this.fieldLocator.replace(/field/, "email") + "//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "firstName":
          selector = this.fieldLocator.replace(/field/, "firstName") + "//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "lastName":
          selector = this.fieldLocator.replace(/field/, "lastName") + "//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "password1":
          selector = this.fieldLocator.replace(/field/, "password1") + "//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "password2":
          selector = this.fieldLocator.replace(/field/, "password2") + "//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
      }
    }
    return this;
  }
  /**
   * verify error msg for the given field
   * @param fieldName : pass field name as a string
   * @param expectedMsg pass expectedMsg as a string
   */
  async verifyErrorMsgDisplay(fieldName: string, expectedMsg: string) {
    let selector;
    if (fieldName !== null) {
      switch (fieldName) {
        case "email":
          selector = this.fieldLocator.replace(/field/, "email") + "//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedMsg);
          break;
        case "firstName":
          selector = this.fieldLocator.replace(/field/, "firstName") + "//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedMsg);
          break;
        case "lastName":
          selector = this.fieldLocator.replace(/field/, "lastName") + "//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedMsg);
          break;
        case "password1":
          selector = this.fieldLocator.replace(/field/, "password1") + "//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedMsg);
          break;
        case "password2":
          selector = this.fieldLocator.replace(/field/, "password2") + "//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedMsg);
          break;
      }
    }
    return this;
  }
  /**
   * method to validate attribute value
   * @param fieldName pass fieldName as a string
   * @param attribute pass attribute as a string
   * @param expectedValue pass expectedValue as a string
   */
  async verifyAttributeValue(fieldName: string, attribute: string, expectedValue: string) {
    let selector;
    if (fieldName !== null) {
      switch (fieldName) {
        case "email":
          selector = this.fieldLocator.replace(/field/, "email");
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "firstName":
          selector = this.fieldLocator.replace(/field/, "firstName");
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "lastName":
          selector = this.fieldLocator.replace(/field/, "lastName");
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "password1":
          selector = this.fieldLocator.replace(/field/, "password1");
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "password2":
          selector = this.fieldLocator.replace(/field/, "password2");
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
      }
    }
    return this;
  }
}
