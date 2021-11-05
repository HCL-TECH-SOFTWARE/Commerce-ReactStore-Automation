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
import { MyAccountPage } from '../../pageobjects/pages/b2c/MyAccountPage.po'
import { RestHelper } from '../../pageobjects/base/RestHelper'
import dataFile = require('../data/b2c/MyAccount.json')
import configFile = require('../data/UserManagementData.json')

describe('B2C- User views My Account Page and Change Password in emerald store', () => {
  let homePage: HomePage
  let myaccount: MyAccountPage
  const storeName = configFile.store
  const registerData = dataFile.register
  beforeAll(function () {
    //delete if user exist
    const helper = new RestHelper()
    helper.deleteUser(registerData.email, configFile.store.emeraldId)
    //Launch emerald store-front
    browser.maximizeWindow()
    browser.url(storeName.emerald)
    //Navigate to sign-in/registration page
    homePage = new HomePage()
    const buyer: RegistrationPage = homePage.signIn()
    buyer.registernow()
    //create user
    buyer.register('email', registerData.email)
    buyer.register('firstName', registerData.firstName)
    buyer.register('lastName', registerData.lastName)
    buyer.register('password1', registerData.password)
    buyer.register('password2', registerData.password)
    buyer.submitRegister()
    //Verify the user is logged in to storefront
    homePage.verifyMyAccount(registerData.firstName)
    //Sign out
    homePage.signOutIfSignedIn()
  })
  beforeEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Test01- Verify personal information for the registered user in emerald store', () => {
    console.log(
      'Test01- Verify personal information for the registered user in emerald store'
    )
    const testData = dataFile.test01
    browser.url(storeName.emerald)
    homePage = new HomePage()
    //Login with the registered user
    const buyer: RegistrationPage = homePage.signIn()
    buyer.login('email', testData.email)
    buyer.login('password', testData.password)
    buyer.submitLogin()
    //Navigate to MyAccount Page
    myaccount = homePage.accountSettings()
    //Verify the info in My Account Page
    myaccount.verifyName(testData.expectedName)
    myaccount.verifyPersonalInfo(
      testData.expectedEmail,
      testData.emailIndex,
      'email'
    )
    myaccount.verifyPersonalInfo(
      testData.expectedCurrency,
      testData.currencyIndex,
      'currency'
    )
    //LogOut
    homePage.signOutIfSignedIn()
  })
  it('Test02- To change password with valid password in emerald store', () => {
    console.log(
      'Test02- To change password with valid password in emerald store'
    )
    const testData = dataFile.test02
    //Launch emerald storefront
    browser.url(storeName.emerald)
    homePage = new HomePage()
    //Login with the registered user
    let buyer: RegistrationPage = homePage.signIn()
    buyer.login('email', testData.email)
    buyer.login('password', testData.password)
    buyer.submitLogin()
    //Navigate to MyAccount Page
    myaccount = homePage.accountSettings()
    //Click on the 'Change Password' button in Password section
    const changePwdDialog = myaccount.changePassword()
    //Change Password with a new valid pwd
    changePwdDialog.setDialogValue(
      testData.currentPassword,
      testData.currentPwd
    )
    changePwdDialog.setDialogValue(testData.newPassword, testData.newPwd)
    changePwdDialog.setDialogValue(testData.verifyPassword, testData.verifyPwd)
    changePwdDialog.save()
    //Verify successful change password alert message and click on OK button
    changePwdDialog.verifyAlertMsg(testData.updatePasswordMsg)
    myaccount = changePwdDialog.okay()
    //Log out
    homePage = myaccount.signOut()
    //Navigate to registeration/sign-in page
    buyer = homePage.signIn()
    //Login with new Password
    buyer.login('email', testData.email)
    buyer.login('password', testData.newPwd)
    buyer.submitLogin()
    //Verify the user is logged in to storefront with new pwd
    homePage.verifyMyAccount(registerData.firstName)
  })
})
