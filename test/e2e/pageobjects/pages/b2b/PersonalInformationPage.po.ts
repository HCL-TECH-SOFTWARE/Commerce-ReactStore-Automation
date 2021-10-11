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
import fs = require('fs')
import * as envConfig from '../../../../../env.config.json'
//Personal Information Page Page class is used to handle the object of Organization Dashboard Page
export class PersonalInformation {
  util = new Utils()
  personalInformationHeader = '//h4'
  welcomeMsg = "//h6[contains(text(),'Welcome')]"
  welcomeDescription = '//h6/following-sibling::p'
  alertMsgForChangePassword = $("//div[@role='dialog']/div")
  dashboardLink = $("//a[contains(@href,'dashboard')]")
  incorrectCurrentPasswordAlert = "//div[@class='MuiAlert-message']"
  constructor () {
    $(this.personalInformationHeader).waitForDisplayed()
  }
  /**
   * Used to verfiy text value
   * @param fieldName pass field name
   * @param expectedValue pass expected value
   */
  verifyTextValue (fieldName: string, expectedValue: string) {
    const selector = "//label[text()='" + fieldName + "']/../div/input"
    expect($(selector).getAttribute('value')).toBe(
      expectedValue,
      fieldName + ': is not equal to expected value(' + expectedValue
    )
  }
  /**
   * Used to verify single link
   * @param linkName pass link name
   */
  verifylinks (linkName: string) {
    const links = "//a[contains(@href,'" + linkName + "')]"
    expect($(links).isDisplayed()).toBe(
      true,
      linkName + ' is not displayed or its not a link'
    )
  }
  /**
   * Used to click on dashboard link
   */
  dashboard () {
    browser.waitUntil(() => this.dashboardLink.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Dashboard Link is not displayed'
    })
    this.dashboardLink.waitForDisplayed()
    this.dashboardLink.click()
  }
  /**
   * Used to verify Personal Information Page heading
   */
  verifyPersonalInformationPageHeading () {
    this.util.verifyText(
      'Personal Information',
      this.personalInformationHeader,
      'Page Heading'
    )
  }
  /**
   * Used to verify Welcome message
   */
  verifyWelcomeMsg () {
    this.util.verifyText('Welcome', this.welcomeMsg, 'Welcome Message')
  }
  /**
   * Used to verify Welcome Description
   */
  verifyWelcomeDecription (welcomeDescription: string) {
    this.util.verifyText(
      welcomeDescription,
      this.welcomeDescription,
      'Welcome Description'
    )
  }
  /**
   * Used to set value on web page
   * @param fieldName : pass field name
   * @param fieldValue : pass field value
   */
  type (fieldName: string, fieldValue: string) {
    const selector = "//label[text()='" + fieldName + "']/../div/input"
    this.util.clearValue(selector)
    this.util.setValue(fieldValue, selector)
  }
  /**
   * Used to verify update button is disabled
   */
  verifyUpdatebtnDisabled () {
    this.util.verifyBtnNotClickable('Update')
  }
  /**
   * Used to click on update passoword button
   */
  updatePassword () {
    this.util.handleOnClickBtn('Update')
  }
  /**
   * Used to verify change password alert
   * @param expectedAlertMessage : pass expected message
   */
  verifyChangePasswordAlert (expectedAlertMessage: string) {
    browser.waitUntil(
      () => this.alertMsgForChangePassword.isDisplayed() === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: 'Add to current order button is not displayed'
      }
    )
    expect(this.alertMsgForChangePassword.getText()).toBe(
      expectedAlertMessage,
      'No Alert message for password, Unable to update the password'
    )
    this.util.handleOnClickBtn('OK')
  }
  /**
   * Used to store password to runtime json
   */
  storePassword (testDataPassword: string) {
    const path = 'runtime.json'
    try {
      fs.unlinkSync(path)
    } catch (err) {
      console.error(err)
    }
    const json = {
      password: testDataPassword
    }
    fs.writeFileSync('runtime.json', JSON.stringify(json))
  }
  /**
   * Used to validate button not clickable
   * @param buttonName : pass buttonName as a string
   */
  verifyButtonIsNotClickable (buttonName: string) {
    this.util.verifyBtnNotClickable(buttonName)
  }
}
