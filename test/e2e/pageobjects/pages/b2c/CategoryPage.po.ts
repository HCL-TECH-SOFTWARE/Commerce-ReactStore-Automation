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

//CategoryPage class is to handle the object of category page
export class CategoryPage {
  categorycontainer = $('/html/body/div/div/div/div[2]/div/div/div[2]/div/div')
  breadcrumbs = $('nav.MuiTypography-root ol')
  categoryPageHeading = $("//div[contains(@class, 'heroImage')]//h2")
  timeoutValue: number = envConfig.timeout.maxtimeout
  /**
   * method to get child category at given index
   * @param subcategoriesName : pass sub category name as a string
   * @returns child category name as a string
   */

  getChildCategory (subcategoriesName: string) {
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]"
    this.categorycontainer.scrollIntoView()
    const categoryCards = this.categorycontainer.$(categorycard)
    return categoryCards.getText()
  }
  /**
   * method to navigate child category at given location
   * @param index : pass index as a number to locate
   * @returns CategoryPage()
   */

  handleChildCategoryName (subcategoriesName: string): CategoryPage {
    this.categorycontainer.scrollIntoView()
    const categorycard = "//h3[contains(text(),'" + subcategoriesName + "')]"
    this.categorycontainer.$(categorycard).click()
    return new CategoryPage()
  }
  /**
   * method to click on breadcrumb as per index defined
   * @param index : pass index as a number
   * @returns CategoryPage()
   */

  breadCrumb (index: number): CategoryPage {
    this.breadcrumbs.$$('li.MuiBreadcrumbs-li')[index].click()
    return new CategoryPage()
  }
  /**
   * method to get category page heading
   * @returns category page heading as a string
   */

  getCategoryName (): string {
    browser.waitUntil(() => this.categoryPageHeading.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Category page heading is not displayed'
    })
    console.log('Catgeory name is ------>' + this.categoryPageHeading.getText())
    return this.categoryPageHeading.getText()
  }
  /**
   * method to validate category name
   * @param expectedCategoryName : pass expected category name as a string
   * @returns CategoryPage()
   */

  verifyCategoryName (expectedCategoryName: string): CategoryPage {
    if (!this.getCategoryName().match(expectedCategoryName)) {
      expect(this.getCategoryName()).toBe(
        expectedCategoryName,
        'User is not on expected category page'
      )
    }
    return this
  }
  /**
   * method to verify each child category from product.json
   * @param category pass parentCategory as a json object from emeraldproduct.json
   * @returns CategoryPage()
   */

  verifyChildCategories (category: object): CategoryPage {
    const subcategories: string[] = Object.keys(category)
    subcategories.shift() //remove categoryName
    subcategories.forEach(subcategory => {
      const result: string = this.getChildCategory(subcategory)
      console.log('child category is ----' + result)
      expect(result).toBe(subcategory, 'child category not matches')
    })
    return this
  }
}
