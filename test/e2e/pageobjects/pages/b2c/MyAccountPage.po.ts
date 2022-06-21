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
import { AddressBookPage } from "./AddressBookPage.po";
import { ChangePassswordDialog } from "./ChangePasswordDialog.po";
import { Utils } from "../Utils.po";
import { HomePage } from "./HomePage.po";

//MyAccountPage class is to handle the object of my account page
export class MyAccountPage {
  util = new Utils();
  //Personal Information
  pageHeading = "//h4[contains(text(), 'My Account')]";
  fullnameLabel = ".bottom-padding-2 > div:nth-child(1) > h6:nth-child(1)";
  signoutButton = "//span[contains(text(), 'Sign out')]";
  changepasswordButton = "//span[contains(text(), 'Change Password')]";
  myAccountToolsLabel = "h6.MuiTypography-root:nth-child(3)";
  addressbookLink = "//h6[contains(text(), 'Address Book')]";
  orderhistoryLink = "//h6[contains(text(), 'Order History')]";
  wishlistLink = "//h6[contains(text(), 'Wish List')]";
  constructor() {}
  /**
   * method to validate page load
   */
  async validate() {
    await $(this.pageHeading).waitForDisplayed();
    await $(this.myAccountToolsLabel).waitForDisplayed();
    await $(this.signoutButton).waitForDisplayed();
    await $(this.changepasswordButton).waitForDisplayed();
    await $(this.addressbookLink).waitForDisplayed();
    await $(this.orderhistoryLink).waitForDisplayed();
    await $(this.wishlistLink).waitForDisplayed();
  }
  /**
   * method to signout
   */
  async signOut() {
    await this.util.handleOnClickBtn("Sign out");
    return new HomePage();
  }
  /**
   * method to navigate changePassword dialog
   * @returns ChangePassswordDialog()
   */
  async changePassword() {
    await this.util.handleOnClickBtn("Change Password");
    return new ChangePassswordDialog();
  }
  /**
   * method to navigate address book page
   * @returns AddressBookPage()
   */
  async addressBook() {
    await this.util.handleOnCickLink(this.addressbookLink);
    return new AddressBookPage();
  }
  /**
   * method to validate user name
   * @param name : pass expected name as a string
   */
  async verifyName(name: string) {
    const disp = `Welcome, ${name}`;
    await browser.waitUntil(async () => await $(`//h4[//text()="${disp}"]`).isDisplayed());
  }
  /**
   * method to validate personal information
   * @param fieldName : pass expected field name as a string
   * @param index : pass index as a number to locate
   * @param type : pass type as 'email | phone | currency'
   */
  async verifyPersonalInfo(fieldName: string, index: number, type: string) {
    const selector = "div.MuiTypography-root:nth-child(" + index + ")";
    await this.util.verifyText(fieldName, selector, type);
  }
  /**
   * method to used to validate if btn btn disable
   */
  async verifyChangePwdBtnNotClickable() {
    await this.util.verifyBtnNotClickable("Change Password");
  }
}
