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
import * as envConfig from '../../../../../env.config.json'

//SearchResultPage class is to handle the object of search result page
export class SearchResultPage {
  prodNumberOfResult = $('h6.MuiTypography-subtitle2')
  noSearchResult = "//div[contains(@id, '_search-results')]"
  /**
   * method to validate search term on url
   * @param searchTerm : pass expected search term as a string
   */

  verifySearchTermUrl (searchTerm: string) {
    browser.pause(envConfig.timeout.midtimeout)
    expect(browser.getUrl()).toContain(
      searchTerm,
      'browser url not contains the search term : ' + searchTerm
    )
  }
  /**
   * method to validate number of products as a search result
   * @param NoOfProducts : pass expected count as a string
   * @returns SearchResultPage()
   */

  verifyNumberOfProductText (NoOfProducts: string) {
    this.prodNumberOfResult.waitForDisplayed()
    expect(this.prodNumberOfResult.getText()).toContain(
      NoOfProducts,
      'number of products does not matches'
    )
    return this
  }
  /**
   * method to validate product exist on page
   * @param productName : pass expected product name as a string
   */

  verifyProdResultByName (productName: string) {
    const selector =
      "//div[contains(@class, 'product-card')]//p[text()='" + productName + "']"
    expect($(selector).isDisplayed()).toBe(
      true,
      'expected product is not displayed'
    )
  }
}
