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
//BreadCrumb class is to handle the object of breadcrumbs
export class BreadCrumb {
  breadcrumbs = $('nav.MuiTypography-root ol')
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    this.breadcrumbs.waitForDisplayed()
  }
  /**
   * method to validate number of breadcrumbs display
   * @param expectedcount : pass expected count as a number
   */
  countBreadCrumbsDisplay (expectedcount: number) {
    let count: number = 0
    this.breadcrumbs
      .$$('li.MuiBreadcrumbs-li')
      .map(element =>
        console.log('Breadcrumb ' + count++ + '  ' + element.getText())
      )
    if (count != expectedcount) {
      expect(count).toEqual(expectedcount)
      throw new Error(
        'Incorrect number of breadcrumbs display expected ' +
          expectedcount +
          'actual ' +
          count
      )
    }
  }
  /**
   * method to get breadcrumb at given index
   * @param index : pass index as a number starts from 1
   * @param expectedproduct : pass expected product name as a string
   * @returns breadcrumb text as a string
   */
  getBreadCrumbText (index: number): string {
    this.breadcrumbs.waitForDisplayed()
    console.log(
      'Breadcrumb at index ' +
        index +
        '   ' +
        this.breadcrumbs.$$('li.MuiBreadcrumbs-li')[index].getText()
    )
    return this.breadcrumbs.$$('li.MuiBreadcrumbs-li')[index].getText()
  }
  /**
   * method to validate breadcrumb text at defined index
   * @param index : pass index as a number starts from 0
   * @param categoryname : pass expected category to be display on breadcrumb
   */
  verifyBreadCrumb (index: number, categoryname: string) {
    if (!this.getBreadCrumbText(index).match(categoryname)) {
      expect(this.getBreadCrumbText(index)).toBe(categoryname)
      throw new Error(
        'Category name on breadcrumb at index' + index + ' not matches'
      )
    }
  }
}
