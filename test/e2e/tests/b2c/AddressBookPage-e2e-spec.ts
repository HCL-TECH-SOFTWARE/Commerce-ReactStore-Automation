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
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import { RegistrationPage } from '../../pageobjects/pages/b2c/RegistrationPage.po'
import { AddressBookPage } from '../../pageobjects/pages/b2c/AddressBookPage.po'
import { RestHelper } from '../../pageobjects/base/RestHelper'
import { AddAddressPage } from '../../pageobjects/pages/b2c/AddAddressPage.po'
import { EditAddressPage } from '../../pageobjects/pages/b2c/EditAddressPage.po'
import dataFile = require('../data/b2c/AddressBookPage.json')
import configFile = require('../data/UserManagementData.json')

describe('B2C- User views address book in emerald store', () => {
  let homepage: HomePage
  const storeName = configFile.store
  const registerData = dataFile.register
  beforeAll(function () {
    const helper = new RestHelper()
    helper.deleteUser(registerData.email, configFile.store.emeraldId)
    browser.maximizeWindow()
    //Launch emerald store-front
    browser.url(storeName.emerald)
    //Navigate to sign-in/registration page
    homepage = new HomePage()
    const buyer: RegistrationPage = homepage.signIn()
    buyer.registernow()
    //register user
    console.log('------------Register a new user-----------------')
    buyer.register('email', registerData.email)
    buyer.register('firstName', registerData.firstName)
    buyer.register('lastName', registerData.lastName)
    buyer.register('password1', registerData.password)
    buyer.register('password2', registerData.password)
    buyer.submitRegister()
    //Verify the user is logged in to storefront
    homepage.verifyMyAccount(registerData.firstName)
    console.log('------------User is succesfully registered-----------------')
    //sign out
    homepage.signOutIfSignedIn()
  })
  beforeEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01 - To add a new address with default address type in emerald store', () => {
    console.log(
      'Test01 - To add a new address with default address type in emerald store'
    )
    const addressbookData = dataFile.test01
    const addressData = addressbookData.ShipAddress
    //Launch emerald store-front
    browser.url(storeName.emerald)
    //login with the registered user
    homepage = new HomePage()
    const buyer: RegistrationPage = homepage.signIn()
    buyer.login('email', registerData.email)
    buyer.login('password', registerData.password)
    buyer.submitLogin()
    //Goto My Account page
    var myaccount = homepage.accountSettings()
    //Goto Address Book page
    var addressbook: AddressBookPage = myaccount.addressBook()
    //click add address button
    //Check if the create address button is disable by-default
    var addAddress: AddAddressPage = addressbook.addAddress()
    addAddress.verifyCreateAddressButtonDisable()
    //Enter all valid information & submit
    console.log(
      '-----------Enter address details on add new address page-------------'
    )
    addAddress.selectAddressType(addressbookData.addressType).add(addressData)
    addressbook = addAddress.submit()
    //Verify successful address saved alert message and address card on address book page
    addressbook.verifyDialogAlertMsg(addressbookData.expectedAlertMsg)
    addressbook.verifyAddressCardDisplayed()
    //Click edit on the first address card & verify existing address details
    var editaddress: EditAddressPage = addressbook.editAddress(1)
    editaddress
      .verifyAddressType(addressbookData.addressType)
      .verifyExistingAddress(addressData)
    //click on cancel and remove 1st address card
    addressbook = editaddress.cancel()
    addressbook.removeAddress(1).confirmDelete()
  })
})
