/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 1996, 2020
 *
 *--------------------------------------------------
 */
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { ProductListingPage } from '../../pageobjects/pages/b2b/ProductListingPage.po'
import CATALOG = require('../data/b2b/SapphireProducts.json')
import dataFile = require('../data/b2b/ProductListingPage.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - User views ProductListing', () => {
  const storeName = configFile.store
  let homepage: HomePage
  let plp: ProductListingPage
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01- to filter by price in sapphire store', () => {
    console.log('Test01- to filter by price in sapphire store')
    const testdata = dataFile.test01
    let category = CATALOG.Categories.Fasteners
    let subcategory = category.Bolts
    //Launch sapphire storefront
    browser.url(storeName.sappire)
    //Open hamburger menu
    const homePage = new HomePage()
    const megaMenu = homePage.headerMenu(category.categoryName)
    //Navigate to PLP
    megaMenu.goToProductListingPage(subcategory.subCategoryName)
    //verify 'Filter by' heading and total filters
    plp = new ProductListingPage()
    plp
      .verifyFilterHeading(testdata.FilterByHeading)
      .totalFilters(testdata.totalfilters)
    //verify all filter headings
    plp.verifyFilterPane(testdata.expectedFilters)
    //Verify default product count, number of cards
    plp
      .totalCountText(testdata.totalProducts)
      .totalProductCards(testdata.totalCards)
    const filterByPriceData = testdata.FilterByPrice
    //enter invalid price range min price > max price
    //check the button not clickable
    plp.setPriceRange(
      filterByPriceData.invalidmaxprice,
      filterByPriceData.invalidminprice
    )
    plp.verifyFilterButtonNotClickable()
    //enter invalid price range min price < max price
    //check the button is clickable
    plp
      .clearPriceRange()
      .setPriceRange(filterByPriceData.maxprice, filterByPriceData.minprice)
    plp.verifyFilterButtonClickable()
    //Click on filter button & Verify filter by price result
    plp.filterByPrice().totalCountText(filterByPriceData.totalProducts)
  })
})
