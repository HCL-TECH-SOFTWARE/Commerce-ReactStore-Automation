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
import { HomePage } from "./HomePage.po";
import * as envConfig from "../../../../../env.config.json";

//CategoryPage class used to handle the object of CategoryPage
export class CategoryPage {
  categorycontainer = $("//h4//following-sibling::div");
  breadcrumbs = $("nav.MuiTypography-root ol");
  categoryPageHeading = $("//h4");
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}

  /**
   * Used to get child category
   * @param subcategoriesName : Pass sub category name as string
   */
  async getChildCategory(subcategoriesName: string) {
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]";
    await this.categorycontainer.scrollIntoView();
    const categoryCards = await this.categorycontainer.$(categorycard);
    return categoryCards.getText();
  }

  /**
   * Used to handle the child category name
   * @param subcategoriesName : pass sub category name as string
   * @retrun CategoryPage()
   */
  async handleChildCategoryName(subcategoriesName: string) {
    await this.categorycontainer.scrollIntoView();
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]";
    await (await this.categorycontainer.$(categorycard)).click();
    return new CategoryPage();
  }

  /**
   * Used to find click on breadcrumb as per index defined
   * @param index pass bread crumb index number
   */
  async breadCrumb(categoryName: string) {
    const categoryBreadCrumb = "a[data-testid='" + categoryName.toLocaleLowerCase() + "']";
    await $(categoryBreadCrumb).click();
    return new CategoryPage();
  }

  /**
   * Used to get category page heading
   */
  async getCategoryName() {
    console.log("Catgeory name is ------>" + (await this.categoryPageHeading.getText()));
    return this.categoryPageHeading.getText();
  }

  /**
   * Used to verify category name
   * @param expectedCategoryName : pass expected category name
   */
  async verifyCategoryName(expectedCategoryName: string) {
    if (!(await this.getCategoryName()).includes(expectedCategoryName)) {
      await expect(await this.getCategoryName()).toBe(expectedCategoryName);
    }
    return this;
  }

  /**
   * Used to verify page title if category page loaded
   * @param pageTitle : pass page title as string
   * @return this
   */
  async verifyIfCategoryPageLoaded(pageTitle: string) {
    if (!(await browser.getTitle()).match(pageTitle)) {
      await expect(await browser.getTitle()).toBe(pageTitle);
    }
    return this;
  }

  /**
   * Used to verify if child category page loaded
   * @param subcategory : pass sub category as string
   */
  async verifyIfChildCategoryPageLoaded(subcategory: string) {
    await browser.waitUntil(async () => (await browser.getTitle()).includes(subcategory), {
      timeout: this.timeoutValue,
      timeoutMsg: "subcategory page is still not loaded",
    });
  }

  /**
   * Used to verify each child category from product.json
   * @param category pass parentCategory as a json object from sappireproduct.json
   */
  async verifyChildCategories(category: object) {
    const subcategories: string[] = Object.keys(category);
    console.log(subcategories);
    for (const subcategory of subcategories) {
      if (subcategory !== "categoryName" && subcategory !== "breadIndex") {
        const result: string = await this.getChildCategory(subcategory);
        console.log("child category is ----" + result);
        await expect(result).toBe(subcategory);
      }
    }
    return this;
  }

  /**
   * Used to verify category navigation
   * @param category : pass parentCategory as a json object from sappireproduct.json
   */
  async verifyCategoryNavigation(category: object) {
    const maincategories: string[] = Object.keys(category);
    console.log(maincategories);
    for (const maincategory of maincategories) {
      const megaMenu = await new HomePage().headerMenu(maincategory);
      await megaMenu.goToParentCategoryFrom2TierMenu(maincategory);
      await browser.pause(3000);
      const subcategories: string[] = Object.keys(maincategory);
      for (const subcategory of subcategories) {
        if (subcategory !== "categoryName" && subcategory !== "breadIndex") {
          const result: string = await this.getChildCategory(subcategory);
          console.log("child category is ----" + result);
          await expect(result).toBe(subcategory);
          await this.handleChildCategoryName(subcategory);
          await this.breadCrumb(subcategory);
        }
      }
    }
  }
}
