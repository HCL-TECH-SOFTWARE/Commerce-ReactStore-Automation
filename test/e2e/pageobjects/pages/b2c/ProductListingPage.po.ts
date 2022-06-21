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
import { ProductDetailPage } from "./ProductDetailPage.po";
import { Utils } from "../Utils.po";
import * as envConfig from "../../../../../env.config.json";
import { RestHelper } from "../../base/RestHelper";

//ProductListingPage class is to handle the object of product listing page
export class ProductListingPage {
  filterPanes = $$("div.MuiAccordionSummary-content.Mui-expanded");
  filterPane = "//div[contains(@class ,'MuiAccordion-root')][INDEX]";
  filterbyHeading = $("li.section-heading");
  filterArea = "div.product-filter";
  filterLabel = "//div[contains(@class ,'MuiAccordion-root')][INDEX]//label";
  filteredBy = "//p[text() = 'Filtered by:']";
  productFound = "//h6[contains(text(), 'products found')]";
  productContainer = $(".product-listing-container > div:nth-child(2)");
  productCards = "//div[contains(@class, 'product-card')]";
  clearAll = $("//a[contains(text(),'Clear All')]");
  //Filter by price
  maxprice = "//input[@placeholder = 'max']";
  minprice = "//input[@placeholder = 'min']";
  pricefilterButton = "//span[contains(text(), 'Filter')]";
  productFilterContainer = "div.MuiGrid-container:nth-child(3) > div";
  //Filter by Color
  swatch = "//div[@role ='region']//button[contains(@style, 'swatches')][INDEX]";
  selectedSwatch = "div > button.selected:nth-child(INDEX)";
  totalSwatches = $$("//div[@role ='region']//button[contains(@style, 'swatches')]");
  //pagination buttons
  nextPageButton = $("//button[@aria-label = 'Go to next page']");
  prevPageButton = $("//button[@aria-label = 'Go to previous page']");
  //no result msg
  noResultMsg = ".product-listing-container > div:nth-child(2) > div";
  //relevance dropdown
  relevanceDropdown = "select.MuiSelect-select";
  //images
  imagesList = "//div[contains(@style,'background-image')]";
  util = new Utils();
  helper = new RestHelper();
  constructor() {}
  /**
   * method to validate 'Filter By' heading exist
   * @param expectedHeading : pass expected heading as a string
   */
  async verifyFilterHeading(expectedHeading: string) {
    await this.filterbyHeading.waitForDisplayed();
    await expect(await this.filterbyHeading.getText()).toEqual(expectedHeading);
  }
  /**
   * method to validate number of filters exist
   * @param total : pass expected count as a number
   * @returns ProductListingPage()
   */
  async totalFilters(total: number) {
    await expect(await this.filterPanes.length).toEqual(total);
    return this;
  }
  /**
   * method to validate total number of product cards
   * @param totalCards : pass expected number
   * @returns ProductListingPage()
   */
  async totalProductCards(totalCards: number) {
    await browser.waitUntil(async () => (await $$(this.productCards)).length === totalCards, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "actual number of product cards " + this.productCards.length + " not matches with  " + totalCards,
    });
    return this;
  }
  /**
   * method to validate filter at given index
   * @param index : pass expected index as number
   * @param filtername : pass expected filter name as a string
   */
  async verifyFilterAtIndex(index: number, filtername: string) {
    const _fp = await this.filterPanes;
    const filter = await _fp[index].getText();
    await expect(filter).toEqual(filtername);
  }
  /**
   * method to validate total products
   * @param numberOfProduct : pass number of expected product count as string
   * @returns ProductListingPage()
   */
  async totalCountText(numberOfProduct: string) {
    await browser.waitUntil(async () => (await $(this.productFound).getText()).includes(numberOfProduct), {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg:
        "actual number of products " + (await $(this.productFound).getText()) + " not matches with " + numberOfProduct,
    });
    return this;
  }
  /**
   * method to validate product count on current page
   * @param numberOfProducts : pass expected count as a number
   */
  async verifyProductOnEachPage(numberOfProducts: number) {
    await this.productContainer.waitForDisplayed();
    const length = (await $$(this.productCards)).length;
    await expect(length).toEqual(numberOfProducts);
  }
  /**
   * method to validate total products after applying the filter
   * @param totalProducts : pass total product count as a number
   */
  async verifyFilterProductDisplayOnEachPage(totalProducts: number) {
    await browser.waitUntil(async () => (await $$(this.productFilterContainer)).length === totalProducts, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "expected to be " + totalProducts + " actual is " + (await $$(this.productFilterContainer)).length,
    });
  }
  /**
   * method to validate filer pane
   * @param filters : pass all expected filters as an array
   */
  async verifyFilterPane(filters: string[]) {
    let index: number = 0;
    const _fp = await this.filterPanes;
    for (const filter of filters) {
      console.log("Filter pane heading is " + (await _fp[index].getText()));
      await expect(await _fp[index].getText()).toMatch(filter);
      index++;
    }
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
   * method to navigate next page
   * @returns ProductListingPage()
   */
  async nextPage() {
    await this.nextPageButton.scrollIntoView({ block: "center" });
    await this.nextPageButton.click();
    return this;
  }
  /**
   * method to navigate previous page
   * @returns ProductListingPage()
   */
  async prevPage() {
    await this.prevPageButton.scrollIntoView({ block: "center" });
    await this.prevPageButton.click();
    return this;
  }
  /**
   * method to navigate given page number
   * @param pageNum : pass page number as a number
   */
  async gotoPage(pageNum: number) {
    const pageNumSelector = $("//button[text() = '" + pageNum + "']");
    if (await pageNumSelector.isDisplayed()) {
      await pageNumSelector.click();
    } else {
      throw new Error("page number not exist");
    }
  }
  /**
   * method to navigate product detail page
   * @param productname : pass expected product name as a string
   * @returns ProductDetailPage()
   */
  async productThumbnail(productname: string) {
    const productcard = "//div[@title='" + productname + "']";
    await browser.waitUntil(async () => (await $(productcard).isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "expected to be true" + " actual is " + (await $(productcard).isDisplayed()),
    });
    await $(productcard).scrollIntoView({ block: "center" });
    await $(productcard).click();
    return new ProductDetailPage();
  }
  /**
   * method to validate filter button is not clickable
   * @returns ProductListingPage()
   */
  async verifyFilterButtonNotClickable() {
    await browser.waitUntil(async () => (await $(this.pricefilterButton).isClickable()) === false, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "expected to be false" + " actual is " + (await $(this.pricefilterButton).isClickable()),
    });
    return this;
  }
  /**
   * method to validate filter button is clickable
   * @returns ProductListingPage()
   */
  async verifyFilterButtonClickable() {
    await browser.waitUntil(async () => (await $(this.pricefilterButton).isClickable()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "expected to be true" + " actual is " + (await $(this.pricefilterButton).isClickable()),
    });
    return this;
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
   * method to clear price range if using filter by 'Price'
   */
  async clearPriceRange() {
    await this.util.clearValue(this.maxprice);
    await this.util.clearValue(this.minprice);
  }
  /**
   * method to clear price range if using filter by 'Price'
   */
  async clearSelectedPriceRange(maxprice: string, minprice: string) {
    const priceSelector =
      "//div[@role='button']/span[text()= '$" + minprice.concat(".00") + " - $" + maxprice.concat(".00") + "']";
    await expect(await $(priceSelector).isDisplayed()).toBe(true);
    await $(priceSelector).click();
  }
  /**
   * Filter pane by index and value by text
   * @param index
   * @param filterValue
   */
  async selectFilterLabelByIndexAndValue(index: number, filterValue: string) {
    const newFilterPane = this.filterPane.replace(/INDEX/, index.toString());
    const newFilterPaneSelector = newFilterPane + "//span[contains(text(),'" + filterValue + "')]";
    await $(newFilterPaneSelector).click();
    await browser.pause(envConfig.timeout.lowtimeout);
    return this;
  }
  /**
   * method to validate filtered by present
   * @returns ProductListingPage()
   */
  async verifyFilteredByPresent(brand: string) {
    await browser.waitUntil(async () => (await $(this.filteredBy).isDisplayed()) === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "filtered by is not present at top",
    });
    const newSelector = this.filteredBy + "//following-sibling::div/span[contains(text(),'" + brand + "')]";
    await expect(await $(newSelector).isDisplayed()).toBe(true);
    return this;
  }
  /**
   * method to validate filtered by not present
   * @returns ProductListingPage()
   */
  async verifyFilteredByNotPresent() {
    await browser.waitUntil(async () => (await $(this.filteredBy).isDisplayed()) === false, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "filtered by is not present at top",
    });
    return this;
  }
  /**
   * method to clear specific filter
   * @param filterValue pass filter value as a string
   * @returns ProductListingPage()
   */
  async clearFilteredBy(filterValue: string) {
    await $(this.filteredBy).waitForDisplayed();
    const newSelector = this.filteredBy + "/following-sibling::div/span[contains(text(),'" + filterValue + "')]";
    await $(newSelector).click();
    return this;
  }
  /**
   * method to clear all applied filter
   * @returns ProductListingPage()
   */
  async clearAllFilteredBy() {
    await this.clearAll.waitForDisplayed();
    await this.clearAll.click();
    return this;
  }
  /**
   * method to verify number of swatches present
   * @returns ProductListingPage()
   */
  async verifySwatchCount(expectedNumberOfSwatches: number) {
    await expect(await this.totalSwatches.length).toBe(expectedNumberOfSwatches);
    return this;
  }
  /**
   * method to select swatch
   * @param index pass index as the number
   * @returns ProductListingPage()
   */
  async selectSwatchByIndex(index: number) {
    const swatchLocator = this.swatch.replace(/INDEX/, index.toString());
    await $(swatchLocator).click();
    return this;
  }
  /**
   * method to select swatch
   * @param index pass index as the number
   * @returns ProductListingPage()
   */
  async delectSwatchByIndex(index: number) {
    const swatchLocator = this.swatch.replace(/INDEX/, index.toString());
    await $(swatchLocator).click();
    return this;
  }
  /**
   * method swatch is selected at given index
   * @param index pass index as the number
   * @returns ProductListingPage()
   */
  async verifySwatchSelect(index: number) {
    const swatchLocator = this.selectedSwatch.replace(/INDEX/, index.toString());
    await browser.waitUntil(async () => (await $(swatchLocator).isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "swatch is not selected at given index " + index,
    });
    return this;
  }
  /**
   * method swatch is selected at given index
   * @param index pass index as the number
   * @returns ProductListingPage()
   */
  async verifySwatchDeSelect(index: number) {
    const swatchLocator = this.selectedSwatch.replace(/INDEX/, index.toString());
    await browser.waitUntil(async () => (await $(swatchLocator).isDisplayed()) === false, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "swatch is selected at given index " + index,
    });
    return this;
  }
  /**
   * method to clear all applied filter
   * @returns ProductListingPage()
   */
  async verifyNoResultMessage(expectedMsg: string) {
    await browser.waitUntil(async () => (await $(this.noResultMsg).getText()).includes(expectedMsg), {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: "No search result messsage is not displayed",
    });
    return this;
  }
  /**
   * method to verify show more display at given index
   * @returns ProductListingPage()
   */
  async showMoreDisplayedByIndex(index: number) {
    const showMoreSelector = this.filterPane.replace(/INDEX/, index.toString()) + "//a[text() = 'Show More']";
    await browser.waitUntil(async () => (await $(showMoreSelector).isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Show More is not displayed at given index : " + index,
    });
    return this;
  }
  /**
   * method to click on show more
   * @returns ProductListingPage()
   */
  async clickShowMoreByIndex(index: number) {
    const showMoreSelector = this.filterPane.replace(/INDEX/, index.toString()) + "//a[text() = 'Show More']";
    await $(showMoreSelector).click();
    return this;
  }
  /**
   * method to verify show more display at given index
   * @returns ProductListingPage()
   */
  async showLessDisplayedByIndex(index: number) {
    const showMoreSelector = this.filterPane.replace(/INDEX/, index.toString()) + "//a[text() = 'Show Less']";
    await browser.waitUntil(async () => (await $(showMoreSelector).isDisplayed()) === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: "Show Less is not displayed at given index : " + index,
    });
    return this;
  }
  /**
   * method to click on show more
   * @returns ProductListingPage()
   */
  async clickShowLessByIndex(index: number) {
    const showLessSelector = this.filterPane.replace(/INDEX/, index.toString()) + "//a[text() = 'Show Less']";
    await $(showLessSelector).click();
    await browser.pause(3000);
    return this;
  }
  /**
   * method to verify filter label by index
   * @returns ProductListingPage()
   */
  async countFiltersByIndex(index: number, count: number) {
    const filterLabelSelector = this.filterLabel.replace(/INDEX/, index.toString());
    await browser.waitUntil(async () => (await $$(filterLabelSelector)).length === count, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg:
        "number of filter labels not matches at given index: " +
        index +
        " expected : " +
        count +
        " actual :" +
        (
          await $$(filterLabelSelector)
        ).length,
    });
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
   * Used to verify product display on PLP
   * @param category pass category as a JSON object containing products
   * @returns ProductListingPage()
   */
  async verifyProductByNameOnPLP(category: object) {
    let productSelector;
    await browser.pause(envConfig.timeout.lowtimeout);
    for (const [key] of Object.entries(category)) {
      if (key !== "categoryName" && key !== "breadIndex" && key !== "subCategoryName") {
        productSelector = this.productCards + "//div[@title ='" + key + "']";
        await expect(await $(productSelector).isDisplayed()).toBe(true);
      }
    }
    return this;
  }
  /**
   * Used to verify product sequence display
   * @param products pass expected product sequence in a string array
   * @returns ProductListingPage()
   */
  async verifyAllDisplayedProductSequence(products: string[]) {
    let index = 0;
    const codemod_placeholder_7791 = await $$(this.productCards);

    for (const product of codemod_placeholder_7791) {
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
    let productSelector, nextproductSelector, price1, price2;
    while (index < products.length - 1) {
      productSelector = "//div[@title = '" + products[index] + "']//following-sibling::p[3]";
      nextproductSelector = "//div[@title = '" + products[index + 1] + "']//following-sibling::p[3]";
      if ((await $(productSelector).isDisplayed()) === true && (await $(nextproductSelector).isDisplayed()) === true) {
        price1 = (await $(productSelector).getText()).split("$")[1];
        price2 = (await $(nextproductSelector).getText()).split("$")[1];
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
    let productSelector, nextproductSelector, price1, price2;
    while (index < products.length - 1) {
      productSelector = "//div[@title = '" + products[index] + "']//following-sibling::p[3]";
      nextproductSelector = "//div[@title = '" + products[index + 1] + "']//following-sibling::p[3]";
      if ((await $(productSelector).isDisplayed()) === true && (await $(nextproductSelector).isDisplayed()) === true) {
        price1 = (await $(productSelector).getText()).split("$")[1];
        price2 = (await $(nextproductSelector).getText()).split("$")[1];
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
    await this.helper.verifyImageLoadedByStyle(this.imagesList);
    return this;
  }
}
