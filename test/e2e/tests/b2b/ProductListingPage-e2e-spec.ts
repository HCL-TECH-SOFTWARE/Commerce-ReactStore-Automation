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
