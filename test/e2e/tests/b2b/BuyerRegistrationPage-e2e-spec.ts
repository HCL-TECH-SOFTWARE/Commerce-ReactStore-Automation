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
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { RegistrationPage } from '../../pageobjects/pages/b2b/RegistrationPage.po'
import dataFile = require('../../tests/data/b2b/buyerRegistrationPage.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - Register a new buyer user', function () {
  const storeName = configFile.store
  let testData = dataFile.test01
  const date = new Date()
  const timeStamp =
    date.getHours().toString() +
    date.getMinutes().toString() +
    date.getSeconds().toString() +
    date.getMilliseconds().toString()
  it('Test01 -To register buyer with all mandatory and optional fields without enabling same as address', function () {
    console.log(
      'Test01 -To register buyer with all mandatory and optional fields without enabling same as address'
    )
    browser.url(storeName.sappire)
    //Verify if page loaded
    const homePage = new HomePage()
    homePage.signIn()
    homePage.buyerRegistration()
    //fill buyer details
    const buyer = new RegistrationPage()
    buyer.register('Logon Id', testData.logonId + timeStamp)
    buyer.register('Organization', configFile.organization.organizationName)
    buyer.register('Password', testData.password)
    buyer.register('Verify Password', testData.verifyPassword)
    buyer.register('Email', testData.email)
    buyer.register('Phone (optional)', testData.phone)
    buyer.register('Address line 1', testData.addressline1)
    buyer.addAddressline2()
    buyer.register('Address line 2 (optional)', testData.addresslineoptional2)
    buyer.register('City', testData.city)
    buyer.register('Country', testData.country)
    buyer.register('State / Province', testData.state)
    buyer.register('Zip / Postal Code', testData.postalcode)
    buyer.register('First Name', testData.firstName)
    buyer.register('Last Name', testData.lastName)
    buyer.completeRegistration()
    //Verify successful change password alert message and click on OK button
    buyer.verifyAlertMsg(testData.alertMsg, buyer.alertMsg)
    buyer.ok()
  })
})
