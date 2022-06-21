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
import { HomePage } from "../../pageobjects/pages/b2b/HomePage.po";
import { SearchResultPage } from "../../pageobjects/pages/b2b/SearchResultPage.po";
import { Utils } from "../../pageobjects/pages/Utils.po";
import dataFile from "../data/b2b/Search.json";
import configFile from "../data/UserManagementData.json";

describe("B2B.Search - User views the search results page", () => {
  const storeName = configFile.store;
  let m: string;

  afterEach(async function () {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });
  it("Test01 - To search for a product with matching results", async () => {
    m = "Search.Test01";
    Utils.log(m, "To search for a product with matching results");
    const testData = dataFile.test01;
    //Navigate to store-front
    await browser.url(storeName.sapphire);
    //Verify storefront loaded
    const homePage = new HomePage();
    //Navigate to search box and input some text
    await homePage.inputSearchText(testData.searchTerm);
    //Click on the first suggested keyword
    const searchpage: SearchResultPage = await homePage.clickSearchKeyword(testData.expectedKeyword);
    //Verify search term in page url
    await searchpage.verifySearchTermUrl(testData.urlSearchTerm);
    //expected product present
    await searchpage.verifyNumberOfProductText(testData.expectedSearchCount);
    const products: string[] = testData.expectedProdNames;
    for (const product of products) {
      await searchpage.verifyProductByName(product);
    }
  });
});
