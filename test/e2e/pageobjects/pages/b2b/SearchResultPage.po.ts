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

//Search Result Page class is used to handle the object of Search Result Page
export class SearchResultPage {
  prodNumberOfResult = $('h6.MuiTypography-subtitle2')
  productcards = "//div[contains(@class, 'product-card')]"
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
   * Used to verify number of products
   * @param NoOfProducts pass number of products
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
   * Used to verify product name
   * @param index pass index
   * @param productName pass product name as string
   */
  verifyProductByName (productName: string) {
    const productSelector =
      this.productcards + "//div[@title ='" + productName + "']"
    expect($(productSelector).isDisplayed()).toBe(
      true,
      'this product ' + productName + 'is not displayed on search result page'
    )
  }
  /**
   * method to validate search match found
   * @param expectedMatchCountMsg  pass expected match msg as a string
   */

  verifyNumberOfMatchesFoundMsg (expectedMatchCountMsg: string) {
    const matchSelector = this.noSearchResult + '//h4'
    $(matchSelector).waitForDisplayed()
    expect($(matchSelector).getText()).toBe(
      expectedMatchCountMsg,
      'Search results match count does not match '
    )
  }
  /**
   * method to validate no search results message
   * @param expectedSearchResultMsg pass expected no search resualt message
   */

  verifyNoResultMsg (expectedSearchResultMsg: string) {
    const msgSelector = this.noSearchResult + '//p'
    $(msgSelector).waitForDisplayed()
    expect($(msgSelector).getText()).toBe(expectedSearchResultMsg)
  }
}
