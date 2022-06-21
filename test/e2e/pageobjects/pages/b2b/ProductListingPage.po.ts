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
import { Utils } from "../Utils.po";
import { ProductDetailPage } from "./ProductDetailPage.po";
import * as envConfig from "../../../../../env.config.json";
import { RestHelper } from "../../base/RestHelper";

// Product Listing Page Page class is used to handle the object of Product Listing Page
export class ProductListingPage {
  filterHeading = $("li.section-heading");
  filterPanes = "div.MuiAccordionSummary-content.Mui-expanded";
  filterPane = "//div[contains(@class ,'MuiAccordion-root')][INDEX]";
  productCards = "//div[contains(@class, 'product-card')]";
  maxPrice = "//input[@placeholder = 'max']";
  minPrice = "//input[@placeholder = 'min']";
  filterPriceBtn = "button.price-go";
  productsCount = $("//h6[contains(text(), 'products found')]");
  filteredBy = "//div[contains(@class,'bottom-margin-3 MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center')]";
  clearAll = $("//a[contains(text(),'Clear All')]");

  // no result msg
  noResultMsg = ".product-listing-container > div:last-child > div";
  // relevance dropdown
  relevanceDropdown = "select.MuiSelect-select";
  // images
  productImages = "//div[contains(@style,'background-image')]";
  util = new Utils();
  helper = new RestHelper();
  timeoutValue: number = envConfig.timeout.maxtimeout;
  constructor() {}

  /**
   * Used to select product
   * @param productName pass product name as string
   * @return this
   */
  async productSelect(productName: string): Promise<ProductDetailPage> {
    await browser.pause(envConfig.timeout.midtimeout);
    const productcard = "//div[@title='" + productName + "']";
    await $(productcard).waitForDisplayed();
    await $(productcard).scrollIntoView();
    await $(productcard).click();
    const rc = await ProductDetailPage.get();
    return rc;
  }

  /**
   * Used to verify filter heading
   * @param expectedHeading : pass expected filter heading as string
   * @return this
   */
  async verifyFilterHeading(expectedHeading: string) {
    await this.filterHeading.waitForDisplayed();
    await expect(await this.filterHeading.getText()).toEqual(expectedHeading);
    return this;
  }

  /**
   * Used to verify filter pabe by index
   * @param index : pass index
   * @param name :pass expected filter name
   */
  async clickFilterPaneByIndex(index: number, name: string) {
    const list = await $$(this.filterPanes);
    const pane = list[index];
    await pane?.waitForDisplayed();
    const filtername = await pane?.getText();

    console.log("Filter name at index " + index + " is " + filtername);

    await expect(filtername).toEqual(name);
    await pane?.click();
  }

  /**
   * Used to validate total number of filter available
   * @param expectedFilters pass expected filter number
   * @return this
   */
  async totalFilters(expectedFilters: number) {
    await expect(await $$(this.filterPanes).length).toBe(expectedFilters);
    return this;
  }

  /**
   * Used to verify filter pane heading
   * @param filters : pass filter as string arrays
   * @return this
   */
  async verifyFilterPane(filters: string[]) {
    const m = "ProductListingPage.verifyFilterPane";
    const n = filters.length;
    const list = await $$(this.filterPanes);

    for (let i = 0; i < n; ++i) {
      const text = await list[i]?.getText();
      Utils.log(m, `Filter pane heading is: ${text}`);
      await expect(text).toMatch(filters[i]);
    }

    return this;
  }

  /**
   * Used to filter product by price range
   * @param maxprice : pass maximum price
   * @param minprice : pass minimum price
   * @return this
   */
  async setPriceRange(maxprice: string, minprice: string) {
    await this.util.setValue(maxprice, this.maxPrice);
    await this.util.setValue(minprice, this.minPrice);
    return this;
  }

  /**
   * Used to clear the price range
   * @return this
   */
  async clearPriceRange() {
    await this.util.clearValue(this.maxPrice);
    await this.util.clearValue(this.minPrice);
    return this;
  }

  /**
   * Used to verify price filter button displayed
   * @return this
   */
  async priceFilterDisabled() {
    await $(this.filterPriceBtn).waitForDisplayed();
    await this.util.verifyBtnDisable("Filter");
    return this;
  }

  /**
   * Used to verify price filter button enabled
   * @return this
   */
  async priceFilterEnabled() {
    await $(this.filterPriceBtn).waitForDisplayed();
    await this.util.verifyBtnEnable("Filter");
    return this;
  }

  /**
   * Used to verify filter button not clickable
   */
  async verifyFilterButtonNotClickable() {
    await browser.waitUntil(async () => (await $(this.filterPriceBtn).isClickable()) === false, {
      timeout: this.timeoutValue,
      timeoutMsg: "expected to be false" + " actual is " + (await $(this.filterPriceBtn).isClickable()),
    });
  }

  /**
   * Used to verify filter button clickable
   */
  async verifyFilterButtonClickable() {
    await browser.waitUntil(async () => (await $(this.filterPriceBtn).isClickable()) === true, {
      timeout: this.timeoutValue,
      timeoutMsg: "expected to be true" + " actual is " + (await $(this.filterPriceBtn).isClickable()),
    });
    return this;
  }

  /**
   * Used to filter the product by price
   * @return this
   */
  async filterByPrice() {
    await this.util.handleOnClickBtn("Filter");
    return this;
  }

  /**
   * Used to validate total number of product
   * @param numberOfProduct : pass number of product
   * @return this
   */
  async totalCountText(numberOfProduct: string) {
    await browser.waitUntil(async () => (await this.productsCount.getText()).includes(numberOfProduct), {
      timeout: this.timeoutValue,
      timeoutMsg:
        "actual number of products " + (await this.productsCount.getText()) + " not matches with " + numberOfProduct,
    });
    return this;
  }

  /**
   * Used to verify total product cards
   * @param totalCards : pass total cards as number
   */
  async totalProductCards(totalCards: number) {
    await browser.waitUntil(async () => (await $$(this.productCards)).length === totalCards, {
      timeout: this.timeoutValue,
      timeoutMsg: "actual number of product cards " + this.productCards.length + " not matches with " + totalCards,
    });
  }

  /**
   * Filter pane by index and value by text
   * @param index
   * @param filterValue
   */
  async selectFilterLabelByIndexAndValue(index: any, filterValue: string): Promise<ProductListingPage> {
    const newFilterPane = this.filterPane.replace(/INDEX/, index);
    const newFilterPaneSelector = newFilterPane + "//span[contains(text(),'" + filterValue + "')]";
    await $(newFilterPaneSelector).click();
    await browser.pause(1000);
    return this;
  }

  /**
   * method to validate filtered by present
   * @param filterValue pass filter value as a string
   * @returns ProductListingPage()
   */
  async verifyFilteredByPresent(filterValue: string): Promise<ProductListingPage> {
    await browser.waitUntil(async () => (await $(this.filteredBy).isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "filtered by is not present at top",
    });
    const newSelector = this.filteredBy + "//span[contains(text(),'" + filterValue + "')]";
    await expect(await $(newSelector).isDisplayed()).toBe(true);
    return this;
  }

  /**
   * method to clear specific filter
   * @param filterValue pass filter value as a string
   * @returns ProductListingPage()
   */
  async clearFilteredBy(filterValue: string): Promise<ProductListingPage> {
    await $(this.filteredBy).waitForDisplayed();
    const newSelector = this.filteredBy + "//span[contains(text(),'" + filterValue + "')]";
    await $(newSelector).click();
    return this;
  }

  /**
   * method to clear all applied filter
   * @returns ProductListingPage()
   */
  async clearAllFilteredBy(): Promise<ProductListingPage> {
    await this.clearAll.waitForDisplayed();
    await this.clearAll.click();
    return this;
  }

  /**
   * method to validate filtered by not present
   * @returns ProductListingPage()
   */
  async verifyFilteredByNotPresent(): Promise<ProductListingPage> {
    await browser.waitUntil(async () => (await $(this.filteredBy).isDisplayed()) === false, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "filtered by is not present at top",
    });
    return this;
  }

  /**
   * method to clear all applied filter
   * @returns ProductListingPage()
   */
  async verifyNoResultMessage(expectedMsg: string): Promise<ProductListingPage> {
    await browser.waitUntil(async () => (await $(this.noResultMsg).getText()).includes(expectedMsg), {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "No search result messsage is not displayed",
    });
    return this;
  }

  /**
   * Used to verify product display on PLP
   * @param category pass category as a JSON object containing products
   * @returns ProductListingPage()
   */
  async verifyProductByNameOnPLP(category: object) {
    let productSelector;
    for (const [key] of Object.entries(category)) {
      if (key !== "categoryName" && key !== "breadIndex" && key !== "subCategoryName") {
        productSelector = this.productCards + "//div[@title ='" + key + "']";
        await expect(await $(productSelector).isDisplayed()).toBe(true);
      }
    }
    return this;
  }

  /**
   * used to select sort by option in listing page
   * @param option pass option as a string text
   * @returns ProductListingPage()
   */
  async selectSortOptionByText(option: string) {
    await $(this.relevanceDropdown).waitForDisplayed();
    await $(this.relevanceDropdown).selectByVisibleText(option);
    await browser.pause(envConfig.timeout.midtimeout);
    return this;
  }

  /**
   * Used to verify product sequence display
   * @param products pass expected product sequence in a string array
   * @returns ProductListingPage()
   */
  async verifyAllDisplayedProductSequence(products: string[]) {
    let index = 0;
    const codemod_placeholder_2215 = await $$(this.productCards);

    for (const product of codemod_placeholder_2215) {
      await expect(await product.getText()).toContain(products[index]);
      index++;
    }
    return this;
  }

  /**
   * verify sort by price low to high
   * @param products pass expected product sequence in a string array
   * @returns ProductListingPage()
   */
  async verifySortByPriceLowToHigh(products: string[]) {
    let index = 0;
    let productPriceSelector, nextproductPriceSelector, price1, price2;
    while (index < products.length - 1) {
      productPriceSelector = "//div[@title = '" + products[index] + "']//following-sibling::p[2]";
      nextproductPriceSelector = "//div[@title = '" + products[index + 1] + "']//following-sibling::p[2]";
      if (
        (await $(productPriceSelector).isDisplayed()) === true &&
        (await $(nextproductPriceSelector).isDisplayed()) === true
      ) {
        price1 = (await $(productPriceSelector).getText()).split("$")[1];
        price2 = (await $(nextproductPriceSelector).getText()).split("$")[1];
        if (parseInt(price1) > parseInt(price2)) {
          throw new Error("Product is not sorted by price low to high " + "price 1 " + price1 + "price2 " + price2);
        }
      } else {
        throw new Error("Product price is not displayed in the listing page for the product");
      }
      index++;
    }
    return this;
  }

  /**
   * verify sort by price high to low
   * @param products pass expected product sequence in a string array
   * @returns ProductListingPage()
   */
  async verifySortByPriceHighToLow(products: string[]) {
    let index = 0;
    let productPriceSelector, nextproductPriceSelector, price1, price2;
    while (index < products.length - 1) {
      productPriceSelector = "//div[@title = '" + products[index] + "']//following-sibling::p[2]";
      nextproductPriceSelector = "//div[@title = '" + products[index + 1] + "']//following-sibling::p[2]";
      if (
        (await $(productPriceSelector).isDisplayed()) === true &&
        (await $(nextproductPriceSelector).isDisplayed()) === true
      ) {
        price1 = (await $(productPriceSelector).getText()).split("$")[1];
        price2 = (await $(nextproductPriceSelector).getText()).split("$")[1];
        if (parseInt(price1) < parseInt(price2)) {
          throw new Error("Product is not sorted by price high to low " + "price 1 " + price1 + "price2 " + price2);
        }
      } else {
        throw new Error("Product price is not displayed in the listing page for the product");
      }
      index++;
    }
    return this;
  }

  /**
   * Method is used to verify image loaded properly on PLP
   * @returns ProductListingPage()
   */
  async verifyAllImagesIsLoaded() {
    await browser.pause(envConfig.timeout.midtimeout);
    await this.helper.verifyImageLoadedByStyle(this.productImages);
    return this;
  }
}
