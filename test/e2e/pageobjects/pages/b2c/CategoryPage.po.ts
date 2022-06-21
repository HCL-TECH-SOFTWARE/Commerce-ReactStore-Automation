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
import * as envConfig from "../../../../../env.config.json";

//CategoryPage class is to handle the object of category page
export class CategoryPage {
  categorycontainer = $("//h4//following-sibling::div");
  breadcrumbs = $("nav.MuiTypography-root ol");
  categoryPageHeading = $("//div[contains(@class, 'heroImage')]//h2");
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}
  /**
   * method to get child category at given index
   * @param subcategoriesName : pass sub category name as a string
   * @returns child category name as a string
   */
  async getChildCategory(subcategoriesName: string) {
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]";
    await this.categorycontainer.scrollIntoView();
    const categoryCards = await this.categorycontainer.$(categorycard);
    return categoryCards.getText();
  }
  /**
   * method to navigate child category at given location
   * @param index : pass index as a number to locate
   * @returns CategoryPage()
   */
  async handleChildCategoryName(subcategoriesName: string) {
    await this.categorycontainer.scrollIntoView();
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]";
    await (await this.categorycontainer.$(categorycard)).click();
    return new CategoryPage();
  }
  /**
   * method to click on breadcrumb as per index defined
   * @param index : pass index as a number
   * @returns CategoryPage()
   */
  async breadCrumb(index: number) {
    await (await this.breadcrumbs.$$("li.MuiBreadcrumbs-li"))[index].click();
    return new CategoryPage();
  }
  /**
   * method to get category page heading
   * @returns category page heading as a string
   */
  async getCategoryName() {
    await browser.waitUntil(async () => (await this.categoryPageHeading.isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "Category page heading is not displayed",
    });
    console.log("Catgeory name is ------>" + (await this.categoryPageHeading.getText()));
    return this.categoryPageHeading.getText();
  }
  /**
   * method to validate category name
   * @param expectedCategoryName : pass expected category name as a string
   * @returns CategoryPage()
   */
  async verifyCategoryName(expectedCategoryName: string) {
    if (!(await this.getCategoryName()).match(expectedCategoryName)) {
      await expect(await this.getCategoryName()).toBe(expectedCategoryName);
    }
    return this;
  }
  /**
   * method to validate category page loaded
   * @param pageTitle : pass expected page title as a string
   * @returns CategoryPage()
   */
  async verifyIfCategoryPageLoaded(pageTitle: string) {
    if (!(await browser.getTitle()).match(pageTitle)) {
      await expect(await browser.getTitle()).toBe(pageTitle);
    }
    return this;
  }
  /**
   * method to validate child category page loaded
   * @param subcategory : pass subcategory name as a string
   */
  async verifyIfChildCategoryPageLoaded(subcategory: string) {
    await browser.waitUntil(async () => (await browser.getTitle()).includes(subcategory), {
      timeout: this.timeoutValue,
      timeoutMsg: "subcategory page is still not loaded",
    });
  }
  /**
   * method to verify each child category from product.json
   * @param category pass parentCategory as a json object from emeraldproduct.json
   * @returns CategoryPage()
   */
  async verifyChildCategories(category: object) {
    const subcategories: string[] = Object.keys(category);
    subcategories.shift(); //remove categoryName
    for (const subcategory of subcategories) {
      const result: string = await this.getChildCategory(subcategory);
      console.log("child category is ----" + result);
      await expect(result).toBe(subcategory);
    }
    return this;
  }
}
