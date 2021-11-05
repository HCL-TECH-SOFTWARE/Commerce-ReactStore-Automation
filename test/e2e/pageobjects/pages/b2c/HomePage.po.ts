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
import { MegaMenu } from '../MegaMenu.po'
import { RegistrationPage } from './RegistrationPage.po'
import { MyAccountPage } from './MyAccountPage.po'
import { Utils } from '../Utils.po'
import { RestHelper } from '../../base/RestHelper'
import { SearchResultPage } from './SearchResultPage.po'
import * as envConfig from '../../../../../env.config.json'
import { ShoppingCartPage } from '../b2c/ShoppingCartPage.po'

//HomePage class is to handle the object of home page
export class HomePage {
  util = new Utils()
  helper = new RestHelper()
  sign_In = $("//p[contains(text(), 'Sign In / Register')]")
  miniCartPopup = "//*[@data-testid= 'mini-cart-popper']"
  myAccountText = 'div.welcome-text'
  account_Settings = "//a[@id = 'head-popper-myaccount_link']"
  signOut = "//span[contains(text(), 'Sign out')]"
  searchInput = "//input[@name = 'searchTerm']"
  itemsCart = "//span[@class='MuiButton-label']//p[contains(text(),'Item')]"
  viewFullCart = "//span[text()='View Full Cart']"
  invalidSessionTitle = $("//h2[text()='Invalid Session Error']")
  cancelBtn = $("//button/span[text()='Cancel']")
  timeoutvalue: number = envConfig.timeout.maxtimeout
  /**
   * method to navigate SignIn/Registration page
   * @returns RegistrationPage()
   */
  signIn (): RegistrationPage {
    //First verify if Invalid session popup available
    if (this.invalidSessionTitle.isDisplayed()) {
      this.cancelBtn.click()
    }
    this.sign_In.waitForDisplayed()
    this.sign_In.click()
    return new RegistrationPage()
  }
  /**
   * method to navigate account settings
   * @returns MyAccountPage()
   */
  accountSettings (): MyAccountPage {
    $(this.myAccountText).waitForDisplayed()
    $(this.myAccountText).click()
    this.util.handleOnCickLink(this.account_Settings)
    return new MyAccountPage()
  }
  /**
   * method to sign out if signed in
   * @returns HomePage()
   */
  signOutIfSignedIn (): HomePage {
    if ($(this.myAccountText).isDisplayed()) {
      $(this.myAccountText).click()
      this.util.handleOnCickLink(this.signOut)
    }
    return this
  }
  /**
   * method to input search text on search box
   * @param value : pass search text as a string
   */
  inputSearchText (value: string) {
    $(this.searchInput).waitForEnabled()
    $(this.searchInput).click()
    this.util.setValue(value, this.searchInput)
    return this
  }
  /**
   * method to validate search text on browser url
   * @param searchText : pass expected search text as a string
   */
  verifySearchTerm (searchText: string) {
    expect(browser.getUrl()).toContain(
      searchText,
      'url does not contains the searchText'
    )
  }
  /**
   * method to validate user logged in
   */
  verifyMyAccount (firstName: string) {
    this.util.verifyText('Welcome, ' + firstName, this.myAccountText, 'Text')
  }
  /**
   * method to handle click on search keyword suggestion
   * @param searchTerm : pass expected search keyword
   * @returns SearchResultPage()
   */
  clickKeywordSuggestion (searchTerm: string): SearchResultPage {
    browser.pause(envConfig.timeout.maxtimeout)
    const keywordSelector = $(
      "//a[@href= '/Emerald/search?searchTerm=" + searchTerm + "']"
    )
    console.log('Keyword text is  ' + keywordSelector.getText())
    browser.waitUntil(
      () =>
        keywordSelector.isDisplayed() === true &&
        keywordSelector.getText() == searchTerm,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg:
          'No keyword result found for the selected search term : ' + searchTerm
      }
    )
    keywordSelector.click()
    return new SearchResultPage()
  }
  /**
   * method to navigate header menu
   * @param menu : pass menu name as a string
   * @returns MegaMenu()
   */
  headerMenu (menu: string): MegaMenu {
    const headermenu: string = "//p[contains(text(), '" + menu + "')]"
    $(headermenu).waitForDisplayed()
    $(headermenu).click()
    return new MegaMenu()
  }
  /**
   * Method is used to click on item cart and then click on view cart
   * @returns ShoppingCartPage()
   */
  openShoppingCart () {
    $(this.itemsCart).waitForDisplayed()
    if ($(this.miniCartPopup).isDisplayed() === false) {
      $(this.itemsCart).click()
      $(this.viewFullCart).waitForDisplayed()
    }
    $(this.viewFullCart).click()
    return new ShoppingCartPage()
  }
}
