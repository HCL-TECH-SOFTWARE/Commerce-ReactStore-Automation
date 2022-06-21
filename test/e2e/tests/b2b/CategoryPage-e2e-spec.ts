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
import { HomePage } from "../../pageobjects/pages/b2b/HomePage.po";
import { BreadCrumb } from "../../pageobjects/pages/BreadCrumb.po";
import { CategoryPage } from "../../pageobjects/pages/b2b/CategoryPage.po";
import CATALOG from "../data/b2b/SapphireProducts.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.CategoryPage - User Navigates to Category Page", () => {
  const storeName = configFile.store;
  let m: string;

  afterEach(async function () {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - navigate from parent category to child category", async () => {
    m = "CategoryPage.Test01";
    Utils.log(m, "navigate from parent category to child category");
    const category = CATALOG.Categories.Fasteners;
    const subcategory = category.Bolts;
    Utils.log(m, "subcategories from " + category.categoryName + " :" + subcategory);
    //Launch emerald storefront
    await browser.url(storeName.sapphire);
    //Open hamburger menu
    const homePage = new HomePage();
    const megaMenu = await homePage.headerMenu(category.categoryName);
    //Navigate to parent category
    await megaMenu.goToParentCategoryFrom2TierMenu(category.categoryName);
    const categorypage = new CategoryPage();
    //Verify category page loaded and the correct subcategories displayed
    await categorypage.verifyChildCategories(category);
    //click on child category from category page
    await categorypage.handleChildCategoryName(subcategory.subCategoryName);
    //verify breadcrumb count display
    const breadcrumb: BreadCrumb = new BreadCrumb();
    await breadcrumb.countBreadCrumbsDisplay(subcategory.breadIndex);
    //verify 1st breadcrumb contains category
    await breadcrumb.verifyBreadCrumb(0, category.categoryName);
    //verify 2nd breadcrumb contains subcategory
    await breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName);
  });

  it("Test02 - to Navigate to subcategory page and use breadcrumb to go back", async () => {
    m = "CategoryPage.Test02";
    Utils.log(m, "to Navigate to subcategory page and use breadcrumb to go back");
    const category = CATALOG.Categories.Fasteners;
    const subcategory = category.Nuts;
    Utils.log(m, "categories from " + category.categoryName + " :" + subcategory);
    //Launch emerald store-front
    await browser.url(storeName.sapphire);
    let categorypage = new CategoryPage();
    /** Create a common funtion to navite to all the main category and their sub category */
    //Open hamburger menu
    const homePage = new HomePage();
    const megaMenu = await homePage.headerMenu(category.categoryName);
    //go to category page
    await megaMenu.goToParentCategoryFrom2TierMenu(category.categoryName);
    categorypage = new CategoryPage();
    //Verify category page loaded and the correct subcategories are displayed
    await categorypage.verifyChildCategories(category);
    //click on the subcategory
    categorypage = await categorypage.handleChildCategoryName(subcategory.subCategoryName);
    //verify breadcrumb contains category
    const breadcrumb: BreadCrumb = new BreadCrumb();
    await breadcrumb.countBreadCrumbsDisplay(subcategory.breadIndex);
    //verify 1st breadcrumb contains category
    await breadcrumb.verifyBreadCrumb(0, category.categoryName);
    //verify 2nd breadcrumb contains subcategory
    await breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName);
    //click on category crumb
    categorypage = await categorypage.breadCrumb(category.categoryName);
    //verify the caegory name display
    await categorypage.verifyCategoryName(category.categoryName);
  });
});
