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
import { ProductListingPage } from "../../pageobjects/pages/b2b/ProductListingPage.po";
import CATALOG from "../data/b2b/SapphireProducts.json";
import dataFile from "../data/b2b/ProductListingPage.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.ProductListingPage - User views ProductListing", () => {
  const storeName = configFile.store;
  let plp: ProductListingPage;
  let m: string;

  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - to filter by price in sapphire store", async () => {
    m = "ProductListingPage.Test01";
    Utils.log(m, "to filter by price in sapphire store");
    const testdata = dataFile.test01;
    const category = CATALOG.Categories.Fasteners;
    const subcategory = category.Bolts;
    // Launch sapphire storefront
    await browser.url(storeName.sapphire);

    // Open hamburger menu
    const homePage = new HomePage();
    const megaMenu = await homePage.headerMenu(category.categoryName);

    // Navigate to PLP
    await megaMenu.goToProductListingPage(subcategory.subCategoryName);

    // verify 'Filter by' heading and total filters
    plp = new ProductListingPage();
    await plp.verifyFilterHeading(testdata.FilterByHeading);
    await plp.totalFilters(testdata.totalfilters);

    // verify all filter headings
    await plp.verifyFilterPane(testdata.expectedFilters);
    // Verify default product count, number of cards and image load
    await plp.totalCountText(testdata.totalProducts);
    await plp.totalProductCards(testdata.totalCards);
    await plp.verifyAllImagesIsLoaded();
    const filterByPriceData = testdata.FilterByPrice;

    // enter invalid price range min price > max price
    // check the button not clickable
    await plp.setPriceRange(filterByPriceData.invalidmaxprice, filterByPriceData.invalidminprice);
    await plp.verifyFilterButtonNotClickable();

    // enter invalid price range min price < max price
    // check the button is clickable
    await plp.clearPriceRange();
    await plp.setPriceRange(filterByPriceData.maxprice, filterByPriceData.minprice);
    await plp.verifyFilterButtonClickable();

    // Click on filter button & Verify filter by price result
    await plp.filterByPrice();
    await plp.totalCountText(filterByPriceData.totalProducts);
  });
});
