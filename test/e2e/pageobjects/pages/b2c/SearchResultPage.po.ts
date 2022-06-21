/*
# Copyright 2022 HCL America, Inc.
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
*/
import * as envConfig from "../../../../../env.config.json";
import { Utils } from "../Utils.po";

//SearchResultPage class is to handle the object of search result page
export class SearchResultPage {
  prodNumberOfResult = $("h6.MuiTypography-subtitle2");
  noSearchResult = "//div[contains(@id, '_search-results')]";
  //Filter by price
  maxprice = "//input[@placeholder = 'max']";
  minprice = "//input[@placeholder = 'min']";
  pricefilterButton = "//span[contains(text(), 'Filter')]";
  filterPanes = "div.MuiAccordionSummary-content.Mui-expanded";
  filterPane = "//div[contains(@class ,'MuiAccordion-root')][INDEX]";
  filteredBy = "//p[text() = 'Filtered by:']";
  productCards = "//div[contains(@class, 'product-card')]";

  util = new Utils();
  constructor() {}
  /**
   * method to validate search term on url
   * @param searchTerm : pass expected search term as a string
   */
  async verifySearchTermUrl(searchTerm: string) {
    await browser.pause(envConfig.timeout.midtimeout);
    await expect(await browser.getUrl()).toContain(searchTerm);
  }
  /**
   * method to validate number of products as a search result
   * @param NoOfProducts : pass expected count as a string
   * @returns SearchResultPage()
   */
  async verifyNumberOfProductText(NoOfProducts: string) {
    await this.prodNumberOfResult.waitForDisplayed();
    await expect(await this.prodNumberOfResult.getText()).toContain(NoOfProducts);
    return this;
  }
  /**
   * method to validate product exist on page
   * @param productName : pass expected product name as a string
   */
  async verifyProdResultByName(productName: string) {
    const selector = "//div[contains(@class, 'product-card')]//p[text()='" + productName + "']";
    await expect(await $(selector).isDisplayed()).toBe(true);
  }
  /**
   * method to validate search match found
   * @param expectedMatchCountMsg  pass expected match msg as a string
   */
  async verifyNumberOfMatchesFoundMsg(expectedMatchCountMsg: string) {
    const matchSelector = this.noSearchResult + "//h4";
    await $(matchSelector).waitForDisplayed();
    await expect(await $(matchSelector).getText()).toBe(expectedMatchCountMsg);
  }
  /**
   * method to validate no search results message
   * @param expectedSearchResultMsg pass expected no search resualt message
   */
  async verifyNoResultMsg(expectedSearchResultMsg: string) {
    const msgSelector = this.noSearchResult + "//p";
    await $(msgSelector).waitForDisplayed();
    await expect(await $(msgSelector).getText()).toBe(expectedSearchResultMsg);
  }
  /**
   * method to set price range if using filter by 'Price'
   * @param maxprice : pass max price value as a string
   * @param minprice : pass min price value as a string
   * @returns ProductListingPage()
   */
  async setPriceRange(maxprice: string, minprice: string) {
    await this.util.setValue(maxprice, this.maxprice);
    await this.util.setValue(minprice, this.minprice);
    return this;
  }
  /**
   * method to filter by 'Price'
   * @returns ProductListingPage()
   */
  async filterByPrice() {
    if (await $(this.pricefilterButton).isClickable()) {
      await $(this.pricefilterButton).click();
    } else {
      console.log("Filter button is not clickable");
    }
    return this;
  }
  /**
   * method to validate number of filters exist
   * @param total : pass expected count as a number
   * @returns SearchResultPage()
   */
  async totalFilters(total: number) {
    await expect((await $$(this.filterPanes)).length).toEqual(total);
    return this;
  }
  /**
   * method to validate filer pane
   * @param filters : pass all expected filters as an array
   */
  async verifyFilterPane(filters: string[]) {
    let index: number = 0;
    for (const filter of filters) {
      console.log("Filter pane heading is " + (await (await $$(this.filterPanes))[index].getText()));
      await expect(await (await $$(this.filterPanes))[index].getText()).toMatch(filter);
      index++;
    }
  }
  /**
   * Filter pane by index and value by text
   * @param index
   * @param filterValue
   * @returns SearchResultPage()
   */
  async selectFilterLabelByIndexAndValue(index: number, filterValue: string) {
    const newFilterPane = this.filterPane.replace(/INDEX/, index.toString());
    const newFilterPaneSelector = newFilterPane + "//span[contains(text(),'" + filterValue + "')]";
    await $(newFilterPaneSelector).click();
    await browser.pause(envConfig.timeout.lowtimeout);
    return this;
  }
  /**
   * method to clear specific filter
   * @param filterValue pass filter value as a string
   * @returns SearchResultPage()
   */
  async clearFilteredBy(filterValue: string) {
    await $(this.filteredBy).waitForDisplayed();
    const newSelector = this.filteredBy + "/following-sibling::div/span[contains(text(),'" + filterValue + "')]";
    await $(newSelector).click();
    return this;
  }
  /**
   * method to validate total number of product cards
   * @param totalCards : pass expected number
   * @returns SearchResultPage()
   */
  async totalProductCards(totalCards: number) {
    await browser.waitUntil(async () => (await $$(this.productCards)).length === totalCards, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "actual number of product cards " + this.productCards.length + " not matches with  " + totalCards,
    });
    return this;
  }
}
