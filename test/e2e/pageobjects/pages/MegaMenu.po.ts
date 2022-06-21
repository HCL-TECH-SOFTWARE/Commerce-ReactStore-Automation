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
import * as envConfig from "../../../../env.config.json";

//Mega Menu class is used to handle the object of Mega Menu
export class MegaMenu {
  parentcategoryLink = "a > p.expanded-menu-bold";
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}
  /**
   * Used to go to product listing page using child category
   * @param childCategory : pass child category name as string
   */
  async goToProductListingPage(childCategory: string) {
    const categorySelector: string = "//p[contains(text(), '" + childCategory + "')]";
    const locator = $(categorySelector);
    await browser.waitUntil(async () => (await locator.getText()) === childCategory, {
      timeout: this.timeoutValue,
      timeoutMsg: "child category is not displayed in menu",
    });
    await locator.click();
    await browser.pause(envConfig.timeout.midtimeout);
  }
  /**
   * Used to go to parent category from mega menu
   * @param parentcategory : pass parent category as string
   */
  async goToParentCategoryFrom2TierMenu(parentcategory: string) {
    const locator = $(this.parentcategoryLink);
    await browser.waitUntil(
      async () => (await locator.isDisplayed()) === true && (await locator.getText()) === parentcategory,
      {
        timeout: this.timeoutValue,
        timeoutMsg: "parent category is not displayed in menu",
      }
    );
    await locator.click();
  }
  /**
   * Used to go to child category from mega menu
   * @param parentcategory : pass child category name as string
   */
  async goToParentCategoryFrom3TierMenu(parentcategory: string) {
    const categorySelector: string = "//p[contains(text(), '" + parentcategory + "')]";
    const locator = $(categorySelector);
    await browser.waitUntil(async () => (await locator.getText()) === parentcategory, {
      timeout: this.timeoutValue,
      timeoutMsg: "child category is not displayed in menu",
    });
    await locator.click();
  }
}
