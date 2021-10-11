/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 1996, 2020
•	
*-----------------------------------------------------------------
*/
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import { BreadCrumb } from '../../pageobjects/pages/BreadCrumb.po'
import { CategoryPage } from '../../pageobjects/pages/b2c/CategoryPage.po'
import configFile = require('../data/UserManagementData.json')
var CATALOG = require('../data/b2c/EmeraldProducts.json')
var TestData = require('../data/b2c/CategoryPage.json')

describe('B2C- User Navigates to Category Page in emerald store', () => {
  const storeName = configFile.store
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01- Navigate from parent category to child category in emerald store', () => {
    console.log(
      'Test01- Navigate from parent category to child category in emerald store'
    )
    const testdata = TestData.test01
    const category = CATALOG.Bath
    const subcategory = category.Lighting
    const subcategories: string[] = Object.keys(category)
    subcategories.shift() //remove categoryName
    console.log(
      'Expected subcategories from ' +
        category.categoryName +
        ' :' +
        subcategories
    )
    //Launch emerald storefront
    browser.url(storeName.emerald)
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
    breadcrumb.countBreadCrumbsDisplay(testdata.totalBreadCrumbs)
    //verify 1st breadcrumb contains category
    breadcrumb.verifyBreadCrumb(0, category.categoryName)
    //verify 2nd breadcrumb contains subcategory
    breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName)
  })
  it('Test02- Navigate to subcategory page and use breadcrumb to go back in emerald store', () => {
    console.log(
      'Test02- Navigate to subcategory page and use breadcrumb to go back in emerald store'
    )
    const testdata = TestData.test02
    const category = CATALOG.Bath
    const subcategory = category.Accessories
    const subcategories: string[] = Object.keys(category)
    subcategories.shift() //remove categoryName
    console.log(
      'Expected categories from ' + category.categoryName + ' :' + subcategories
    )
    //Launch emerald store-front
    browser.url(storeName.emerald)
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
    breadcrumb.countBreadCrumbsDisplay(testdata.totalBreadCrumbs)
    //verify 1st breadcrumb contains category
    breadcrumb.verifyBreadCrumb(0, category.categoryName)
    //verify 2nd breadcrumb contains subcategory
    breadcrumb.verifyBreadCrumb(1, subcategory.subCategoryName)
    //click on category crumb
    categorypage = categorypage.breadCrumb(0)
    //verify the category name display
    categorypage.verifyCategoryName(category.categoryName)
  })
})
