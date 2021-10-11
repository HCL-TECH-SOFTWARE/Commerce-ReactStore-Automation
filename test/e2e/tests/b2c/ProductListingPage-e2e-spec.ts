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
