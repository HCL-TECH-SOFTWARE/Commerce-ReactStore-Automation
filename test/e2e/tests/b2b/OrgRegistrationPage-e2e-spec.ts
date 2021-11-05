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
import dataFile = require('../../tests/data/b2b/orgRegistrationPage.json')
import configFile = require('../data/UserManagementData.json')

describe('B2B - Register a new Organination user', function () {
  let orgID = ''
  let adminOrgLogonID = ''
  const storeName = configFile.store
  beforeEach(function () {
    browser.maximizeWindow()
  })
  it('Test01 -To register organization with all mandatory and optional fields without enabling same as address', function () {
    console.log(
      'Test01 -To register organization with all mandatory and optional fields without enabling same as address'
    )
    const testData = dataFile.test01
    browser.url(storeName.sappire)
    //Verify if page loaded
    const homePage = new HomePage()
    homePage.signIn()
    homePage.organizationRegistration()
    //fill organization details
    const organization = new RegistrationPage()
    orgID = organization.readOrgID()
    adminOrgLogonID = organization.readAdminOrgLogonID()
    console.log(
      'Organization Name :' + orgID + '| Logon ID :' + adminOrgLogonID
    )
    organization.register('Organization Name', orgID)
    organization.register('Email', testData.email)
    organization.register('Address line 1', testData.addressline1)
    organization.addAddressline2()
    organization.register(
      'Address line 2 (optional)',
      testData.addresslineoptional2
    )
    organization.register('City', testData.city)
    organization.register('Country', testData.country)
    organization.register('State / Province', testData.state)
    organization.register('Zip Code/ Postal Code', testData.postalcode)
    organization.register('Phone (optional)', testData.phone)
    organization.next()
    organization.register('Logon Id', adminOrgLogonID)
    organization.register('Password', testData.password)
    organization.register('Verify Password', testData.verifyPassword)
    organization.register('First Name', testData.firstName)
    organization.register('Last Name', testData.lastName)
    organization.register('Email', testData.email2)
    organization.register('Phone (optional)', testData.phone2)
    organization.register('Address line 1', testData.addresslinelogon1)
    organization.addAddressline2()
    organization.register(
      'Address line 2 (optional)',
      testData.addresslineoptionallogon2
    )
    organization.register('City', testData.city2)
    organization.register('Country', testData.country2)
    organization.register('State / Province', testData.state2)
    organization.register('Zip Code/ Postal Code', testData.postalcode2)
    organization.completeRegistration()
    //Verify successful change password alert message and click on OK button
    organization.verifyAlertMsg(testData.alertMsg, organization.alertMsg)
    organization.ok()
  })
})
