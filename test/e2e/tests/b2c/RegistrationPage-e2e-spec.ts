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
import dataFile from "../data/b2c/RegistrationPage.json";
import configFile from "../data/UserManagementData.json";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2C.RegistrationPage - Register a new user in emerald store", function () {
  const storeName = configFile.store;
  let m: string;
  beforeAll(async function () {
    const helper = new RestHelper();
    await helper.deleteUser(dataFile.test01.email, configFile.store.emeraldId);

    await browser.url(storeName.emerald);
    await browser.maximizeWindow();
  });
  afterEach(async function () {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });
  it("Test01 -To register with with all mandatory and optional fields and view in signin header in emerald store", async () => {
    Utils.log(m, "To register with with all mandatory and optional fields and view in signin header in emerald store");
    const testData = dataFile.test01;
    //Launch emerald store-front
    await browser.url(storeName.emerald);
    const homePage = new HomePage();
    //Navigate to sign-in/registration page
    await homePage.signIn();
    //Registration page
    //And
    //Navigate to register new user screen
    const buyer = new RegistrationPage();
    await buyer.registernow();
    //create user
    await buyer.register("email", testData.email);
    await buyer.register("firstName", testData.firstName);
    await buyer.register("lastName", testData.lastName);
    await buyer.register("password1", testData.password);
    await buyer.register("password2", testData.password);
    await buyer.submitRegister();
    //Verify the user is logged in to storefront
    await homePage.verifyMyAccount(testData.firstName);
    //logout
    await homePage.signOutIfSignedIn();
  });
});
