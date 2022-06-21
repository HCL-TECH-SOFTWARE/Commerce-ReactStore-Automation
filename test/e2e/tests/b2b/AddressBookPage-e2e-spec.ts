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
import { AddressBookPage } from "../../pageobjects/pages/b2b/AddressBookPage.po";
import { HomePage } from "../../pageobjects/pages/b2b/HomePage.po";
import { OrganizationDashboardPage } from "../../pageobjects/pages/b2b/OrganizationDashboardPage.po";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import dataFile from "../data/b2b/AddressBookPage.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.AddressBookPage - User views address book", () => {
  const storeName = configFile.store;
  let homePage: HomePage;
  let addressbook: AddressBookPage;
  const helper = new RestHelper();
  let password: string, m: string;

  beforeEach(async () => {
    password = await helper.readPassword();
  });

  afterEach(async () => {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });

  it("Test01 - to add a new address with default address type", async () => {
    m = "AddressBookPage.Test01";
    Utils.log(m, "to add a new address with default address type");

    const testData = dataFile.test01.AddressBookPage;
    //Launch sapphire store
    await browser.url(storeName.sapphire);

    //Go to registeration page & login with registerd user
    homePage = new HomePage();
    await homePage.signIn();
    await homePage.login(configFile.user.logonId, password);

    //Wait for your account to appear instead of Sign In
    await homePage.goToYourAccount();
    await homePage.goToAccountWindow("Dashboard");

    // Go to address book page
    const dashboardPage = new OrganizationDashboardPage();
    await dashboardPage.dashboard("Account Settings", "Address Book");

    //verify only default address card
    addressbook = new AddressBookPage();
    await browser.waitUntil(async () => (await addressbook.getNumAddressCards()) === 1);
    await addressbook.verifyNumAddressCards(1);

    //Create new address with default address type selected
    const newAddress = await addressbook.addAddress();
    await newAddress.selectAddressType(testData.addressType);
    await newAddress.add(testData.shipAddress);
    await newAddress.submitAddress();

    //Wait for alert message to appear and address card to display
    await addressbook.verifyAlertMessage(testData.expectedAlertMsg);
    await addressbook.verifyAddressCardDisplay();
    await browser.waitUntil(async () => (await addressbook.getNumAddressCards()) === 2);

    //Click on the edit link on first address card & verify existing address details
    const editAddress = await addressbook.editAddress();
    await editAddress.verifyExistingDetails(testData.shipAddress);
    addressbook = await editAddress.cancel();

    //Delete address
    await addressbook.deleteAddress();
    await addressbook.confirmDelete();
  });
});
