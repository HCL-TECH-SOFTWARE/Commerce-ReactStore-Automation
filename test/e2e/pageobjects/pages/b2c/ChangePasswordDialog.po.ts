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
import { MyAccountPage } from "./MyAccountPage.po";
import { Utils } from "../Utils.po";
import * as envConfig from "../../../../../env.config.json";

//ChangePassswordDialog class is to handle the object of change password dialog
export class ChangePassswordDialog {
  util = new Utils();
  //Change Password Dialog
  changePasswordDialogTitle = $("h2.MuiTypography-root");
  //alert message
  changePwdSuccessDialog = $(".MuiDialog-paper");
  alertMessage = ".MuiDialogContent-root";
  errorAlertMsg = "div.MuiAlert-message";
  okButtonOnAlert = $("button[data-testid='close-dialog-title-icon-button']");
  timeoutvalue: number = envConfig.timeout.maxtimeout;
  constructor() {}
  /**
   * method to validate dialog load
   */
  async validate() {
    await this.changePasswordDialogTitle.waitForDisplayed();
  }
  /**
   * method to handle Ok click
   * @returns MyAccountPage()
   */
  async okay() {
    await (await this.okButtonOnAlert).isDisplayed();
    await (await this.okButtonOnAlert).click();
    return new MyAccountPage();
  }
  /**
   * method to set password value
   * @param fieldName : pass field name as a string
   * @param value : pass value as a string
   */
  async setDialogValue(fieldName: string, value: string) {
    const pwdSelector = "//input[@name='" + fieldName + "']";
    await this.util.setValue(value, pwdSelector);
  }
  /**
   * method to save change password
   */
  async save() {
    await this.util.handleOnClickBtn("Save");
  }
  /**
   * method to cancel change password
   */
  async cancel() {
    await this.util.handleOnClickBtn("Cancel");
    return new MyAccountPage();
  }
  /**
   * method to validate alert message
   * @param expectedMsg : pass expected alert msg as a string
   */
  async verifyAlertMsg(expectedMsg: string) {
    await browser.pause(envConfig.timeout.maxtimeout);
    await this.util.verifyDialogAlertMsg(expectedMsg, this.alertMessage);
  }
  /**
   * method to validate error message on alert
   * @param expectedMsg : pass expected alert msg as a string
   */
  async verifyInvalidAlertMsg(expectedMsg: string) {
    await this.util.verifyDialogAlertMsg(expectedMsg, this.errorAlertMsg);
  }
  /**
   * method to validate button is not clickable
   * @param buttonName pass buttonName as a string
   */
  async verifyButtonIsNotClickable(buttonName: string) {
    await this.util.verifyBtnNotClickable(buttonName);
  }
}
