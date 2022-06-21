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
import { HomePage } from "../../pageobjects/pages/b2c/HomePage.po";
import { BreadCrumb } from "../../pageobjects/pages/BreadCrumb.po";
import { CategoryPage } from "../../pageobjects/pages/b2c/CategoryPage.po";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";
const CATALOG = require("../data/b2c/EmeraldProducts.json");
const TestData = require("../data/b2c/CategoryPage.json");

describe("B2C.CategoryPage - User Navigates to Category Page in emerald store", () => {
  const storeName = configFile.store;
  let m: string;
  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - Navigate from parent category to child category in emerald store", async () => {
    m = "CategoryPage.Test01";
    Utils.log(m, "Navigate from parent category to child category in emerald store");
    const testdata = TestData.test01;
    const category = CATALOG.Bath;
    const subcategory = category.Lighting;
    const subcategories: string[] = Object.keys(category);
    subcategories.shift(); //remove categoryName
    Utils.log(m, "Expected subcategories from " + category.categoryName + " :" + subcategories);
    //Launch emerald storefront
    await browser.url(storeName.emerald);
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
    await breadcrumb.countBreadCrumbsDisplay(testdata.totalBreadCrumbs);
    //verify 1st breadcrumb contains category
    await breadcrumb.verifyBreadCrumb(0, category.categoryName);
    //verify 2nd breadcrumb contains subcategory
    await breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName);
  });
});
