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
import dataFile from "../../../tests/data/b2b/orgRegistrationPage.json";
const date = new Date();
const timeStamp =
  date.getHours().toString() +
  date.getMinutes().toString() +
  date.getSeconds().toString() +
  date.getMilliseconds().toString();
const OrgName = dataFile.test01.organizationName + timeStamp;
const AdminOrgLogonID = dataFile.test01.logonId + timeStamp;

//Registration Page class is used to handle the object of Registration Page
export class RegistrationPage {
  util = new Utils();
  config = require("../../../tests/data/UserManagementData.json");
  registerTextField =
    "//div[@class='MuiGrid-root sc-ezrdKe gdrbsr MuiGrid-container MuiGrid-spacing-xs-2 MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6']";
  alertMsg = "//div[@role='dialog']/div";
  errorMsg = "//div[@class='MuiAlert-message']";
  fieldLocator = "//input[@name= 'field']";
  constructor() {}

  /**
   * Used to fill the details for the register page of both buyer and organization
   * @param textBoxName : pass field name
   * @param textBoxValue : pass field value
   * @param columnNumber : pass section number
   */
  async register(textBoxName: string, textBoxValue: string) {
    await $("//label[text()='" + textBoxName + "']/..//div/input").setValue(textBoxValue);
  }

  /**
   * Used to click on submit button
   */
  async completeRegistration() {
    await this.util.handleOnClickBtn("Complete Registration");
  }

  /**
   * Used to verify alert message after registration
   * @param alertMsg : pass expected alert message
   * @param buyerAlertMsg : pass alert message locator
   */
  async verifyAlertMsg(alertMsg: string, buyerAlertMsg: string) {
    await this.util.verifyDialogAlertMsg(alertMsg, buyerAlertMsg);
  }

  /**
   * Used to click on Ok button
   */
  async ok() {
    await this.util.handleOnClickBtn("OK");
  }

  /**
   * Method is used to store and read Organization Name
   */
  async readOrgID() {
    const readfile = require("../../../../../runtime.json");
    const runtime = readfile;
    runtime.orgID = OrgName;
    return runtime.orgID;
  }

  /**
   * Method is used to store and read Admin Organization Logon ID
   */
  async readAdminOrgLogonID() {
    const readfile = require("../../../../../runtime.json");
    const runtime = readfile;
    runtime.adminOrgLogonID = AdminOrgLogonID;
    return runtime.adminOrgLogonID;
  }

  /**
   * Method is use to click on add address line 2
   */
  async addAddressline2() {
    await this.util.handleOnClickBtn("Add Address Line 2");
  }

  /**
   * Method is use to click on "Next, register an administrator"
   */
  async next() {
    await this.util.handleOnClickBtn("Next, register an administrator");
  }

  /**
   * Method is use to click on "Back"
   */
  async back() {
    await this.util.handleOnClickBtn("Back");
  }

  /**
   * Method is used to verify active stepper
   */
  async verifyActiveStepperByStepLabel(stepLabel: string) {
    const stepIconActiveSelector =
      "//span[text() = '" +
      stepLabel +
      "']//ancestor::span//span[@class = 'MuiStepLabel-iconContainer']//*[contains(@class,'MuiStepIcon-active')]";
    await expect(await $(stepIconActiveSelector).isDisplayed()).toBe(true);
  }

  /**
   * Method is used to verify completed stepper
   */
  async verifyCompletedStepperByStepLabel(stepLabel: string) {
    const stepIconCompletedSelector =
      "//span[text() = '" +
      stepLabel +
      "']//ancestor::span//span[@class = 'MuiStepLabel-iconContainer']//*[contains(@class,'MuiStepIcon-completed')]";
    await expect(await $(stepIconCompletedSelector).isDisplayed()).toBe(true);
  }

  /**
   * verify no error msg display
   * @param textBoxName : pass textbox name as a string
   * @returns RegistrationPage()
   */
  async verifyNoErrorMsgDisplay(textBoxName: string) {
    let selector;
    if (textBoxName !== null) {
      switch (textBoxName) {
        case "Organization Name":
          selector = "//label[text()='Organization Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Email":
          selector = "//label[text()='Email']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Phone (optional)":
          selector = "//label[text()='Phone (optional)']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Address line 1":
          selector = "//label[text()='Address line 1']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Address line 2 (optional)":
          selector = "//label[text()='Address line 2 (optional)']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Zip Code/ Postal Code":
          selector = "//label[text()='Zip Code/ Postal Code']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "State / Province":
          selector = "//label[text()='State / Province']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "City":
          selector = "//label[text()='City']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Country":
          selector = "//label[text()='Country']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Logon Id":
          selector = "//label[text()='Logon Id']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "First Name":
          selector = "//label[text()='First Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Last Name":
          selector = "//label[text()='Last Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Password":
          selector = "//label[text()='Password']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
        case "Verify Password":
          selector = "//label[text()='Verify Password']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).isDisplayed()).toBe(false);
          break;
      }
    }
    return this;
  }

  /**
   * verify error msg display for given field
   * @param textBoxName : pass textbox name as a string
   * @param expectedErrorMsg pass expectedErrorMsg as a string
   * @returns RegistrationPage()
   */
  async verifyErrorMsgDisplay(textBoxName: string, expectedErrorMsg: string) {
    let selector;
    if (textBoxName !== null) {
      switch (textBoxName) {
        case "Organization Name":
          selector = "//label[text()='Organization Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Email":
          selector = "//label[text()='Email']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Phone (optional)":
          selector = "//label[text()='Phone (optional)']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Address line 1":
          selector = "//label[text()='Address line 1']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Address line 2 (optional)":
          selector = "//label[text()='Address line 2 (optional)']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Zip Code/ Postal Code":
          selector = "//label[text()='Zip Code/ Postal Code']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "State / Province":
          selector = "//label[text()='State / Province']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "City":
          selector = "//label[text()='City']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Country":
          selector = "//label[text()='Country']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Logon Id":
          selector = "//label[text()='Logon Id']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "First Name":
          selector = "//label[text()='First Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Last Name":
          selector = "//label[text()='Last Name']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Password":
          selector = "//label[text()='Password']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
        case "Verify Password":
          selector = "//label[text()='Verify Password']/..//div/input//parent::div//following-sibling::p";
          await expect(await $(selector).getText()).toContain(expectedErrorMsg);
          break;
      }
    }
    return this;
  }

  /**
   * method to validate attribute value
   * @param textBoxName pass textbox name as a string
   * @param attribute pass attribute as a string
   * @param expectedValue pass expectedValue as a string
   * @returns RegistrationPage()
   */
  async verifyAttributeValue(textBoxName: string, attribute: string, expectedValue: string) {
    let selector;
    if (textBoxName !== null) {
      switch (textBoxName) {
        case "Organization Name":
          selector = "//label[text()='Organization Name']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Email":
          selector = "//label[text()='Email']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Phone (optional)":
          selector = "//label[text()='Phone (optional)']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Address line 1":
          selector = "//label[text()='Address line 1']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Address line 2 (optional)":
          selector = "//label[text()='Address line 2 (optional)']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Zip Code/ Postal Code":
          selector = "//label[text()='Zip Code/ Postal Code']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "State / Province":
          selector = "//label[text()='State / Province']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "City":
          selector = "//label[text()='City']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Country":
          selector = "//label[text()='Country']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Logon Id":
          selector = "//label[text()='Logon Id']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "First Name":
          selector = "//label[text()='First Name']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Last Name":
          selector = "//label[text()='Last Name']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Password":
          selector = "//label[text()='Password']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
        case "Verify Password":
          selector = "//label[text()='Verify Password']/..//div/input";
          await expect(await $(selector).getAttribute(attribute)).toBe(expectedValue);
          break;
      }
    }
    return this;
  }

  /**
   * Method is used to clear input field value
   * @param textBoxName pass textBoxName as a string
   */
  async clearValue(textBoxName: string) {
    const selector = $("//label[text()='" + textBoxName + "']/..//div/input");
    const inputValue = await selector.getValue();
    const length = inputValue.length;
    const backSpaces = new Array(length).fill("Backspace");
    await selector.setValue(backSpaces);
  }
}
