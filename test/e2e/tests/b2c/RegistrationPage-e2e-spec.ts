/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 2020, 2021
•	
*-----------------------------------------------------------------
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
