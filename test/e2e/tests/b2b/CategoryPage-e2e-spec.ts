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
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { BreadCrumb } from '../../pageobjects/pages/BreadCrumb.po'
import { CategoryPage } from '../../pageobjects/pages/b2b/CategoryPage.po'
import CATALOG = require('../data/b2b/SapphireProducts.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - User Navigates to Category Page', () => {
  const storeName = configFile.store
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01- navigate from parent category to child category', () => {
    console.log('test01- navigate from parent category to child category')
    let category = CATALOG.Categories.Fasteners
    let subcategory = category.Bolts
    console.log(
      'subcategories from ' + category.categoryName + ' :' + subcategory
    )
    //Launch emerald storefront
    browser.url(storeName.sappire)
    //Open hamburger menu
    const homePage = new HomePage()
    const megaMenu = homePage.headerMenu(category.categoryName)
    //Navigate to parent category
    megaMenu.goToParentCategoryFrom2TierMenu(category.categoryName)
    const categorypage = new CategoryPage()
    //Verify category page loaded and the correct subcategories displayed
    categorypage.verifyChildCategories(category)
    //click on child category from category page
    categorypage.handleChildCategoryName(subcategory.subCategoryName)
    //verify breadcrumb count display
    let breadcrumb: BreadCrumb = new BreadCrumb()
    breadcrumb.countBreadCrumbsDisplay(subcategory.breadIndex)
    //verify 1st breadcrumb contains category
    //breadcrumb.verifyBreadCrumb(0, category.categoryName)
    //verify 2nd breadcrumb contains subcategory
    breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName)
  })

  it('test02- to Navigate to subcategory page and use breadcrumb to go back', () => {
    console.log(
      'test02- to Navigate to subcategory page and use breadcrumb to go back'
    )
    let category = CATALOG.Categories.Fasteners
    let subcategory = category.Nuts
    console.log('categories from ' + category.categoryName + ' :' + subcategory)
    //Launch emerald store-front
    browser.url(storeName.sappire)
    /** Create a common funtion to navite to all the main category and their sub category */
    //Open hamburger menu
    const homePage = new HomePage()
    const megaMenu = homePage.headerMenu(category.categoryName)
    //go to category page
    megaMenu.goToParentCategoryFrom2TierMenu(category.categoryName)
    let categorypage = new CategoryPage()
    //Verify category page loaded and the correct subcategories are displayed
    categorypage.verifyChildCategories(category)
    //click on the subcategory
    categorypage = categorypage.handleChildCategoryName(
      subcategory.subCategoryName
    )
    //verify breadcrumb contains category
    let breadcrumb: BreadCrumb = new BreadCrumb()
    breadcrumb.countBreadCrumbsDisplay(subcategory.breadIndex)
    //verify 1st breadcrumb contains category
    //breadcrumb.verifyBreadCrumb(0, category.categoryName)
    //verify 2nd breadcrumb contains subcategory
    breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName)
    //click on category crumb
    categorypage = categorypage.breadCrumb(0)
    //verify the caegory name display
    categorypage.verifyCategoryName(category.categoryName)
  })
})
