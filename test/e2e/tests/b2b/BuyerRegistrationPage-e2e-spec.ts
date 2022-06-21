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
import { RegistrationPage } from "../../pageobjects/pages/b2b/RegistrationPage.po";
import dataFile from "../../tests/data/b2b/buyerRegistrationPage.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.BuyerRegistrationPage - Register a new buyer user", function () {
  const storeName = configFile.store;
  const testData = dataFile.test01;
  let m: string;

  it("Test01 -To register buyer with all mandatory and optional fields without enabling same as address", async () => {
    m = "BuyerRegistration.Test01";
    Utils.log(m, "To register buyer with all mandatory and optional fields without enabling same as address");
    await browser.url(storeName.sapphire);
    //Verify if page loaded
    const homePage = new HomePage();
    await homePage.signIn();
    await homePage.buyerRegistration();
    //fill buyer details
    const buyer = new RegistrationPage();
    await buyer.register("Logon Id", testData.logonId);
    await buyer.register("Organization", configFile.organization.organizationName);
    await buyer.register("Password", testData.password);
    await buyer.register("Verify Password", testData.verifyPassword);
    await buyer.register("Email", testData.email);
    await buyer.register("Phone (optional)", testData.phone);
    await buyer.register("Address line 1", testData.addressline1);
    await buyer.addAddressline2();
    await buyer.register("Address line 2 (optional)", testData.addresslineoptional2);
    await buyer.register("City", testData.city);
    await buyer.register("Country", testData.country);
    await buyer.register("State / Province", testData.state);
    await buyer.register("Zip / Postal Code", testData.postalcode);
    await buyer.register("First Name", testData.firstName);
    await buyer.register("Last Name", testData.lastName);
    await buyer.completeRegistration();
    //Verify successful change password alert message and click on OK button
    await buyer.verifyAlertMsg(testData.alertMsg, buyer.alertMsg);
    await buyer.ok();
  });
});
