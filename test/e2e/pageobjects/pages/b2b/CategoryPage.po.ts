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
import { HomePage } from './HomePage.po'
import * as envConfig from '../../../../../env.config.json'

//CategoryPage class used to handle the object of CategoryPage
export class CategoryPage {
  categorycontainer = $('//h4//following-sibling::div')
  breadcrumbs = $('nav.MuiTypography-root ol')
  categoryPageHeading = $('//h4')
  timeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to get child category
   * @param subcategoriesName : Pass sub category name as string
   */
  getChildCategory (subcategoriesName: string) {
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]"
    this.categorycontainer.scrollIntoView()
    const categoryCards = this.categorycontainer.$(categorycard)
    return categoryCards.getText()
  }
  /**
   * Used to handle the child category name
   * @param subcategoriesName : pass sub category name as string
   * @retrun CategoryPage()
   */
  handleChildCategoryName (subcategoriesName: string): CategoryPage {
    this.categorycontainer.scrollIntoView()
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]"
    this.categorycontainer.$(categorycard).click()
    return new CategoryPage()
  }
  /**
   * Used to find click on breadcrumb as per index defined
   * @param index pass bread crumb index number
   */
  breadCrumb (index: number): CategoryPage {
    this.breadcrumbs.$$('li.MuiBreadcrumbs-li')[index].click()
    return new CategoryPage()
  }
  /**
   * Used to get category page heading
   */
  getCategoryName (): string {
    console.log('Catgeory name is ------>' + this.categoryPageHeading.getText())
    return this.categoryPageHeading.getText()
  }
  /**
   * Used to verify category name
   * @param expectedCategoryName : pass expected category name
   */
  verifyCategoryName (expectedCategoryName: string) {
    if (!this.getCategoryName().includes(expectedCategoryName)) {
      expect(this.getCategoryName()).toBe(
        expectedCategoryName,
        'User is not on expected category page'
      )
    }
    return this
  }
  /**
   * Used to verify page title if category page loaded
   * @param pageTitle : pass page title as string
   * @return this
   */
  verifyIfCategoryPageLoaded (pageTitle: string) {
    if (!browser.getTitle().match(pageTitle)) {
      expect(browser.getTitle()).toBe(
        pageTitle,
        'Category page is still not loaded'
      )
    }
    return this
  }
  /**
   * Used to verify if child category page loaded
   * @param subcategory : pass sub category as string
   */
  verifyIfChildCategoryPageLoaded (subcategory: string) {
    browser.waitUntil(() => browser.getTitle().includes(subcategory), {
      timeout: this.timeoutValue,
      timeoutMsg: 'subcategory page is still not loaded'
    })
  }
  /**
   * Used to verify each child category from product.json
   * @param category pass parentCategory as a json object from sappireproduct.json
   */
  verifyChildCategories (category: object) {
    let subcategories: string[] = Object.keys(category)
    console.log(subcategories)
    subcategories.forEach(subcategory => {
      if (subcategory !== 'categoryName' && subcategory !== 'breadIndex') {
        const result: string = this.getChildCategory(subcategory)
        console.log('child category is ----' + result)
        expect(result).toBe(subcategory, 'child category not matches')
      }
    })
    return this
  }
  /**
   * Used to verify category navigation
   * @param category : pass parentCategory as a json object from sappireproduct.json
   */
  verifyCategoryNavigation (category: object) {
    let maincategories: string[] = Object.keys(category)
    console.log(maincategories)
    maincategories.forEach(maincategory => {
      const megaMenu = new HomePage().headerMenu(maincategory)
      megaMenu.goToParentCategoryFrom2TierMenu(maincategory)
      browser.pause(envConfig.timeout.lowtimeout)
      let subcategories: string[] = Object.keys(maincategory)
      subcategories.forEach(subcategory => {
        if (subcategory !== 'categoryName' && subcategory !== 'breadIndex') {
          const result: string = this.getChildCategory(subcategory)
          console.log('child category is ----' + result)
          expect(result).toBe(subcategory, 'child category not matches')
          this.handleChildCategoryName(subcategory)
          this.breadCrumb(1)
        }
      })
    })
  }
}
