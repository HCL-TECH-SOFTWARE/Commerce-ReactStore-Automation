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
import * as envConfig from '../../../../env.config.json'

//Mega Menu class is used to handle the object of Mega Menu
export class MegaMenu {
  parentcategoryLink = 'a > p.expanded-menu-bold'
  timeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to go to product listing page using child category
   * @param childCategory : pass child category name as string
   */
  goToProductListingPage (childCategory: string) {
    const categorySelector: string =
      "//p[contains(text(), '" + childCategory + "')]"
    browser.waitUntil(() => $(categorySelector).getText() === childCategory, {
      timeout: this.timeoutValue,
      timeoutMsg: 'child category is not displayed in menu'
    })
    $(categorySelector).click()
    browser.pause(envConfig.timeout.midtimeout)
  }
  /**
   * Used to go to parent category from mega menu
   * @param parentcategory : pass parent category as string
   */
  goToParentCategoryFrom2TierMenu (parentcategory: string) {
    browser.waitUntil(
      () =>
        $(this.parentcategoryLink).isDisplayed() === true &&
        $(this.parentcategoryLink).getText() === parentcategory,
      {
        timeout: this.timeoutValue,
        timeoutMsg: 'parent category is not displayed in menu'
      }
    )
    $(this.parentcategoryLink).click()
  }
  /**
   * Used to go to child category from mega menu
   * @param parentcategory : pass child category name as string
   */
  goTOParentCategoryFrom3TierMenu (parentcategory: string) {
    const categorySelector: string =
      "//p[contains(text(), '" + parentcategory + "')]"
    browser.waitUntil(() => $(categorySelector).getText() === parentcategory, {
      timeout: this.timeoutValue,
      timeoutMsg: 'child category is not displayed in menu'
    })
    $(categorySelector).click()
  }
}
