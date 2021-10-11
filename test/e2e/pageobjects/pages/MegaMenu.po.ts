/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 1996, 2020
•	
*-----------------------------------------------------------------
*/
import * as envConfig from '../../../../env.config.json'

//Mega Menu class is used to handle the object of Mega Menu
export class MegaMenu {
  parentcategoryLink = 'a > p.expanded-menu-bold'
  timeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * Used to go to product listing page using child category
   * @param childCategory : pass child category name as string
   */
  goToProductListingPage (childCategory: string) {
    const categorySelector: string =
      "//p[contains(text(), '" + childCategory + "')]"
    browser.waitUntil(() => $(categorySelector).getText() === childCategory, {
      timeout: this.timeoutValue,
      timeoutMsg: 'child category is not displayed in menu'
    })
    $(categorySelector).click()
    browser.pause(envConfig.timeout.midtimeout)
  }
  /**
   * Used to go to parent category from mega menu
   * @param parentcategory : pass parent category as string
   */
  goToParentCategoryFrom2TierMenu (parentcategory: string) {
    browser.waitUntil(
      () =>
        $(this.parentcategoryLink).isDisplayed() === true &&
        $(this.parentcategoryLink).getText() === parentcategory,
      {
        timeout: this.timeoutValue,
        timeoutMsg: 'parent category is not displayed in menu'
      }
    )
    $(this.parentcategoryLink).click()
  }
  /**
   * Used to go to child category from mega menu
   * @param parentcategory : pass child category name as string
   */
  goTOParentCategoryFrom3TierMenu (parentcategory: string) {
    const categorySelector: string =
      "//p[contains(text(), '" + parentcategory + "')]"
    browser.waitUntil(() => $(categorySelector).getText() === parentcategory, {
      timeout: this.timeoutValue,
      timeoutMsg: 'child category is not displayed in menu'
    })
    $(categorySelector).click()
  }
}
