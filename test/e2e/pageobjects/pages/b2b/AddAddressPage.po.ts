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

//AddAddressPage class is used to handle the object of add address page
export class AddAddressPage {
  newaddressTitle = $('//h4[text() = "Add a new address"]')
  addressType = $('//input[@checked=""]')
  fieldLocator = "//input[@name= 'field']"
  util = new Utils()
  constructor () {
    this.validate()
  }
  /**
   * Validate function used to validate the new address title from the add address page
   */
  validate () {
    expect(this.newaddressTitle.isDisplayed()).toBe(true)
  }
  /**
   * Used to select address type
   * @param addresstype : pass string as Shipping/Billing
   */
  selectAddressType (addresstype: string): AddAddressPage {
    console.log('address type is ' + addresstype)
    const addressSelector = $("//input[@value='" + addresstype + "']")
    addressSelector.click()
    return this
  }
  /**
   * Used to add address details on the add address page
   * @param addressDetails : pass address as a json object where key as a address field and value as input field value
   */
  add (addressDetails: object) {
    this.util.addDetails(addressDetails)
  }
  /**
   * Used to submit an address/create address
   */
  submitAddress () {
    this.util.handleOnClickBtn('Create Address')
  }
}
