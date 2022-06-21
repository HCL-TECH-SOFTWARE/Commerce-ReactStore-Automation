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
import envConfig from "../../../../env.config.json";
import { cloneDeep } from "lodash";

//Utils class contains commonly used functions
export class Utils {
  private static readonly R = envConfig.randomStrings;
  private static readonly UNIQUE_CANDIDATES: { [k: string]: string } = envConfig.uniqueingCandidates;

  static log(m: string, ...data: any[]) {
    console.log(`>> ${m}: ${data.join("; ")}`);
  }

  constructor() {}

  /**
   * common method for button click
   * @param buttonName : pass button locator as a string
   * @deprecated use `buttonClickById` instead
   */
  async handleOnClickBtn(buttonName: string, elem: string = "span") {
    const buttonText = $(`//${elem}[text()="${buttonName}"]`);
    await buttonText.waitForClickable();
    await buttonText.click();
  }

  async buttonClick(text: string) {
    await this.handleOnClickBtn(text, "button");
  }

  async linkClick(text: string) {
    await this.handleOnClickBtn(text, "a");
  }

  async buttonClickById(testId: string) {
    const locator = $(`button[data-testid="${testId}"]`);
    await locator.waitForClickable();
    await locator.click();
  }

  /**
   * common method for link click
   * @param linkName : pass link locator as a string
   */
  async handleOnCickLink(linkName: string) {
    const locator = $(linkName);
    await locator.waitForDisplayed();
    await locator.click();
  }

  async linkClickById(testId: string) {
    const locator = $(`a[data-testid="${testId}"]`);
    await locator.waitForClickable();
    await locator.click();
  }

  /**
   * common method for handling alert and verify the message
   * @param expecetedAlertMessage : expected message from data file
   * @param alertMsgLocator : pass locator as a string
   */
  async verifyDialogAlertMsg(expecetedAlertMessage: string, alertMsgLocator: string) {
    const locator = $(alertMsgLocator);
    await browser.waitUntil(async () => (await locator.isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "Alert message is not displayed",
    });
    await expect(await locator.getText()).toContain(expecetedAlertMessage);
  }

  /**
   * common method to set input field value
   * @param inputValue : pass input value as a string
   * @param inputfieldLocator : pass field locator as a string
   */
  async setValue(inputValue: string, inputfieldLocator: string) {
    const locator = $(inputfieldLocator);
    await locator.waitForDisplayed();
    await locator.setValue(inputValue);
    return this;
  }

  /**
   * common method to clear the input
   * @param inputfieldLocator : pass input locator as a string
   */
  async clearValue(inputfieldLocator: string) {
    const locator = $(inputfieldLocator);
    await locator.waitForDisplayed();
    await locator.clearValue();
  }

  /**
   * method to add input details on page
   * @param details : pass details as a json object where key as field name and value as an input field value
   */
  async addDetails(details: object) {
    // the fieldset changes to the radio with the "checked" attribute after DOM loads -- wait a little extra
    await browser.pause(1000);

    for (const [key, value] of Object.entries(details)) {
      await browser.pause(500);
      const selector = $(`//input[@name="${key}"]`);
      await selector.waitForDisplayed();
      await selector.clearValue();
      await selector.setValue(value);
      await browser.pause(1000);
    }
  }

  /**
   * method to edit input details on page
   * @param details : pass details as a json object where key as field name and value as an input field value
   */
  async editDetails(details: object) {
    for (const [key, value] of Object.entries(details)) {
      const selector = $(`//input[@name="${key}"]`);
      await selector.waitForDisplayed();
      const inputValue = await selector.getValue();
      const length = inputValue.length;
      const backSpaces = new Array(length).fill("Backspace");
      await selector.setValue(backSpaces);
      await selector.setValue(value);
      await browser.pause(500);
    }
  }

  /**
   * method to validate added details on page
   * @param details : pass details as a json object where key as field name and value as input field value
   */
  async verifyDetails(details: object) {
    for (const [key, value] of Object.entries(details)) {
      const selector = `//input[@name= "${key}"]`;
      await this.verifyInputFieldValue(value, selector);
    }
  }

  /**
   * common method to verify page title
   * @param expectedtitle : pass expected title as a string
   */
  async verifyPageTitle(expectedtitle: string) {
    await browser.waitUntil(async () => (await browser.getTitle()) === expectedtitle, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected page title is not displayed | Expected Title :" + expectedtitle,
    });
  }

  /**
   * common method to verify button disable
   * @param buttonName : pass locator as a string
   */
  async verifyBtnDisable(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await buttonText.waitForDisplayed();
    await expect(await buttonText.isEnabled()).toBe(false);
  }

  /**
   * common method to verify button enable
   * @param buttonName : pass locator as a string
   */
  async verifyBtnEnable(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await buttonText.waitForDisplayed();
    await expect(await buttonText.isEnabled()).toBe(true);
  }

  /**
   * common method to verify button is clickable
   * @param buttonName : pass locator as a string
   */
  async verifyBtnClickable(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await browser.waitUntil(async () => (await buttonText.isClickable()) === true, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected button is not clickable | Expected button :" + buttonName,
    });
  }

  /**
   * common method to verify button is not clickable
   * @param buttonName : pass locator as a string
   */
  async verifyBtnNotClickable(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await browser.waitUntil(async () => (await buttonText.isClickable()) === false, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected button is clickable | Expected button :" + buttonName,
    });
  }

  async verifyBtnNotClickableById(testId: string) {
    const locator = $(`button[data-testid="${testId}"]`);
    await browser.waitUntil(async () => (await locator.isClickable()) === false, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected button is clickable | Expected button: " + testId,
    });
  }

  /**
   * common method to verify button present
   * @param buttonName : pass locator as a string
   */
  async verifyBtnPresent(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await browser.waitUntil(async () => (await buttonText.isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected button is not prsesent | Expected button :" + buttonName,
    });
  }

  /**
   * common method to verify button not present
   * @param buttonName : pass locator as a string
   */
  async verifyBtnNotPresent(buttonName: string) {
    const buttonText = $("//span[text()=" + "'" + buttonName + "'" + "]");
    await browser.waitUntil(async () => (await buttonText.isDisplayed()) === false, {
      timeout: envConfig.timeout.midtimeout * 1000,
      timeoutMsg: "Expected button is present | Expected button :" + buttonName,
    });
  }

  /**
   * common method to verify text
   * @param expectedText : pass expected text as a string
   * @param elementLocator : pass locator as a string
   * @param textType : this can be email, phone, pageHeading etc used for logging purpose
   */
  async verifyText(expectedText: string, elementLocator: string, textType: string) {
    const locator = $(elementLocator);
    await locator.waitForDisplayed();
    await browser.waitUntil(async () => (await locator.getText()).includes(expectedText), {
      timeout: envConfig.timeout.midtimeout * 2,
      timeoutMsg: `Expected ${textType} does not match with: ${expectedText} actual is: ${await locator.getText()}`,
    });
  }

  /**
   * common method to verify button display
   * @param buttonName : pass locator as a string
   */
  async verifyButtonDisplay(buttonName: string) {
    const buttonText = "//span[text()=" + "'" + buttonName + "'" + "]";
    await browser.waitUntil(async () => (await $(buttonText).isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout * 1000,
      timeoutMsg: "expected button " + buttonName + " is not displayed",
    });
  }

  /**
   * common method to verify button not display
   * @param buttonName : pass locator as a string
   */
  async verifyButtonNotDisplay(buttonName: string) {
    const buttonText = "//span[text()=" + "'" + buttonName + "'" + "]";
    await browser.waitUntil(async () => (await $(buttonText).isDisplayed()) === false, {
      timeout: envConfig.timeout.maxtimeout * 1000,
      timeoutMsg: "expected button " + buttonName + " is still displayed",
    });
  }

  /**
   * common method to verify link display
   * @param linklocator : pass link locator as a string
   * @param linkName : pass link name as string for logging
   */
  async verifyLinkDisplay(linklocator: string) {
    await expect(await $(linklocator).isDisplayed()).toBe(true);
  }

  /**
   * common method to validate field value
   * @param expectedInputValue : pass expected value as a string
   * @param inputfieldLocator : pass locator as a string
   */
  async verifyInputFieldValue(expectedInputValue: string, inputfieldLocator: string) {
    const locator = $(inputfieldLocator);
    await locator.waitForDisplayed();
    const fieldValue = await locator.getValue();
    await expect(fieldValue).toEqual(expectedInputValue);
  }

  /**
   * Method is used to return button color name
   * @param colorElement color computed type name in form of element
   * @param colorRGB pass rgb value from json
   */
  async verifyColorRGBValue(colorElement: string, colorRGB: string) {
    await browser.waitUntil(async () => (await $(colorElement).getCSSProperty("background-color")).value === colorRGB, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Color is mismatched",
    });
  }

  /**
   * Method is used to wait for element to displayed
   * @param elementToVisible : pass WebdriverIO.Element
   */
  async waitForElementTobeVisible(elementToVisible: WebdriverIO.Element) {
    await elementToVisible.waitForDisplayed({
      timeout: 15000,
      timeoutMsg: "Element not Displayed",
    });
  }

  /**
   * method to verify order item table
   * @param sku: sku as a json object from emeraldproduct.json
   * @param quantity: expected quantity as a number
   * @return total-price
   */
  async verifyReviewOrderItemTable(sku: object, quantity: number, priceKey = "priceOffering") {
    let skuName = "";
    let skuPrice = "";

    for (const [key, value] of Object.entries(sku)) {
      if (key === "sku") {
        skuName = value;
      }
      if (key === priceKey) {
        skuPrice = `${value}`.replace(/^\$/, "");
      }
    }
    await browser.pause(envConfig.timeout.lowtimeout);
    const rc = quantity * parseFloat(skuPrice.replace(/[^\d.]*/g, ""));

    const skuLoc = `//table//p[text()[contains(.,"${skuName}")]]`;
    const stock = `${skuLoc}/ancestor::td//following-sibling::td[last()-2]`;
    const quant = `${skuLoc}/ancestor::td//following-sibling::td[last()-1]//p`;
    const price = `${skuLoc}/ancestor::td//following-sibling::td[last()]//p`;

    await expect(await $(skuLoc).getText()).toBe(`SKU: ${skuName}`);
    await expect(await $(stock).getText()).toBe("In stock online");
    await expect(await $(quant).getText()).toBe(quantity.toString());
    await expect(await $(price).getText()).toContain("$" + rc);

    return rc;
  }

  static getUniquePrefix() {
    const n = Utils.R.length;
    const chosen = [Math.random(), Math.random()].map((v) => Utils.R[Math.floor(n * v)]);
    chosen[1] = chosen[1].replace(/(\w)/, (m, s0) => s0.toUpperCase());
    const rc = `${chosen[0]}${chosen[1]}${new Date().getSeconds().toString()}`;
    return rc;
  }

  static uniqueify(input: string) {
    const pfx = Utils.getUniquePrefix();
    const rc = `${pfx}_${input}`;
    return rc;
  }

  static uniqueifyObj(obj: any, ...extraKeys: string[]) {
    const rc = cloneDeep(obj);
    const pfx = Utils.getUniquePrefix();
    const keyChecker = cloneDeep(Utils.UNIQUE_CANDIDATES);
    extraKeys.forEach((k) => (keyChecker[k] = k));

    const full: any[] = [rc];
    for (let i = 0; i < full.length; ++i) {
      const val = full[i];

      // if object is an array, add its elements to be processed
      if (Array.isArray(val)) {
        full.push(...val);
      } else {
        Object.entries(val).forEach(([k, v]) => {
          if (keyChecker[k]) {
            val[k] = `${pfx}_${val[k]}`;
          } else if (Array.isArray(v)) {
            full.push(...v);
          } else if (typeof v === "object") {
            full.push(v);
          }
        });
      }
    }

    return rc;
  }

  static async setInputValue(loc: string, value: any) {
    await $(loc).scrollIntoView({ block: "center" });
    await browser.waitUntil(async () => await $(loc).isEnabled(), {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "child category is not displayed in menu",
    });

    await $(loc).setValue(value);
    await browser.pause(500); // give widget time to update
  }

  static async closeMiniCart() {
    const loc = `//div[@id="HEADER_MINI_CART_Popper"]`;
    const popped = await $(loc).isDisplayed();
    if (popped) {
      const mcLoc = `//button[@data-testid="button-header-mini-cart-button"]`;
      await $(mcLoc).waitForClickable();
      await $(mcLoc).click();
    }
  }

  static getFmtDateStr(date: Date, daysDiff: number = 0) {
    let dt = date;
    if (daysDiff !== 0) {
      dt = new Date(date.getTime());
      dt.setDate(date.getDate() + daysDiff);
    }
    const year = dt.getFullYear();
    const month = 1 + dt.getMonth();
    const day = dt.getDate();

    // this should work with 4 but for some reason the MUI widget accepts upto 6 digits for year
    const y = `${year}`.padStart(6, "0");
    const m = `${month}`.padStart(2, "0");
    const d = `${day}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}
