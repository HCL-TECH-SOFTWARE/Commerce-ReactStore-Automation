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
import { RegistrationPage } from '../../pageobjects/pages/b2c/RegistrationPage.po'
import { HomePage } from '../../pageobjects/pages/b2c/HomePage.po'
import dataFile = require('../data/b2c/RegistrationPage.json')
import configFile = require('../data/UserManagementData.json')
import { RestHelper } from '../../pageobjects/base/RestHelper'

describe('B2C- Register a new user in emerald store', function () {
  const storeName = configFile.store
  beforeAll(function () {
    var helper = new RestHelper()
    helper.deleteUser(dataFile.test01.email, configFile.store.emeraldId)
    browser.maximizeWindow()
  })
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01 -To register with with all mandatory and optional fields and view in signin header in emerald store', () => {
    console.log(
      'Test01 -To register with with all mandatory and optional fields and view in signin header in emerald store'
    )
    const testData = dataFile.test01
    //Launch emerald store-front
    browser.url(storeName.emerald)
    const homePage = new HomePage()
    //Navigate to sign-in/registration page
    homePage.signIn()
    //Registration page
    //And
    //Navigate to register new user screen
    const buyer = new RegistrationPage()
    buyer.registernow()
    //create user
    buyer.register('email', testData.email)
    buyer.register('firstName', testData.firstName)
    buyer.register('lastName', testData.lastName)
    buyer.register('password1', testData.password)
    buyer.register('password2', testData.password)
    buyer.submitRegister()
    //Verify the user is logged in to storefront
    homePage.verifyMyAccount(testData.firstName)
    //logout
    homePage.signOutIfSignedIn()
  })
})
