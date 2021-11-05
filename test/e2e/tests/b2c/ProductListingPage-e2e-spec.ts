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
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import { ProductListingPage } from '../../pageobjects/pages/b2c/ProductListingPage.po'
import configFile = require('../data/UserManagementData.json')
var CATALOG = require('../data/b2c/EmeraldProducts.json')
var dataFile = require('../data/b2c/ProductListingPage.json')

describe('B2C- User views ProductListing in emerald store', () => {
  let homepage: HomePage
  let plp: ProductListingPage
  const storeName = configFile.store
  let testData
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('test01- To filter by price in emerald store', () => {
    console.log('Test01- To filter by price in emerald store')
    testData = dataFile.test01
    const category = CATALOG.LivingRoom
    const subcategory = category.Furniture
    //Launch emerald store-front
    browser.maximizeWindow()
    browser.url(storeName.emerald)
    //Open hamburger menu
    homepage = new HomePage()
    const megaMenu = homepage.headerMenu(category.categoryName)
    //go to a product listing page
    megaMenu.goToProductListingPage(subcategory.subCategoryName)
    //Verify total number of products
    console.log('default product count is ' + testData.totalProducts)
    plp = new ProductListingPage()
    plp
      .totalCountText(testData.totalProducts)
      .totalProductCards(testData.totalCards)
    //check the number of products displayed in the listing page
    plp.verifyProductOnEachPage(testData.maxproducts)
    //verify total number of filters and filter pane heading
    plp
      .totalFilters(testData.totalFilters)
      .verifyFilterPane(testData.expectedFilters)
    //verify thumbnail images
    plp.verifyAllImagesIsLoaded()
    //enter invalid price range min price > max price
    //check the button disabled
    var filterByPriceData = testData.filterByPrice
    plp.setPriceRange(
      filterByPriceData.invalidmaxprice,
      filterByPriceData.invalidminprice
    )
    plp.verifyFilterButtonNotClickable()
    //enter valid price range
    //click
    plp.clearPriceRange()
    plp.setPriceRange(filterByPriceData.maxprice, filterByPriceData.minprice)
    plp.verifyFilterButtonClickable().filterByPrice()
    //Check expected products count
    //Check max product appear
    plp.totalCountText(filterByPriceData.totalproducts)
    plp.verifyFilterProductDisplayOnEachPage(filterByPriceData.firstpage)
    //goto next page
    //Verify number of product displayed
    plp
      .nextPage()
      .verifyFilterProductDisplayOnEachPage(filterByPriceData.secondpage)
    //goto next page
    //Verify number of product displayed
    plp
      .nextPage()
      .verifyFilterProductDisplayOnEachPage(filterByPriceData.lastpage)
  })
})
