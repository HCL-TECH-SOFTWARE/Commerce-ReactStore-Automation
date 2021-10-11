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
import { SearchResultPage } from '../../pageobjects/pages/b2b/SearchResultPage.po'
import dataFile = require('../data/b2b/Search.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - User views the search results page', () => {
  const storeName = configFile.store
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01 - To search for a product with matching results', () => {
    console.log('Test01 - To search for a product with matching results')
    const testData = dataFile.test01
    //Navigate to store-front
    browser.url(storeName.sappire)
    //Verify storefront loaded
    const homePage = new HomePage()
    //Navigate to search box and input some text
    homePage.inputSearchText(testData.searchTerm)
    //Click on the first suggested keyword
    const searchpage: SearchResultPage = homePage.clickSearchKeyword(
      testData.expectedKeyword
    )
    //Verify search term in page url
    searchpage.verifySearchTermUrl(testData.urlSearchTerm)
    //expected product present
    searchpage.verifyNumberOfProductText(testData.expectedSearchCount)
    const products: string[] = testData.expectedProdNames
    products.forEach(product => {
      searchpage.verifyProductByName(product)
    })
  })
})
