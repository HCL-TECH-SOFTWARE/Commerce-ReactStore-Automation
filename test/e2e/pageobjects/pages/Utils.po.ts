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
const envConfig = require('../../../../env.config.json')

//Utils class contains commonly used functions
export class Utils {
  /**
   * common method for button click
   * @param buttonName : pass button locator as a string
   */
  handleOnClickBtn (buttonName: string) {
    const buttonText = $("//span[text()='" + buttonName + "']")
    browser.waitUntil(() => buttonText.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: buttonName + ' button is not displayed'
    })
    buttonText.waitForClickable()
    buttonText.click()
  }
  /**
   * common method for link click
   * @param linkName : pass link locator as a string
   */
  handleOnCickLink (linkName: string) {
    $(linkName).waitForDisplayed()
    $(linkName).click()
  }
  /**
   * common method for handling alert and verify the message
   * @param expecetedAlertMessage : expected message from data file
   * @param alertMsgLocator : pass locator as a string
   */
  verifyDialogAlertMsg (
    expecetedAlertMessage: string,
    alertMsgLocator: string
  ) {
    browser.waitUntil(
      () =>
        $(alertMsgLocator).isDisplayed() === true &&
        $(alertMsgLocator)
          .getText()
          .includes(expecetedAlertMessage),
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg:
          'Alert message is not displayed as expected message | Exected Message:' +
          expecetedAlertMessage +
          '|Actual Message :' +
          $(alertMsgLocator).getText()
      }
    )
  }
  /**
   * Method to navigate URL
   * @param url : pass store name
   */
  url (url: string) {
    browser.url(url)
    browser.pause(envConfig.timeout.midtimeout * 2)
  }
  /**
   * common method to set input field value
   * @param inputValue : pass input value as a string
   * @param inputfieldLocator : pass field locator as a string
   */
  setValue (inputValue: string, inputfieldLocator: string) {
    $(inputfieldLocator).waitForDisplayed()
    $(inputfieldLocator).setValue(inputValue)
    return this
  }
  /**
   * common method to clear the input
   * @param inputfieldLocator : pass input locator as a string
   */
  clearValue (inputfieldLocator: string) {
    $(inputfieldLocator).waitForDisplayed()
    $(inputfieldLocator).clearValue()
  }
  /**
   * method to add input details on page
   * @param details : pass details as a json object where key as field name and value as an input field value
   */
  addDetails (details: object) {
    for (let [key, value] of Object.entries(details)) {
      const selector = $("//input[@name= '" + key + "']")
      selector.setValue(value)
    }
  }
  /**
   * method to edit input details on page
   * @param details : pass details as a json object where key as field name and value as an input field value
   */
  editDetails (details: object) {
    for (let [key, value] of Object.entries(details)) {
      const selector = $("//input[@name= '" + key + "']")
      const inputValue = selector.getValue()
      const length = inputValue.length
      const backSpaces = new Array(length).fill('Backspace')
      selector.setValue(backSpaces)
      selector.setValue(value)
    }
  }
  /**
   * method to validate added details on page
   * @param details : pass details as a json object where key as field name and value as input field value
   */
  verifyDetails (details: object) {
    for (let [key, value] of Object.entries(details)) {
      const selector = "//input[@name= '" + key + "']"
      this.verifyInputFieldValue(value, selector)
    }
  }
  /**
   * common method to verify page title
   * @param expectedtitle : pass expected title as a string
   */
  verifyPageTitle (expectedtitle: string) {
    browser.waitUntil(() => browser.getTitle() === expectedtitle, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg:
        'Expected page title is not displayed | Expected Title :' +
        expectedtitle
    })
  }
  /**
   * common method to verify button disable
   * @param buttonName : pass locator as a string
   */
  verifyBtnDisable (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    buttonText.waitForDisplayed()
    expect(buttonText.isEnabled()).toBe(
      false,
      'buttonName ' + buttonName + ' is still enabled'
    )
  }
  /**
   * common method to verify button enable
   * @param buttonName : pass locator as a string
   */
  verifyBtnEnable (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    buttonText.waitForDisplayed()
    expect(buttonText.isEnabled()).toBe(
      true,
      'buttonName ' + buttonName + ' is still disabled'
    )
  }
  /**
   * common method to verify button is clickable
   * @param buttonName : pass locator as a string
   */
  verifyBtnClickable (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    browser.waitUntil(() => buttonText.isClickable() === true, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg:
        'Expected button is not clickable | Expected button :' + buttonName
    })
  }
  /**
   * common method to verify button is not clickable
   * @param buttonName : pass locator as a string
   */
  verifyBtnNotClickable (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    browser.waitUntil(() => buttonText.isClickable() === false, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg:
        'Expected button is clickable | Expected button :' + buttonName
    })
  }
  /**
   * common method to verify button present
   * @param buttonName : pass locator as a string
   */
  verifyBtnPresent (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    browser.waitUntil(() => buttonText.isDisplayed() === true, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg:
        'Expected button is not prsesent | Expected button :' + buttonName
    })
  }
  /**
   * common method to verify button not present
   * @param buttonName : pass locator as a string
   */
  verifyBtnNotPresent (buttonName: string) {
    const buttonText = $('//span[text()=' + "'" + buttonName + "'" + ']')
    browser.waitUntil(() => buttonText.isDisplayed() === false, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: 'Expected button is present | Expected button :' + buttonName
    })
  }
  /**
   * common method to verify text
   * @param expectedText : pass expected text as a string
   * @param elementLocator : pass locator as a string
   * @param textType : this can be email, phone, pageHeading etc used for logging purpose
   */
  verifyText (expectedText: string, elementLocator: string, textType: string) {
    $(elementLocator).waitForDisplayed()
    browser.waitUntil(
      () =>
        $(elementLocator)
          .getText()
          .includes(expectedText),
      {
        timeout: envConfig.timeout.midtimeout * 2,
        timeoutMsg:
          'Expected ' +
          textType +
          ' is not matches with :' +
          expectedText +
          ' actual is ' +
          $(elementLocator).getText()
      }
    )
  }
  /**
   * common method to verify button display
   * @param buttonName : pass locator as a string
   */
  verifyButtonDisplay (buttonName: string) {
    const buttonText = '//span[text()=' + "'" + buttonName + "'" + ']'
    browser.waitUntil(() => $(buttonText).isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout * 1000,
      timeoutMsg: 'expected button ' + buttonName + ' is not displayed'
    })
  }
  /**
   * common method to verify button not display
   * @param buttonName : pass locator as a string
   */
  verifyButtonNotDisplay (buttonName: string) {
    const buttonText = '//span[text()=' + "'" + buttonName + "'" + ']'
    browser.waitUntil(() => $(buttonText).isDisplayed() === false, {
      timeout: envConfig.timeout.maxtimeout * 1000,
      timeoutMsg: 'expected button ' + buttonName + ' is still displayed'
    })
  }
  /**
   * common method to verify link display
   * @param linklocator : pass link locator as a string
   * @param linkName : pass link name as string for logging
   */
  verifyLinkDisplay (linklocator: string, linkName: string) {
    expect($(linklocator).isDisplayed()).toBe(
      true,
      +linkName + ' link is not displayed on page'
    )
  }
  /**
   * common method to validate field value
   * @param expectedInputValue : pass expected value as a string
   * @param inputfieldLocator : pass locator as a string
   */
  verifyInputFieldValue (
    expectedInputValue: string,
    inputfieldLocator: string
  ) {
    $(inputfieldLocator).waitForDisplayed()
    const fieldValue = $(inputfieldLocator).getValue()
    expect(fieldValue).toEqual(
      expectedInputValue,
      'actual input field value ' +
        fieldValue +
        ' not matches with ' +
        expectedInputValue
    )
  }
  /**
   * Method is used to return button color name
   * @param colorElement color computed type name in form of element
   * @param colorRGB pass rgb value from json
   */
  verifyColorRGBValue (colorElement: string, colorRGB: string) {
    browser.waitUntil(
      () =>
        $(colorElement).getCSSProperty('background-color').value === colorRGB,
      {
        timeout: envConfig.timeout.midtimeout,
        timeoutMsg: 'Color is mismatched'
      }
    )
  }
  /**
   * Method is used to wait for element to displayed
   * @param elementToVisible : pass WebdriverIO.Element
   */
  waitForElementTobeVisible (elementToVisible: WebdriverIO.Element) {
    elementToVisible.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Element not Displayed'
    })
  }
}
