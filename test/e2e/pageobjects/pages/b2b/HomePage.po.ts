/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 1996, 2020
 *
 *--------------------------------------------------
 */
import { Utils } from '../Utils.po'
import { MegaMenu } from '../MegaMenu.po'
import { RegistrationPage } from './RegistrationPage.po'
import { SearchResultPage } from './SearchResultPage.po'
import envConfig = require('../../../../../env.config.json')
import { ShoppingCartPage } from './ShoppingCartPage.po'
//Home page class is used to handle the object of Home Page
export class HomePage {
  util = new Utils()
  sign_in = $("//p[contains(text(),'Sign In / Register')]")
  signInHeader = '//h1'
  username = $("//form//input[@name='email']")
  password = $("//form//input[@name='password']")
  welcomeMsg = $("//p[contains(text(),'Welcome')]")
  your_Account = "//p[text()='Your Account']"
  searchInput = "//input[@name = 'searchTerm']"
  alertMsg = 'div.MuiAlert-message'
  itemsCart = "//span[@class='MuiButton-label']//p[contains(text(),'Item')]"
  cartItemValue = "//button[@data-testid = 'header-mini-cart-button']//p"
  viewFullCart = "//span[text()='View Full Cart']"
  forgetYourPwd = "//a[text()='Forgot your password?']"
  invalidSessionTitle = $("//h2[text()='Invalid Session Error']")
  cancelBtn = $("//button/span[text()='Cancel']")
  /**
   * Used to verify home page loaded
   * @param pageTitle pass expected page title
   */
  verifyStorefrontLoaded (pageTitle: string) {
    if (!browser.getTitle().match(pageTitle)) {
      expect(browser.getTitle()).toBe(
        pageTitle,
        'Home page is still not loaded'
      )
    }
  }
  /**
   * Method is used to verify sign in header
   */
  verifySignInHeader () {
    expect($(this.signInHeader).isDisplayed()).toBe(
      true,
      'Sign in page is not displayed'
    )
  }
  /**
   * Used to click on sign in link
   */
  signIn (): RegistrationPage {
    if (this.invalidSessionTitle.isDisplayed()) {
      this.cancelBtn.click()
    }
    this.sign_in.waitForDisplayed()
    this.sign_in.click()
    return new RegistrationPage()
  }
  /**
   * Used to login into b2b application
   * @param typeUsername : pass username from test data
   * @param typePassword : pass passoword from test data
   */
  login (typeUsername: string, typePassword: string) {
    this.username.waitForDisplayed()
    this.username.setValue(typeUsername)
    this.password.setValue(typePassword)
    this.util.handleOnClickBtn('Sign In')
    this.waitForLogin()
  }
  /**
   * Used to login into b2b application
   * @param typeUsername : pass username from test data
   * @param typePassword : pass passoword from test data
   */
  loginWithoutValidation (typeUsername: string, typePassword: string) {
    this.username.waitForDisplayed()
    this.username.setValue(typeUsername)
    this.password.setValue(typePassword)
    this.util.handleOnClickBtn('Sign In')
  }
  /**
   * Used to wait till the application successfully logged in
   */
  waitForLogin () {
    this.welcomeMsg.waitForDisplayed()
    browser.waitUntil(() => this.welcomeMsg.getText().includes('Welcome'), {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: 'Unable to signin'
    })
  }
  /**
   *Used to click on account window links
   * @param linkName : pass accound window link name as string
   */
  goToAccountWindow (linkName: string) {
    const selector = "//ul//span[text()='" + linkName + "']"
    $(selector).waitForDisplayed()
    $(selector).click()
  }
  /**
   * Used to click on Your accound link
   */
  goToYourAccount () {
    $(this.searchInput).scrollIntoView()
    this.util.handleOnCickLink(this.your_Account)
    return this
  }
  /**
   * Used to click on Your accound link from store wrapper
   */
  goToYourAccountViaStoreWrapper () {
    this.util.handleOnCickLink(this.your_Account)
    return this
  }
  /**
   * Used to set a search text value
   * @param value : pass a value that need to be set
   * @returns HomePage()
   */
  inputSearchText (value: string) {
    $(this.searchInput).waitForDisplayed()
    $(this.searchInput).click()
    this.util.setValue(value, this.searchInput)
    browser.pause(envConfig.timeout.lowtimeout)
    return this
  }
  /**
   * method to enter key
   * @returns new SearchResultPage()
   */
  enter (): SearchResultPage {
    browser.keys('\uE007')
    return new SearchResultPage()
  }
  /**
   * Used to click on search
   * @param searchTerm pass search term as a string
   * @return : SearchResultPage()
   */
  clickSearchKeyword (searchTerm: string): SearchResultPage {
    const keywordSelector =
      "//a[@href = '/Sapphire/search?searchTerm=" + searchTerm + "']"
    browser.waitUntil(
      () =>
        $(keywordSelector).isDisplayed() === true &&
        $(keywordSelector)
          .getText()
          .includes(searchTerm),
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg:
          'No keyword result found for the selected search term : ' + searchTerm
      }
    )
    $(keywordSelector).click()
    return new SearchResultPage()
  }
  /**
   * Used to click on Header menu
   * @param menu : Pass menu name as a string
   * @return : MegaMenu()
   */
  headerMenu (menu: string): MegaMenu {
    console.log('Clicked on Header Menu')
    const headermenu: string = "//p[contains(text(), '" + menu + "')]"
    $(headermenu).waitForDisplayed()
    $(headermenu).click()
    return new MegaMenu()
  }
  /**
   * Used to click on buyer registration button
   */
  buyerRegistration () {
    this.util.handleOnClickBtn('Register a Buyer')
  }
  /**
   * Used to click on Organization Registration button
   */
  organizationRegistration () {
    this.util.handleOnClickBtn('Register an Organization')
  }
  /**
   * Method is used to verify dialog alert messsage
   */
  verifyAlertMsg (Msg: string) {
    this.util.verifyDialogAlertMsg(Msg, this.alertMsg)
  }
  /**
   * Method is used to click on item cart and then click on view cart
   */
  openShoppingCart () {
    $(this.itemsCart).waitForDisplayed()
    $(this.itemsCart).click()
    browser.waitUntil(() => $(this.viewFullCart).isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'View Full Cart is not displayed'
    })
    $(this.viewFullCart).click()
    return new ShoppingCartPage()
  }
}
