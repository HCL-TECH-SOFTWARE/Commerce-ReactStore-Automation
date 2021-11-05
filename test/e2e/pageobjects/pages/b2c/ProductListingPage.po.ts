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
import { ProductDetailPage } from './ProductDetailPage.po'
import { Utils } from '../Utils.po'
import * as envConfig from '../../../../../env.config.json'
import { RestHelper } from '../../base/RestHelper'

//ProductListingPage class is to handle the object of product listing page
export class ProductListingPage {
  filterPanes = $$('div.MuiAccordionSummary-content.Mui-expanded')
  filterbyHeading = $('li.section-heading')
  productFound = "//h6[contains(text(), 'products found')]"
  productContainer = $('.product-listing-container > div:nth-child(2)')
  productCards = "//div[contains(@class, 'product-card')]"
  //Filter by price
  maxprice = "//input[@placeholder = 'max']"
  minprice = "//input[@placeholder = 'min']"
  pricefilterButton = "//span[contains(text(), 'Filter')]"
  productFilterContainer = 'div.MuiGrid-container:nth-child(3) > div'
  //pagination buttons
  nextPageButton = $("//button[@aria-label = 'Go to next page']")
  //images
  imagesList = "//div[contains(@style,'background-image')]"
  util = new Utils()
  helper = new RestHelper()
  /**
   * method to validate number of filters exist
   * @param total : pass expected count as a number
   * @returns ProductListingPage()
   */
  totalFilters (total: number): ProductListingPage {
    expect(this.filterPanes.length).toEqual(total)
    return this
  }
  /**
   * method to validate total number of product cards
   * @param totalCards : pass expected number
   * @returns ProductListingPage()
   */
  totalProductCards (totalCards: number): ProductListingPage {
    browser.waitUntil(() => $$(this.productCards).length === totalCards, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg:
        'actual number of product cards ' +
        this.productCards.length +
        ' not matches with  ' +
        totalCards
    })
    return this
  }
  /**
   * method to validate total products
   * @param numberOfProduct : pass number of expected product count as string
   * @returns ProductListingPage()
   */
  totalCountText (numberOfProduct: string): ProductListingPage {
    browser.waitUntil(
      () =>
        $(this.productFound)
          .getText()
          .includes(numberOfProduct),
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg:
          'actual number of products ' +
          $(this.productFound).getText() +
          ' not matches with ' +
          numberOfProduct
      }
    )
    return this
  }
  /**
   * method to validate product count on current page
   * @param numberOfProducts : pass expected count as a number
   */
  verifyProductOnEachPage (numberOfProducts: number) {
    this.productContainer.waitForDisplayed()
    const length = $$(this.productCards).length
    expect(length).toEqual(numberOfProducts, 'total product count not matches ')
  }
  /**
   * method to validate total products after applying the filter
   * @param totalProducts : pass total product count as a number
   */
  verifyFilterProductDisplayOnEachPage (totalProducts: number) {
    browser.waitUntil(
      () => $$(this.productFilterContainer).length === totalProducts,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg:
          'expected to be ' +
          totalProducts +
          ' actual is ' +
          $$(this.productFilterContainer).length
      }
    )
  }
  /**
   * method to validate filer pane
   * @param filters : pass all expected filters as an array
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
  }
  /**
   * method to filter by 'Price'
   * @returns ProductListingPage()
   */
  filterByPrice (): ProductListingPage {
    if ($(this.pricefilterButton).isClickable()) {
      $(this.pricefilterButton).click()
    } else {
      console.log('Filter button is not clickable')
    }
    return this
  }
  /**
   * method to navigate next page
   * @returns ProductListingPage()
   */
  nextPage (): ProductListingPage {
    this.nextPageButton.scrollIntoView()
    this.nextPageButton.click()
    return this
  }
  /**
   * method to navigate product detail page
   * @param productname : pass expected product name as a string
   * @returns ProductDetailPage()
   */
  productThumbnail (productname: string): ProductDetailPage {
    const productcard = "//div[@title='" + productname + "']"
    browser.waitUntil(() => $(productcard).isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg:
        'expected to be false' +
        ' actual is ' +
        $(this.pricefilterButton).isClickable()
    })
    $(productcard).scrollIntoView()
    $(productcard).click()
    return new ProductDetailPage()
  }
  /**
   * method to validate filter button is not clickable
   * @returns ProductListingPage()
   */
  verifyFilterButtonNotClickable (): ProductListingPage {
    browser.waitUntil(() => $(this.pricefilterButton).isClickable() === false, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg:
        'expected to be false' +
        ' actual is ' +
        $(this.pricefilterButton).isClickable()
    })
    return this
  }
  /**
   * method to validate filter button is clickable
   * @returns ProductListingPage()
   */
  verifyFilterButtonClickable (): ProductListingPage {
    browser.waitUntil(() => $(this.pricefilterButton).isClickable() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg:
        'expected to be true' +
        ' actual is ' +
        $(this.pricefilterButton).isClickable()
    })
    return this
  }
  /**
   * method to set price range if using filter by 'Price'
   * @param maxprice : pass max price value as a string
   * @param minprice : pass min price value as a string
   * @returns ProductListingPage()
   */
  setPriceRange (maxprice: string, minprice: string) {
    this.util.setValue(maxprice, this.maxprice)
    this.util.setValue(minprice, this.minprice)
    return this
  }
  /**
   * method to clear price range if using filter by 'Price'
   */
  clearPriceRange () {
    this.util.clearValue(this.maxprice)
    this.util.clearValue(this.minprice)
  }
  /**
   * Method is used to verify image loaded properly on PLP
   * @returns ProductListingPage()
   */
  verifyAllImagesIsLoaded () {
    this.helper.verifyImageLoadedBy('style', this.imagesList)
    return this
  }
}
