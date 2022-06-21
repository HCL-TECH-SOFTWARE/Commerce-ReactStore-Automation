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
import { HomePage } from "../../pageobjects/pages/b2c/HomePage.po";
import { Utils } from "../../pageobjects/pages/Utils.po";
import dataFile from "../data/b2c/Search.json";
import configFile from "../data/UserManagementData.json";

describe("B2C.Search - User views the search results page in emerald store", () => {
  const storeName = configFile.store;
  let m: string;
  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - Search a product with matching results in emerald store", async () => {
    m = "Search.Test01";
    Utils.log(m, "Search a product with matching results in emerald store");
    const testData = dataFile.test01;
    //Navigate to store-front
    await browser.url(storeName.emerald);
    //Verify storefront loaded
    const homePage = new HomePage();
    //Navigate to search box and input some text
    await homePage.inputSearchText(testData.searchTerm);
    //Click on the first suggested keyword
    const searchpage = await homePage.clickKeywordSuggestion(testData.expectedKeyword);
    //Verify the search keyword url
    await homePage.verifySearchTerm(testData.expectedKeyword);
    //expected product present
    await searchpage.verifyNumberOfProductText(testData.expectedSearchCount);
    const products: string[] = testData.expectedProdNames;
    for (const product of products) {
      await searchpage.verifyProdResultByName(product);
    }
    await (await searchpage.totalFilters(testData.totalFilters)).verifyFilterPane(testData.expectedFilters);
    //apply brand filter to get single product
    const filterByBrandData = testData.filterByBrand;
    await searchpage.selectFilterLabelByIndexAndValue(2, filterByBrandData.brand);
    await searchpage.totalProductCards(filterByBrandData.totalCards);
    await searchpage.clearFilteredBy(filterByBrandData.brand);
    //apply price filter
    const filterByPriceData = testData.filterByPrice;
    await searchpage.setPriceRange(filterByPriceData.maxprice, filterByPriceData.minprice);
    await searchpage.filterByPrice();
    await searchpage.totalProductCards(filterByPriceData.totalCards);
  });
});
