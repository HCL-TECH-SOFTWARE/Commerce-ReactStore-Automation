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
import { Utils } from '../Utils.po'
import { ProductDetailPage } from './ProductDetailPage.po'
import * as envConfig from '../../../../../env.config.json'
import { RestHelper } from '../../base/RestHelper'

//Product Listing Page Page class is used to handle the object of Product Listing Page
export class ProductListingPage {
  productCount = $$(
    "//div[@class='product-listing-container productListingWidget top-margin-3']/div[@class='MuiGrid-root sc-ezrdKe gdrbsr MuiGrid-container MuiGrid-spacing-xs-2']/div"
  )
  numberOfProductFound = $(
    "//div[@class='MuiGrid-root sc-ezrdKe gdrbsr bottom-margin-1 MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between']/div"
  )
  filterHeading = $('li.section-heading')
  filterPanes = $$('div.MuiAccordionSummary-content.Mui-expanded')
  filterPane = "//div[contains(@class ,'MuiAccordion-root')][INDEX]"
  productCards = "//div[contains(@class, 'product-card')]"
  maxPrice = "//input[@placeholder = 'max']"
  minPrice = "//input[@placeholder = 'min']"
  filterPriceBtn = 'button.price-go'
  productsCount = $("//h6[contains(text(), 'products found')]")
  util = new Utils()
  helper = new RestHelper()
  timeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to verify number of child product
   * @param expectedNumber : pass expected number
   */
  verifyNumberOfChildProduct (expectedNumber: number) {
    browser.waitUntil(
      () =>
        this.numberOfProductFound.getText().includes(expectedNumber.toString()),
      {
        timeout: this.timeoutValue,
        timeoutMsg:
          'actual number of products ' +
          this.numberOfProductFound.getText() +
          'not matches with ' +
          expectedNumber
      }
    )
    const count = this.productCount.length
    expect(count).toBe(expectedNumber, 'Total product count not matches')
  }
  /**
   * Used to select product
   * @param productName pass product name as string
   * @return this
   */
  productSelect (productName: string): ProductDetailPage {
    const productcard = "//div[@title='" + productName + "']"
    browser.waitUntil(() => $(productcard).isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: +productName + ' is not displayed'
    })
    $(productcard).waitForDisplayed()
    $(productcard).scrollIntoView()
    $(productcard).click()
    return new ProductDetailPage()
  }
  /**
   * Used to verify filter heading
   * @param expectedHeading : pass expected filter heading as string
   * @return this
   */
  verifyFilterHeading (expectedHeading: string) {
    this.filterHeading.waitForDisplayed()
    expect(this.filterHeading.getText()).toEqual(expectedHeading)
    return this
  }
  /**
   * Used to verify filter pabe by index
   * @param index : pass index
   * @param name :pass expected filter name
   */
  clickFilterPaneByIndex (index: number, name: string) {
    this.filterPanes[index].waitForDisplayed()
    const filtername = this.filterPanes[index].getText()
    console.log('Filter name at index ' + index + ' is ' + filtername)
    expect(filtername).toEqual(name, 'filter name not matches')
    this.filterPanes[index].click()
  }
  /**
   * Used to validate total number of filter available
   * @param expectedFilters pass expected filter number
   * @return this
   */
  totalFilters (expectedFilters: number) {
    expect(this.filterPanes.length).toBe(
      expectedFilters,
      'total number of filters not matches'
    )
    return this
  }
  /**
   * Used to verify filter pane heading
   * @param filters : pass filter as string arrays
   * @return this
   */
  verifyFilterPane (filters: string[]) {
    let index: number = 0
    filters.forEach(filter => {
      console.log('Filter pane heading is ' + this.filterPanes[index].getText())
      expect(this.filterPanes[index].getText()).toMatch(
        filter,
        'filter pane heading not matches'
      )
      index++
    })
    return this
  }
  /**
   * Used to filter product by price range
   * @param maxprice : pass maximum price
   * @param minprice : pass minimum price
   * @return this
   */
  setPriceRange (maxprice: string, minprice: string) {
    this.util.setValue(maxprice, this.maxPrice)
    this.util.setValue(minprice, this.minPrice)
    return this
  }
  /**
   * Used to clear the price range
   * @return this
   */
  clearPriceRange () {
    this.util.clearValue(this.maxPrice)
    this.util.clearValue(this.minPrice)
    return this
  }
  /**
   * Used to verify price filter button displayed
   * @return this
   */
  priceFilterDisabled () {
    $(this.filterPriceBtn).waitForDisplayed()
    this.util.verifyBtnDisable('Filter')
    return this
  }
  /**
   * Used to verify price filter button enabled
   * @return this
   */
  priceFilterEnabled () {
    $(this.filterPriceBtn).waitForDisplayed()
    this.util.verifyBtnEnable('Filter')
    return this
  }
  /**
   * Used to verify filter button not clickable
   */
  verifyFilterButtonNotClickable () {
    browser.waitUntil(() => $(this.filterPriceBtn).isClickable() === false, {
      timeout: this.timeoutValue,
      timeoutMsg:
        'expected to be false' +
        ' actual is ' +
        $(this.filterPriceBtn).isClickable()
    })
  }
  /**
   * Used to verify filter button clickable
   */
  verifyFilterButtonClickable () {
    browser.waitUntil(() => $(this.filterPriceBtn).isClickable() === true, {
      timeout: this.timeoutValue,
      timeoutMsg:
        'expected to be true' +
        ' actual is ' +
        $(this.filterPriceBtn).isClickable()
    })
    return this
  }
  /**
   * Used to filter the product by price
   * @return this
   */
  filterByPrice () {
    this.util.handleOnClickBtn('Filter')
    return this
  }
  /**
   * Used to validate total number of product
   * @param numberOfProduct : pass number of product
   * @return this
   */
  totalCountText (numberOfProduct: string) {
    browser.waitUntil(
      () => this.productsCount.getText().includes(numberOfProduct),
      {
        timeout: this.timeoutValue,
        timeoutMsg:
          'actual number of products ' +
          this.productsCount.getText() +
          ' not matches with ' +
          numberOfProduct
      }
    )
    return this
  }
  /**
   * Used to verify total product cards
   * @param totalCards : pass total cards as number
   */
  totalProductCards (totalCards: number) {
    browser.waitUntil(() => $$(this.productCards).length === totalCards, {
      timeout: this.timeoutValue,
      timeoutMsg:
        'actual number of product cards ' +
        this.productCards.length +
        ' not matches with ' +
        totalCards
    })
  }
}
