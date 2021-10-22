/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 2020, 2021
 *
 *--------------------------------------------------
 */
import { HomePage } from '../../pageobjects/pages/b2b/HomePage.po'
import { OrganizationDashboardPage } from '../../pageobjects/pages/b2b/OrganizationDashboardPage.po'
import { PersonalInformation } from '../../pageobjects/pages/b2b/PersonalInformationPage.po'
import dataFile = require('../../tests/data/b2b/AccountPage.json')
import configFile = require('../data/UserManagementData.json')
import envConfig = require('../../../../env.config.json')
import { RestHelper } from '../../pageobjects/base/RestHelper'

describe('B2B - User views My Account Page and Change Password', function () {
  let personalInfo, homePage
  const storeName = configFile.store
  const links = dataFile.links
  const testData = dataFile.test01
  const helper = new RestHelper()
  const password = helper.readPassword()
  beforeEach(function () {
    browser.maximizeWindow()
    browser.url(storeName.sappire)
    homePage = new HomePage()
    homePage.signIn()
    homePage.login(configFile.user.logonId, password)
    homePage.goToYourAccount().goToAccountWindow('Dashboard')
  })
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
    homePage = new HomePage()
  })
  it('Test01: Verify personal information for the registered user', function () {
    console.log('Test01: Verify personal information for the registered user')
    const dashboardPage = new OrganizationDashboardPage()
    dashboardPage.dashboard('Account Settings', 'Personal Information')
    //Verfiy the Personal Information Header
    personalInfo = new PersonalInformation()
    personalInfo.verifyPersonalInformationPageHeading()
    //Verfiy the Welcome Header
    personalInfo.verifyWelcomeMsg()
    //Verify the Welcome description
    personalInfo.verifyWelcomeDecription(testData.welcomedescription)
    //Verfy links on Personal Information page
    personalInfo.verifylinks(links.orderhistory)
    personalInfo.verifylinks(links.addressbook)
    personalInfo.verifylinks(links.recurringorders)
    //verify the personal information
    personalInfo.verifyTextValue('Name', testData.name)
    personalInfo.verifyTextValue('Email Address', testData.email)
    personalInfo.verifyTextValue('Phone Number', testData.phone)
    personalInfo.verifyTextValue('Address', testData.address)
  })
  it('Test02: To change password', function () {
    console.log('Test02: To change password')
    const dashboardPage = new OrganizationDashboardPage()
    dashboardPage.dashboard('Account Settings', 'Personal Information')
    //verify the personal information
    personalInfo = new PersonalInformation()
    //verify save button is not clickable
    personalInfo.verifyButtonIsNotClickable('Save')
    //Change Password with a new pwd
    personalInfo.type('Current Password', password)
    personalInfo.type('New Password', testData.newpassword)
    personalInfo.type('Verify Password', testData.verifynewpassword)
    personalInfo.updatePassword()
    personalInfo.verifyChangePasswordAlert(testData.changepasswordalertmessage)
    personalInfo.storePassword(testData.verifynewpassword)
    personalInfo.dashboard()
  })
})
