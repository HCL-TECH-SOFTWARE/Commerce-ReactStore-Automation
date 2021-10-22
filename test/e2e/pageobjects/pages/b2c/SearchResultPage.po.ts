/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 2020, 2021
•	
*-----------------------------------------------------------------
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
