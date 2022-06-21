/*
# Copyright 2022 HCL America, Inc.
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
*/
import { RegistrationPage } from "../../pageobjects/pages/b2c/RegistrationPage.po";
import { HomePage } from "../../pageobjects/pages/b2c/HomePage.po";
import { MyAccountPage } from "../../pageobjects/pages/b2c/MyAccountPage.po";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import df from "../data/b2c/MyAccount.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2C.MyAccountPage - User views My Account Page and Change Password in emerald store", () => {
  let homePage: HomePage;
  let myaccount: MyAccountPage;
  const storeName = configFile.store;
  const dataFile = Utils.uniqueifyObj(df, "expectedName", "expectedEmail");
  const registerData = dataFile.register;
  let m: string;

  beforeAll(async () => {
    //delete if user exist
    const helper = new RestHelper();
    await helper.deleteUser(registerData.email, configFile.store.emeraldId);
    //Launch emerald store-front
    await browser.maximizeWindow();
    await browser.url(storeName.emerald);
    //Navigate to sign-in/registration page
    homePage = new HomePage();
    const buyer: RegistrationPage = await homePage.signIn();
    await buyer.registernow();
    //create user
    await buyer.register("email", registerData.email);
    await buyer.register("firstName", registerData.firstName);
    await buyer.register("lastName", registerData.lastName);
    await buyer.register("password1", registerData.password);
    await buyer.register("password2", registerData.password);
    await buyer.submitRegister();
    //Verify the user is logged in to storefront
    await homePage.verifyMyAccount(registerData.firstName);
    //Sign out
    await homePage.signOutIfSignedIn();
  });

  beforeEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - Verify personal information for the registered user in emerald store", async () => {
    m = "MyAccountPage.Test01";
    Utils.log(m, "Verify personal information for the registered user in emerald store");
    const testData = dataFile.test01;
    await browser.url(storeName.emerald);
    homePage = new HomePage();
    //Login with the registered user
    const buyer: RegistrationPage = await homePage.signIn();
    await buyer.login("email", testData.email);
    await buyer.login("password", testData.password);
    await buyer.submitLogin();
    //Navigate to MyAccount Page
    myaccount = await homePage.accountSettings();
    //Verify the info in My Account Page
    await myaccount.verifyName(testData.expectedName);
    await myaccount.verifyPersonalInfo(testData.expectedEmail, testData.emailIndex, "email");
    //LogOut
    await homePage.signOutIfSignedIn();
  });

  it("Test02 - To change password with valid password in emerald store", async () => {
    m = "MyAccountPage.Test02";
    Utils.log(m, "To change password with valid password in emerald store");
    const testData = dataFile.test02;
    //Launch emerald storefront
    await browser.url(storeName.emerald);
    homePage = new HomePage();
    //Login with the registered user
    let buyer: RegistrationPage = await homePage.signIn();
    await buyer.login("email", testData.email);
    await buyer.login("password", testData.password);
    await buyer.submitLogin();
    //Navigate to MyAccount Page
    myaccount = await homePage.accountSettings();
    //Click on the 'Change Password' button in Password section
    const changePwdDialog = await myaccount.changePassword();
    //Change Password with a new valid pwd
    await changePwdDialog.setDialogValue(testData.currentPassword, testData.currentPwd);
    await changePwdDialog.setDialogValue(testData.newPassword, testData.newPwd);
    await changePwdDialog.setDialogValue(testData.verifyPassword, testData.verifyPwd);
    await changePwdDialog.save();
    //Verify successful change password alert message and click on OK button
    await changePwdDialog.verifyAlertMsg(testData.updatePasswordMsg);
    myaccount = await changePwdDialog.okay();
    //Log out
    homePage = await myaccount.signOut();
    //Navigate to registeration/sign-in page
    buyer = await homePage.signIn();
    //Login with new Password
    await buyer.login("email", testData.email);
    await buyer.login("password", testData.newPwd);
    await buyer.submitLogin();
    //Verify the user is logged in to storefront with new pwd
    await homePage.verifyMyAccount(registerData.firstName);
  });
});
