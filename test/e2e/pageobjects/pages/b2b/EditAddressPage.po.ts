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
import { Utils } from '../Utils.po'
import { AddressBookPage } from './AddressBookPage.po'
//EditAddressPage class is used to handle the object of Edit Address Page
export class EditAddressPage {
  //edit address page
  editaddressTitle = $('//h4[text() = "Edit Address"]')
  addressType = $('//input[@checked=""]')
  cancelButton = $("//span[text()='Cancel']")
  util = new Utils()
  constructor () {
    this.validate()
  }
  /**
   * Used to validate edit address page title
   */
  validate () {
    expect(this.editaddressTitle.isDisplayed()).toBe(true)
  }
  /**
   * Used to verify address type
   * @param addresstype pass expected address type
   */
  verifyAddressType (addresstype: string): EditAddressPage {
    const selectedValue = this.addressType.getAttribute('Value')
    expect(selectedValue).toMatch(
      addresstype,
      'selected address type is not matches with ' + addresstype
    )
    return this
  }
  /**
   * Used to verfy existing details
   * @param expectedDetails : pass expected details
   */
  verifyExistingDetails (expectedDetails: object) {
    this.util.verifyDetails(expectedDetails)
  }
  /**
   * Used to click on cancel button/link
   */
  cancel (): AddressBookPage {
    this.cancelButton.scrollIntoView()
    this.util.handleOnClickBtn('Cancel')
    return new AddressBookPage()
  }
}
