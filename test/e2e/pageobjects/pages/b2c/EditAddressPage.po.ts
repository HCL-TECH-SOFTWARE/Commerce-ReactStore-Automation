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

//EditAddressPage class is to handle the object of edit address page
export class EditAddressPage {
  util = new Utils()
  pageName = "//span//h4[contains(text(), 'Edit Address')]"
  addressType = $('//input[@checked=""]')
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    $(this.pageName).waitForDisplayed()
  }
  /**
   * method to cancel address changes
   * @returns AddressBookPage()
   */
  cancel (): AddressBookPage {
    this.util.handleOnClickBtn('Cancel')
    return new AddressBookPage()
  }
  /**
   * method to validate selected address type
   * @param addresstype : pass expected address type as a string
   * @returns EditAddressPage()
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
   * method to validate existing address card
   * @param address : pass address as a json object where key as a address field and value as an expected input value
   * @returns EditAddressPage()
   */
  verifyExistingAddress (address: object): EditAddressPage {
    this.util.verifyDetails(address)
    return this
  }
}
