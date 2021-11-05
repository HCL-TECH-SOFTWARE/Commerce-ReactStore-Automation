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
import dataFile = require('../data/b2c/Search.json')
import configFile = require('../data/UserManagementData.json')

describe('B2C- User views the search results page in emerald store', () => {
  const storeName = configFile.store
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01 - Search a product with matching results in emerald store', () => {
    console.log(
      'Test01 - Search a product with matching results in emerald store'
    )
    const testData = dataFile.test01
    //Navigate to store-front
    browser.url(storeName.emerald)
    //Verify storefront loaded
    const homePage = new HomePage()
    //Navigate to search box and input some text
    homePage.inputSearchText(testData.searchTerm)
    //Click on the first suggested keyword
    const searchpage = homePage.clickKeywordSuggestion(testData.expectedKeyword)
    //Verify the search keyword url
    homePage.verifySearchTerm(testData.expectedKeyword)
    //expected product present
    searchpage.verifyNumberOfProductText(testData.expectedSearchCount)
    const products: string[] = testData.expectedProdNames
    products.forEach(product => {
      searchpage.verifyProdResultByName(product)
    })
  })
})
