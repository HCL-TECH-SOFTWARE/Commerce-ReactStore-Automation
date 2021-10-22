/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 2020, 2021
•	
*-----------------------------------------------------------------
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
