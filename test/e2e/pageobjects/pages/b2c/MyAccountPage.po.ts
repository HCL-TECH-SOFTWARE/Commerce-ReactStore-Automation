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
import { AddressBookPage } from './AddressBookPage.po'
import { ChangePassswordDialog } from './ChangePasswordDialog.po'
import { Utils } from '../Utils.po'
import { HomePage } from './HomePage.po'

//MyAccountPage class is to handle the object of my account page
export class MyAccountPage {
  util = new Utils()
  //Personal Information
  pageHeading = "//h4[contains(text(), 'My Account')]"
  fullnameLabel = '.bottom-padding-2 > div:nth-child(1) > h6:nth-child(1)'
  signoutButton = "//span[contains(text(), 'Sign out')]"
  changepasswordButton = "//span[contains(text(), 'Change Password')]"
  myAccountToolsLabel = 'h6.MuiTypography-root:nth-child(3)'
  addressbookLink = "//h6[contains(text(), 'Address Book')]"
  orderhistoryLink = "//h6[contains(text(), 'Order History')]"
  wishlistLink = "//h6[contains(text(), 'Wish List')]"
  /**
   * method to validate page load
   */
  validate () {
    $(this.pageHeading).waitForDisplayed()
    $(this.myAccountToolsLabel).waitForDisplayed()
    $(this.signoutButton).waitForDisplayed()
    $(this.changepasswordButton).waitForDisplayed()
    $(this.addressbookLink).waitForDisplayed()
    $(this.orderhistoryLink).waitForDisplayed()
    $(this.wishlistLink).waitForDisplayed()
  }
  /**
   * method to signout
   */
  signOut (): HomePage {
    this.util.handleOnClickBtn('Sign out')
    return new HomePage()
  }
  /**
   * method to navigate changePassword dialog
   * @returns ChangePassswordDialog()
   */
  changePassword (): ChangePassswordDialog {
    this.util.handleOnClickBtn('Change Password')
    return new ChangePassswordDialog()
  }
  /**
   * method to navigate address book page
   * @returns AddressBookPage()
   */
  addressBook (): AddressBookPage {
    this.util.handleOnCickLink(this.addressbookLink)
    return new AddressBookPage()
  }
  /**
   * method to validate user name
   * @param name : pass expected name as a string
   */
  verifyName (name: string) {
    this.util.verifyText(name, this.fullnameLabel, 'name')
  }
  /**
   * method to validate personal information
   * @param fieldName : pass expected field name as a string
   * @param index : pass index as a number to locate
   * @param type : pass type as 'email | phone | currency'
   */
  verifyPersonalInfo (fieldName: string, index: number, type: string) {
    const selector = 'div.MuiTypography-root:nth-child(' + index + ')'
    this.util.verifyText(fieldName, selector, type)
  }
}
