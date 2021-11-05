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
