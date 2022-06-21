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

//Search Result Page class is used to handle the object of Search Result Page
export class SearchResultPage {
  prodNumberOfResult = $("h6.MuiTypography-subtitle2");
  productcards = "//div[contains(@class, 'product-card')]";
  noSearchResult = "//div[contains(@id, '_search-results')]";
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
   * Used to verify number of products
   * @param NoOfProducts pass number of products
   */
  async verifyNumberOfProductText(NoOfProducts: string) {
    await this.prodNumberOfResult.waitForDisplayed();
    await expect(await this.prodNumberOfResult.getText()).toContain(NoOfProducts);
    return this;
  }

  /**
   * Used to verify product name
   * @param index pass index
   * @param productName pass product name as string
   */
  async verifyProductByName(productName: string) {
    const productSelector = this.productcards + "//div[@title ='" + productName + "']";
    await expect(await $(productSelector).isDisplayed()).toBe(true);
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
}
