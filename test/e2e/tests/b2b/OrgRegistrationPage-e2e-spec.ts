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
import { Utils } from "../../pageobjects/pages/Utils.po";
import dataFile from "../../tests/data/b2b/orgRegistrationPage.json";
import configFile from "../data/UserManagementData.json";

describe("B2B.OrgRegistrationPage - Register a new Organization user", function () {
  let orgID = "";
  let adminOrdLogonID = "";
  const storeName = configFile.store;
  let m: string;

  beforeEach(async () => {
    await browser.maximizeWindow();
  });

  it("Test01 -To register organization with all mandatory and optional fields without enabling same as address", async () => {
    m = "OrgRegistrationPage.Test01";
    Utils.log(m, "To register organization with all mandatory and optional fields without enabling same as address");
    const testData = dataFile.test01;
    await browser.url(storeName.sapphire);
    //Verify if page loaded
    const homePage = new HomePage();
    await homePage.signIn();
    await homePage.organizationRegistration();
    //fill organization details
    const organization = new RegistrationPage();
    orgID = await organization.readOrgID();
    adminOrdLogonID = await organization.readAdminOrgLogonID();
    Utils.log(m, "Organization Name :" + orgID + "| Logon ID :" + adminOrdLogonID);
    await organization.register("Organization Name", orgID);
    await organization.register("Email", testData.email);
    await organization.register("Address line 1", testData.addressline1);
    await organization.addAddressline2();
    await organization.register("Address line 2 (optional)", testData.addresslineoptional2);
    await organization.register("City", testData.city);
    await organization.register("Country", testData.country);
    await organization.register("State / Province", testData.state);
    await organization.register("Zip Code/ Postal Code", testData.postalcode);
    await organization.register("Phone (optional)", testData.phone);
    await organization.next();
    await organization.register("Logon Id", adminOrdLogonID);
    await organization.register("Password", testData.password);
    await organization.register("Verify Password", testData.verifyPassword);
    await organization.register("First Name", testData.firstName);
    await organization.register("Last Name", testData.lastName);
    await organization.register("Email", testData.email2);
    await organization.register("Phone (optional)", testData.phone2);
    await organization.register("Address line 1", testData.addresslinelogon1);
    await organization.addAddressline2();
    await organization.register("Address line 2 (optional)", testData.addresslineoptionallogon2);
    await organization.register("City", testData.city2);
    await organization.register("Country", testData.country2);
    await organization.register("State / Province", testData.state2);
    await organization.register("Zip Code/ Postal Code", testData.postalcode2);
    await organization.completeRegistration();
    //Verify successful change password alert message and click on OK button
    await organization.verifyAlertMsg(testData.alertMsg, organization.alertMsg);
    await organization.ok();
  });
});
