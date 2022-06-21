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
//BreadCrumb class is to handle the object of breadcrumbs
export class BreadCrumb {
  breadcrumbs = $("nav.MuiTypography-root ol");
  constructor() {}

  /**
   * method to validate page load
   */
  async validate() {
    await this.breadcrumbs.waitForDisplayed();
  }

  /**
   * method to validate number of breadcrumbs display
   * @param expectedcount : pass expected count as a number
   */
  async countBreadCrumbsDisplay(expectedcount: number) {
    await this.validate();
    let count: number = 0;
    const bcs = await this.breadcrumbs.$$("li.MuiBreadcrumbs-li");
    await Promise.all(bcs.map(async (bc) => console.log(`Breadcrumb ${count++} ${await bc.getText()}`)));
    if (count != expectedcount) {
      await expect(count).toEqual(expectedcount);
      throw new Error("Incorrect number of breadcrumbs display expected " + expectedcount + "actual " + count);
    }
  }

  /**
   * method to get breadcrumb at given index
   * @param index : pass index as a number starts from 1
   * @param expectedproduct : pass expected product name as a string
   * @returns breadcrumb text as a string
   */
  async getBreadCrumbText(index: number) {
    await this.validate();
    const bcs = await this.breadcrumbs.$$("li.MuiBreadcrumbs-li");
    const bc = bcs[index];
    const text = await bc.getText();

    console.log(`Breadcrumb at index ${index}: text`);
    return text;
  }

  /**
   * method to validate breadcrumb text at defined index
   * @param index : pass index as a number starts from 0
   * @param categoryname : pass expected category to be display on breadcrumb
   */
  async verifyBreadCrumb(index: number, categoryname: string) {
    await this.validate();
    const text = await this.getBreadCrumbText(index);

    if (!text.match(categoryname)) {
      expect(text).toBe(categoryname);
      throw new Error("Category name on breadcrumb at index" + index + " does not matche");
    }
  }
}
