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
import { ProductListingPage } from "../../pageobjects/pages/b2c/ProductListingPage.po";
import { Utils } from "../../pageobjects/pages/Utils.po";
import configFile from "../data/UserManagementData.json";
const CATALOG = require("../data/b2c/EmeraldProducts.json");
const dataFile = require("../data/b2c/ProductListingPage.json");

describe("B2C.ProductListingPage - User views ProductListing in emerald store", () => {
  let homepage: HomePage;
  let plp: ProductListingPage;
  const storeName = configFile.store;
  let testData;
  let m: string;

  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });
  it("Test01 - To filter by price in emerald store", async () => {
    m = "ProductListingPage.Test01";
    Utils.log(m, "To filter by price in emerald store");
    testData = dataFile.test01;
    const category = CATALOG.LivingRoom;
    const subcategory = category.Furniture;
    //Launch emerald store-front
    await browser.maximizeWindow();
    await browser.url(storeName.emerald);
    //Open hamburger menu
    homepage = new HomePage();
    const megaMenu = await homepage.headerMenu(category.categoryName);
    //go to a product listing page
    await megaMenu.goToProductListingPage(subcategory.subCategoryName);
    //Verify total number of products
    Utils.log(m, "default product count is " + testData.totalProducts);
    plp = new ProductListingPage();
    await (await plp.totalCountText(testData.totalProducts)).totalProductCards(testData.totalCards);
    //check the number of products displayed in the listing page
    await plp.verifyProductOnEachPage(testData.maxproducts);
    //verify total number of filters and filter pane heading
    await (await plp.totalFilters(testData.totalFilters)).verifyFilterPane(testData.expectedFilters);
    //verify thumnail images
    await plp.verifyAllImagesIsLoaded();
    //enter invalid price range min price > max price
    //check the button disabled
    const filterByPriceData = testData.filterByPrice;
    await plp.setPriceRange(filterByPriceData.invalidmaxprice, filterByPriceData.invalidminprice);
    await plp.verifyFilterButtonNotClickable();
    //enter valid price range
    //click
    await plp.clearPriceRange();
    //verify product not present in a given range
    await plp.setPriceRange(filterByPriceData.maxprice1, filterByPriceData.minprice1);
    await (await plp.verifyFilterButtonClickable()).filterByPrice();
    //verify no result message
    await plp.verifyNoResultMessage(filterByPriceData.noResultMsg);
    //clear price filter range
    await plp.clearSelectedPriceRange(filterByPriceData.maxprice1, filterByPriceData.minprice1);
    await plp.setPriceRange(filterByPriceData.maxprice, filterByPriceData.minprice);
    await (await plp.verifyFilterButtonClickable()).filterByPrice();
    //Check expected products count
    //Check max product appear
    await plp.totalCountText(filterByPriceData.totalproducts);
    await plp.verifyFilterProductDisplayOnEachPage(filterByPriceData.firstpage);
    //goto next page
    //Verify number of product displayed
    await (await plp.nextPage()).verifyFilterProductDisplayOnEachPage(filterByPriceData.secondpage);
    //goto next page
    //Verify number of product displayed
    await (await plp.nextPage()).verifyFilterProductDisplayOnEachPage(filterByPriceData.lastpage);
  });
});
