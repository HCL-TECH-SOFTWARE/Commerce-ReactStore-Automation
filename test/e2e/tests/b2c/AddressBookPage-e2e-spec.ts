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
import { HomePage } from "../../pageobjects/pages/b2c/HomePage.po";
import { RegistrationPage } from "../../pageobjects/pages/b2c/RegistrationPage.po";
import { AddressBookPage } from "../../pageobjects/pages/b2c/AddressBookPage.po";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import { AddAddressPage } from "../../pageobjects/pages/b2c/AddAddressPage.po";
import { EditAddressPage } from "../../pageobjects/pages/b2c/EditAddressPage.po";
import dataFile from "../data/b2c/AddressBookPage.json";
import configFile from "../data/UserManagementData.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2C.AddressBookPage - User views address book in emerald store", () => {
  let homepage: HomePage;
  const storeName = configFile.store;
  const registerData = dataFile.register;
  let m: string;

  beforeAll(async function () {
    m = "AddressBookPage.beforeAll";
    const helper = new RestHelper();
    await helper.deleteUser(registerData.email, configFile.store.emeraldId);
    await browser.maximizeWindow();
    //Launch emerald store-front
    await browser.url(storeName.emerald);
    //Navigate to sign-in/registration page
    homepage = new HomePage();
    const buyer: RegistrationPage = await homepage.signIn();
    await buyer.registernow();
    //register user
    Utils.log(m, "Register a new user");
    await buyer.register("email", registerData.email);
    await buyer.register("firstName", registerData.firstName);
    await buyer.register("lastName", registerData.lastName);
    await buyer.register("password1", registerData.password);
    await buyer.register("password2", registerData.password);
    await buyer.submitRegister();
    //Verify the user is logged in to storefront
    await homepage.verifyMyAccount(registerData.firstName);
    Utils.log(m, "User is succesfully registered");
    //sign out
    await homepage.signOutIfSignedIn();
  });
  beforeEach(async function () {
    await browser.deleteAllCookies();
    await browser.execute(() => localStorage.clear());
    await browser.execute(() => sessionStorage.clear());
  });
  it("Test01 - To add a new address with default address type in emerald store", async () => {
    m = "AddressBookPage.Test01";
    Utils.log(m, "To add a new address with default address type in emerald store");
    const addressbookData = dataFile.test01;
    const addressData = addressbookData.ShipAddress;
    //Launch emerald store-front
    await browser.url(storeName.emerald);
    //login with the registered user
    homepage = new HomePage();
    const buyer: RegistrationPage = await homepage.signIn();
    await buyer.login("email", registerData.email);
    await buyer.login("password", registerData.password);
    await buyer.submitLogin();
    //Goto My Account page
    const myaccount = await homepage.accountSettings();
    //Goto Address Book page
    let addressbook: AddressBookPage = await myaccount.addressBook();
    //click add address button
    //Check if the create address button is disable by-default
    const addAddress: AddAddressPage = await addressbook.addAddress();
    await addAddress.verifyCreateAddressButtonDisable();
    //Enter all valid information & submit
    Utils.log(m, "Enter address details on add new address page");
    await (await addAddress.selectAddressType(addressbookData.addressType)).add(addressData);
    addressbook = await addAddress.submit();
    //Verify successful address saved alert message and address card on address book page
    //await addressbook.verifyDialogAlertMsg(addressbookData.expectedAlertMsg);
    await addressbook.verifyAddressCardDisplayed();
    //Click edit on the first address card & verify existing address details
    const editaddress: EditAddressPage = await addressbook.editAddress(1);
    await (await editaddress.verifyAddressType(addressbookData.addressType)).verifyExistingAddress(addressData);
    //click on cancel and remove 1st address card
    addressbook = await editaddress.cancel();
    await (await addressbook.removeAddress(1)).confirmDelete();
  });
});
