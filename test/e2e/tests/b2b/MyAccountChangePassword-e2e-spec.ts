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
import { HomePage } from "../../pageobjects/pages/b2b/HomePage.po";
import { PersonalInformation } from "../../pageobjects/pages/b2b/PersonalInformationPage.po";
import dataFile from "../../tests/data/b2b/AccountPage.json";
import configFile from "../data/UserManagementData.json";
import envConfig from "../../../../env.config.json";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.MyAccountChangePassword - User views My Account Page and Change Password", () => {
  let personalInfo, homePage, m: string;
  const storeName = configFile.store;
  const links = dataFile.links;
  const testData = dataFile.test01;
  const helper = new RestHelper();
  const password = helper.readPassword();

  beforeEach(async () => {
    await browser.maximizeWindow();
    await browser.url(storeName.sapphire);
    homePage = new HomePage();
    await homePage.signIn();
    await homePage.login(configFile.user.logonId, password);
    await homePage.goToYourAccount();
    await homePage.goToAccountWindow("Dashboard");
  });

  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
    homePage = new HomePage();
  });

  it("Test01 - Verify personal information for the registered user", async () => {
    m = "MyAccountChangePassword.Test01";
    Utils.log(m, "Verify personal information for the registered user");
    //Verfiy the Personal Information Header
    personalInfo = await PersonalInformation.get();
    personalInfo.editPersonalInfo();

    Utils.log(m, "Verifying heading");
    await personalInfo.verifyPersonalInformationPageHeading();

    //Verfiy the Welcome Header
    Utils.log(m, "Verifying welcome message");
    await personalInfo.verifyWelcomeMsg();

    //Verfy links on Personal Information page
    Utils.log(m, "Verifying links");
    await personalInfo.verifylinks(links.orderhistory);
    await personalInfo.verifylinks(links.addressbook);
    await personalInfo.verifylinks(links.recurringorders);

    //verify the personal information
    Utils.log(m, "Verifying personal info");
    await personalInfo.verifyTextValue("First Name", testData.firstName);
    await personalInfo.verifyTextValue("Last Name", testData.lastName);
    await personalInfo.verifyTextValue("Email Address", testData.email);
    await personalInfo.verifyTextValue("Phone (optional)", testData.phone);
    await personalInfo.verifyTextValue("Address line 1", testData.address);
    await browser.pause(envConfig.timeout.lowtimeout);
  });

  it("Test02 - To Verify incorrect Current Password Alert", async () => {
    m = "MyAccountChangePassword.Test02";
    Utils.log(m, "To Verify incorrect Current Password Alert");
    //verify the personal information
    personalInfo = await PersonalInformation.get();
    await personalInfo.changePassword();
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.type("Current Password", configFile.user.password);
    await personalInfo.type("New Password", configFile.user.password);
    await personalInfo.type("Verify Password", configFile.user.password);
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.savePassword();
    await personalInfo.verifyIncorrectCurrentPasswordAlert(testData.incorrectPassword);
  });

  it("Test03 - To Change password where new password is not as per the password policy", async () => {
    m = "MyAccountChangePassword.Test03";
    Utils.log(m, "To Change password where new password is not as per the password policy");
    //verify the personal information
    personalInfo = await PersonalInformation.get();
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.changePassword();

    await personalInfo.type("Current Password", password);
    await personalInfo.type("New Password", dataFile.passwordPolicy.lessthan8char);
    await personalInfo.type("Verify Password", dataFile.passwordPolicy.lessthan8char);
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.savePassword();

    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.verifyPasswordPolicyAlertMessage(dataFile.passwordPolicy.passwordPolicyMessageForLessThan8Char);
    await browser.pause(envConfig.timeout.lowtimeout);

    await personalInfo.type("New Password", dataFile.passwordPolicy.passwordwithoutdigit);
    await personalInfo.type("Verify Password", dataFile.passwordPolicy.passwordwithoutdigit);
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.savePassword();
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.verifyPasswordPolicyAlertMessage(
      dataFile.passwordPolicy.passwordPolicyMessageForpasswordWithoutDigit
    );
    await browser.pause(envConfig.timeout.lowtimeout);

    //verify the personal information
    await personalInfo.type("Current Password", password);
    await personalInfo.type("New Password", dataFile.passwordPolicy.passwordwithoutchar);
    await personalInfo.type("Verify Password", dataFile.passwordPolicy.passwordwithoutchar);
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.savePassword();

    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.verifyPasswordPolicyAlertMessage(
      dataFile.passwordPolicy.passwordPolicyMessageForpasswordWithoutChar
    );
  });

  it("Test04 - To change password", async () => {
    m = "MyAccountChangePassword.Test04";
    Utils.log(m, "To change password");
    //verify the personal information
    personalInfo = await PersonalInformation.get();
    await browser.pause(envConfig.timeout.lowtimeout);
    //verify save button is not clickable
    await personalInfo.changePassword();
    await personalInfo.verifySavePwDisabled();

    //Change Password with a new pwd
    await personalInfo.type("Current Password", password);
    await personalInfo.type("New Password", testData.newpassword);
    await personalInfo.type("Verify Password", testData.verifynewpassword);
    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.savePassword();

    await browser.pause(envConfig.timeout.lowtimeout);
    await personalInfo.verifyChangePasswordAlert(testData.changepasswordalertmessage);
    await browser.pause(envConfig.timeout.lowtimeout);

    await personalInfo.storePassword(testData.verifynewpassword);
    await browser.pause(envConfig.timeout.midtimeout);
  });
});
