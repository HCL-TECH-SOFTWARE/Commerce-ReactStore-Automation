/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 1996, 2020
 *
 *--------------------------------------------------
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
