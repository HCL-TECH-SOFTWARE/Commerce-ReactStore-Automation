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
import { AddressBookPage } from '../../pageobjects/pages/b2b/AddressBookPage.po'
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { OrganizationDashboardPage } from '../../pageobjects/pages/b2b/OrganizationDashboardPage.po'
import { RestHelper } from '../../pageobjects/base/RestHelper'
import dataFile = require('../data/b2b/AddressBookPage.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - User views address book', () => {
  const storeName = configFile.store
  let homePage: HomePage
  let addressbook: AddressBookPage
  let helper = new RestHelper()
  let password = helper.readPassword()
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01 - to add a new address with default address type', () => {
    console.log('Test01 - to add a new address with default address type')
    let testData = dataFile.test01.AddressBookPage
    //Launch sapphire store
    browser.url(storeName.sappire)
    //Go to registeration page & login with registerd user
    homePage = new HomePage()
    homePage.signIn()
    homePage.login(configFile.user.logonId, password)
    //Wait for your account to appear instead of Sign In
    homePage.goToYourAccount().goToAccountWindow('Dashboard')
    // Go to address book page
    const dashboardPage = new OrganizationDashboardPage()
    dashboardPage.dashboard('Account Settings', 'Address Book')
    //verify no address-card by-default
    addressbook = new AddressBookPage().verifyNoAddressCardDisplay()
    //Create new address with default address type selected
    const newAddress = addressbook.addAddress()
    newAddress.selectAddressType(testData.addressType).add(testData.shipAddress)
    newAddress.submitAddress()
    //Wait for alert message to appear and address card to display
    addressbook
      .verifyAlertMessage(testData.expectedAlertMsg)
      .verifyAddressCardDisplay()
    addressbook
      .verifyAlertMessage(testData.expectedAlertMsg)
      .verifyAddressCardDisplay()
    //Click on the edit link on first address card & verify existing address details
    const editAddress = addressbook.editAddress(1)
    editAddress.verifyExistingDetails(testData.shipAddress)
    addressbook = editAddress.cancel()
    //Delete address
    addressbook.deleteAddress(1)
    addressbook.confirmDelete()
  })
})
