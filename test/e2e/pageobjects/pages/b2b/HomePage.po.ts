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
import { MegaMenu } from "../MegaMenu.po";
import { RegistrationPage } from "./RegistrationPage.po";
import { SearchResultPage } from "./SearchResultPage.po";
import envConfig from "../../../../../env.config.json";
import { ShoppingCartPage } from "./ShoppingCartPage.po";
//Home page class is used to handle the object of Home Page
export class HomePage {
  util = new Utils();
  sign_in = $("button[data-testid='button-header-sign-in']");
  signInHeader = "//h1";
  username = $("form input[name='email']");
  password = $("form input[name='password']");
  welcomeMsg = $("//p[contains(text(),'Welcome')]");
  your_Account = "//p[text()='Your Account']";
  searchInput = "//input[@name = 'searchTerm']";
  alertMsg = "div.MuiAlert-message";
  itemsCart = "//span[@class='MuiButton-label']//p[contains(text(),'Item')]";
  cartItemValue = "//button[@data-testid='button-header-mini-cart-button']//p";
  viewFullCart = "//span[text()='View Full Cart']";
  forgotYourPwd = "a[data-testid='forgot-password']";
  cancelBtn = $("button[data-testid='session-error-cancel']");

  private SIGN_IN_BUTTON_ID = "button-sign-in-submit";

  constructor() {}
  /**
   * Used to verify home page loaded
   * @param pageTitle pass expected page title
   */
  async verifyStorefrontLoaded(pageTitle: string) {
    if (!(await browser.getTitle()).match(pageTitle)) {
      await expect(await browser.getTitle()).toEqual(pageTitle);
    }
  }
  /**
   * Method is used to verify sign in header
   */
  async verifySignInHeader() {
    await expect(await $(this.signInHeader)).toBeDisplayed({ message: "Sign in page is not displayed" });
  }
  /**
   * Used to click on sign in link
   */
  async signIn() {
    if (await this.cancelBtn.isDisplayed()) {
      await this.cancelBtn.click();
    }
    await this.sign_in.waitForDisplayed();
    await this.sign_in.click();
    return new RegistrationPage();
  }
  /**
   * Used to login into b2b application
   * @param typeUsername : pass username from test data
   * @param typePassword : pass passoword from test data
   */
  async login(typeUsername: string, typePassword: string) {
    await this.username.waitForDisplayed();
    await this.username.setValue(typeUsername);
    await this.password.setValue(typePassword);

    await browser.pause(envConfig.timeout.lowtimeout);
    await this.util.buttonClickById(this.SIGN_IN_BUTTON_ID);
    await this.waitForLogin();
  }
  /**
   * Used to login into b2b application
   * @param typeUsername : pass username from test data
   * @param typePassword : pass passoword from test data
   */
  async loginWithoutValidation(typeUsername: string, typePassword: string) {
    await this.username.waitForDisplayed();
    await this.username.setValue(typeUsername);
    await this.password.setValue(typePassword);
    await browser.pause(envConfig.timeout.lowtimeout);
    await this.util.buttonClickById(this.SIGN_IN_BUTTON_ID);
  }
  /**
   * Used to wait till the application successfully logged in
   */
  async waitForLogin() {
    await this.welcomeMsg.waitForDisplayed();
    await browser.waitUntil(async () => (await this.welcomeMsg.getText()).includes("Welcome"), {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Unable to signin",
    });
  }
  /**
   *Used to click on account window links
   * @param linkName : pass accound window link name as string
   */
  async goToAccountWindow(linkName: string) {
    const selector = "//ul//span[text()='" + linkName + "']";
    await $(selector).waitForDisplayed();
    await $(selector).click();
  }
  /**
   * Used to click on Your accound link
   */
  async goToYourAccount() {
    await browser.pause(envConfig.timeout.lowtimeout);
    await $(this.searchInput).scrollIntoView();
    await this.util.handleOnCickLink(this.your_Account);
    return this;
  }
  /**
   * Used to click on Your accound link from store wrapper
   */
  async goToYourAccountViaStoreWrapper() {
    await this.util.handleOnCickLink(this.your_Account);
    return this;
  }
  /**
   * Used to set a search text value
   * @param value : pass a value that need to be set
   * @returns HomePage()
   */
  async inputSearchText(value: string) {
    await $(this.searchInput).waitForDisplayed();
    await $(this.searchInput).click();
    await this.util.setValue(value, this.searchInput);
    await browser.pause(envConfig.timeout.maxtimeout);
    return this;
  }
  /**
   * method to enter key
   * @returns new SearchResultPage()
   */
  async enter() {
    await browser.keys("\uE007");
    return new SearchResultPage();
  }
  /**
   * Used to click on search
   * @param searchTerm pass search term as a string
   * @return : SearchResultPage()
   */
  async clickSearchKeyword(searchTerm: string) {
    const keywordSelector = "//a[@href = '/Sapphire/search?searchTerm=" + searchTerm + "']";
    const locator = $(keywordSelector);
    await browser.waitUntil(
      async () => (await locator.isDisplayed()) === true && (await locator.getText()).includes(searchTerm),
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: "No keyword result found for the selected search term : " + searchTerm,
      }
    );
    await locator.click();
    return new SearchResultPage();
  }
  /**
   * Used to click on Header menu
   * @param menu : Pass menu name as a string
   * @return : MegaMenu()
   */
  async headerMenu(menu: string) {
    const m = "HomePage.headerMenu";
    Utils.log(m, "Clicked on Header Menu");
    const headermenu: string = `//p[contains(text(), "${menu}")]`;
    const locator = $(headermenu);
    await locator.waitForDisplayed();
    await locator.click();
    return new MegaMenu();
  }
  /**
   * Used to click on buyer registration button
   */
  async buyerRegistration() {
    await this.util.handleOnClickBtn("Register a Buyer");
  }
  /**
   * Used to click on Organization Registration button
   */
  async organizationRegistration() {
    await this.util.handleOnClickBtn("Register an Organization");
  }
  /**
   * Method is used to verify dialog alert messsage
   */
  async verifyAlertMsg(Msg: string) {
    await this.util.verifyDialogAlertMsg(Msg, this.alertMsg);
  }
  /**
   * Used to verify login into b2b application
   * @param typeUsername : pass username from test data
   * @param typePassword : pass passoword from test data
   */
  async verifyLogin(typeUsername: string, typePassword: string) {
    await this.username.waitForDisplayed();
    await this.username.setValue(typeUsername);
    await this.password.setValue(typePassword);
    await browser.pause(envConfig.timeout.lowtimeout);
    await this.util.buttonClickById(this.SIGN_IN_BUTTON_ID);
  }
  /**
   * Method is used to click on item cart and then click on view cart
   */
  async openShoppingCart() {
    await $(this.itemsCart).waitForDisplayed();
    await $(this.itemsCart).click();
    await browser.pause(envConfig.timeout.lowtimeout);
    await $(this.viewFullCart).click();
    return new ShoppingCartPage();
  }
  /**
   * Used to click on forgot password link
   */
  async forgotYourPassword() {
    const locator = $(this.forgotYourPwd);
    await locator.waitForClickable();
    await locator.click();
  }
  /**
   * Method is used to get cart item value
   * @returns value as a integer
   */
  async getCartItemValue() {
    await browser.pause(envConfig.timeout.midtimeout);
    const locator = $(this.cartItemValue);
    const value = (await locator.getText()).split(" ")[0];
    return parseInt(value);
  }
  /**
   * Method is used to validate cart is not empty
   */
  async verifyCartIsNotEmpty() {
    await expect(await this.getCartItemValue()).toBeGreaterThan(0);
    return this;
  }
}
