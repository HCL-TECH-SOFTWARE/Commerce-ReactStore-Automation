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
import { MegaMenu } from "../MegaMenu.po";
import { RegistrationPage } from "./RegistrationPage.po";
import { MyAccountPage } from "./MyAccountPage.po";
import { Utils } from "../Utils.po";
import { RestHelper } from "../../base/RestHelper";
import { SearchResultPage } from "./SearchResultPage.po";
import * as envConfig from "../../../../../env.config.json";
import { ShoppingCartPage } from "../b2c/ShoppingCartPage.po";
import { truncateSync } from "fs";

//HomePage class is to handle the object of home page
export class HomePage {
  util = new Utils();
  helper = new RestHelper();
  sign_In = "button-header-sign-in";
  cartItemValue = "//button[@data-testid = 'button-header-mini-cart-button']//p";
  miniCartPopup = "//*[@data-testid= 'mini-cart-popper']";
  signInHeader = "//h1";
  alertMsg = "div.MuiAlert-message";
  myAccountText = "div.welcome-text";
  account_Settings = "a[data-testid='account-popper-account-link']";
  signOut = "a[data-testid='account-popper-signout-link']";
  shopcartLink = $("//button[@data-testid= 'header-mini-cart-button']");
  searchInput = "//input[@name = 'searchTerm']";
  footerStoreLogo = $("//a/img[@alt='Footer Store Logo']");
  titleRecommendedProd = $("//h4[contains(text(),'Recommended Products')]");
  //recommended product images
  imagesList = "//div[contains(@style,'background-image')]";
  recommendedProduct = "//h4[contains(text(),'Recommended Products')]//..//a//p";
  itemsCart = "//span[@class='MuiButton-label']//p[contains(text(),'Item')]";
  viewFullCart = "//span[text()='View Full Cart']";
  forgetYourPwd = "//a[text()='Forgot your password?']";
  invalidSessionTitle = $("//h2[text()='Invalid Session Error']");
  cancelBtn = $("//button/span[text()='Cancel']");
  timeoutvalue: number = envConfig.timeout.maxtimeout;
  constructor() {}
  /**
   * method to navigate SignIn/Registration page
   * @returns RegistrationPage()
   */
  async signIn() {
    //First verify if Invalid session popup available
    if (await this.cancelBtn.isDisplayed()) {
      await this.cancelBtn.click();
    }
    await this.util.buttonClickById(this.sign_In);
    return new RegistrationPage();
  }
  /**
   * method to navigate account settings
   * @returns MyAccountPage()
   */
  async accountSettings() {
    await $(this.myAccountText).waitForDisplayed();
    await $(this.myAccountText).click();
    await this.util.handleOnCickLink(this.account_Settings);
    return new MyAccountPage();
  }
  /**
   * Method is used to verify sign in header
   */
  async verifySignInHeader() {
    await expect(await $(this.signInHeader).isDisplayed()).toBe(truncateSync);
  }
  /**
   * method to sign out if signed in
   * @returns HomePage()
   */
  async signOutIfSignedIn() {
    if (await $(this.myAccountText).isDisplayed()) {
      await $(this.myAccountText).click();
      await this.util.handleOnCickLink(this.signOut);
    }
    return this;
  }
  /**
   * method to input search text on search box
   * @param value : pass search text as a string
   */
  async inputSearchText(value: string) {
    await $(this.searchInput).waitForEnabled();
    await $(this.searchInput).click();
    await this.util.setValue(value, this.searchInput);
    return this;
  }
  /**
   * method to validate search text on browser url
   * @param searchText : pass expected search text as a string
   */
  async verifySearchTerm(searchText: string) {
    await expect(await browser.getUrl()).toContain(searchText);
  }
  /**
   * method to validate user logged in
   */
  async verifyMyAccount(firstName: string) {
    await this.util.verifyText("Welcome, " + firstName, `${this.myAccountText}>p`, "Text");
  }
  /**
   * method to handle click on search keyword suggestion
   * @param searchTerm : pass expected search keyword
   * @returns SearchResultPage()
   */
  async clickKeywordSuggestion(searchTerm: string) {
    await browser.pause(envConfig.timeout.maxtimeout);
    const keywordSelector = $("//a[@href= '/Emerald/search?searchTerm=" + searchTerm + "']");
    console.log("Keyword text is  " + (await keywordSelector.getText()));
    await browser.waitUntil(
      async () => (await keywordSelector.isDisplayed()) === true && (await keywordSelector.getText()) == searchTerm,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: "No keyword result found for the selected search term : " + searchTerm,
      }
    );
    await keywordSelector.click();
    return new SearchResultPage();
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
   * method to navigate header menu
   * @param menu : pass menu name as a string
   * @returns MegaMenu()
   */
  async headerMenu(menu: string) {
    const headermenu: string = "//p[contains(text(), '" + menu + "')]";
    await $(headermenu).waitForDisplayed();
    await $(headermenu).click();
    return new MegaMenu();
  }
  /**
   * Method is used to click on footer store logo
   */
  async clickfooterStoreLogo() {
    await this.footerStoreLogo.waitForDisplayed();
    await this.footerStoreLogo.click();
  }
  /**
   * Method is used to click on the recommended product on home page
   */
  async clickOnRecommendedProduct() {
    let product = "";
    await this.titleRecommendedProd.scrollIntoView();
    await this.verifyImagesIsLoaded();
    const count = (await $$(this.recommendedProduct)).length;
    await browser.pause(envConfig.timeout.lowtimeout);
    if (count > 0) {
      console.log("enter into loop");
      await this.titleRecommendedProd.scrollIntoView();
      product = await $(this.recommendedProduct).getText();
      await $(this.recommendedProduct).click();
    } else {
      throw new Error("There is no product in recommended products on espot");
    }
    return product;
  }
  /**
   * Method is used to click on the kitchen category on Home page
   * @param categoryName : pass category name
   */
  async clickOnCategoryeSpot(categoryName: string) {
    const selector = $("//h3[text()='" + categoryName + "']");
    await $("//footer").scrollIntoView();
    await selector.waitForDisplayed();
    await selector.click();
  }
  /**
   * Method is used to click on item cart and then click on view cart
   * @returns ShoppingCartPage()
   */
  async openShoppingCart() {
    await $(this.itemsCart).waitForDisplayed();
    if ((await $(this.miniCartPopup).isDisplayed()) === false) {
      await $(this.itemsCart).click();
      await $(this.viewFullCart).waitForDisplayed();
    }
    await $(this.viewFullCart).click();
    const rc = await ShoppingCartPage.get();
    return rc;
  }
  /**
   * Method is used to verify image loaded properly on Home Page
   * @returns HomePage()
   */
  async verifyImagesIsLoaded() {
    await browser.pause(envConfig.timeout.midtimeout);
    await this.helper.verifyImageLoadedByStyle(this.imagesList);
    return this;
  }
  /*
   * Used to click on forget password link
   */
  async forgetYourPassword() {
    await $(this.forgetYourPwd).waitForClickable();
    await $(this.forgetYourPwd).click();
  }
  /**
   * Method is used to verify dialog alert messsage
   */
  async verifyAlertMsg(Msg: string) {
    await this.util.verifyDialogAlertMsg(Msg, this.alertMsg);
  }
  /**
   * Method is used to get cart item value
   * @returns value as a integer
   */
  async getCartItemValue() {
    await browser.pause(envConfig.timeout.midtimeout);
    const value = (await $(this.cartItemValue).getText()).split(" ")[0];
    console.log("number of items -- " + value);
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
