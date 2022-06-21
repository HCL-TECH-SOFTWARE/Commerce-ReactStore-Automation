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
import { ProductDetailPage } from "../../pageobjects/pages/b2b/ProductDetailPage.po";
import { ProductListingPage } from "../../pageobjects/pages/b2b/ProductListingPage.po";
import { ShoppingCartPage } from "../../pageobjects/pages/b2b/ShoppingCartPage.po";
import { CheckoutPage } from "../../pageobjects/pages/b2b/CheckoutPage.po";
import { OrderConfirmationPage } from "../../pageobjects/pages/b2b/OrderConfirmationPage.po";
import { OrganizationDashboardPage } from "../../pageobjects/pages/b2b/OrganizationDashboardPage.po";
import { AddressBookPage } from "../../pageobjects/pages/b2b/AddressBookPage.po";
import CATALOG from "../data/b2b/SapphireProducts.json";
import dataFile from "../data/b2b/b2bCheckoutPageAsRegisteredShopper.json";
import configFile from "../data/UserManagementData.json";
import envConfig from "../../../../env.config.json";
import { RestHelper } from "../../pageobjects/base/RestHelper";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2B.CheckoutPageRegisterAndGuestUserb2b - User views checkout page in sapphire store as a guest user", () => {
  const storeName = configFile.store;
  const helper = new RestHelper();
  let password: string, m: string;

  beforeEach(async () => {
    m = "CheckoutPageRegisterAndGuestUserb2b.beforeEach";
    password = await helper.readPassword();
    await browser.maximizeWindow();
  });

  afterAll(async () => {
    //delete existing address
    const homepage = new HomePage();
    await homepage.goToYourAccount();
    await homepage.goToAccountWindow("Dashboard");
    // Go to address book page
    const dashboardPage = new OrganizationDashboardPage();
    await dashboardPage.dashboard("Account Settings", "Address Book");
    const addressbook = new AddressBookPage();
    await addressbook.deleteAllAddress();
  });

  it("Test01 - User unable to add a product in Shopping cart", async () => {
    m = "CheckoutPageRegisterAndGuestUserb2b.Test01";
    Utils.log(m, "User unable to add a product in Shopping cart");
    const parentcategory = CATALOG.AllCategories.categoryName;
    const category = CATALOG.Categories.Fasteners;
    const subcategory = category.Bolts;
    const product1 = subcategory["T-Handle Bolt"];
    const subproduct1 = product1.subproduct;
    Utils.log(m, "Go to the Sapphire Store");
    await browser.url(storeName.sapphire);
    const homePage = new HomePage();
    const megaMenu = await homePage.headerMenu(parentcategory);
    //Navigate to parent category
    await megaMenu.goToParentCategoryFrom3TierMenu(subcategory.subCategoryName);
    const plp = new ProductListingPage();
    const pdp: ProductDetailPage = await plp.productSelect(product1.name);
    await pdp.verifyImagesIsLoaded();
    await pdp.verifyProductInfo(product1);
    await pdp.verifySubProductType(subproduct1.type1);
    await pdp.verifyQuantityIsDisabled(subproduct1.type1.sku);
    await pdp.pleaseSignIntoShop();
    await pdp.verifySignInPage();
  });

  it("Test02 - To complete registered user checkout with a product", async () => {
    m = "CheckoutPageRegisterAndGuestUserb2b.Test02";
    Utils.log(m, "To complete registered user checkout with a product");
    const testData = dataFile.test01;
    const parentcategory = CATALOG.AllCategories.categoryName;
    const category = CATALOG.Categories.Fasteners;
    const subcategory = category.Bolts;
    const product1 = subcategory["T-Handle Bolt"];
    const subproduct1 = product1.subproduct;
    const shippingaddress = testData.addressBook[0];
    const billingaddress = testData.addressBook[1];
    const homepage = new HomePage();
    Utils.log(m, "Click on Sign in Button");
    await homepage.signIn();

    await browser.pause(envConfig.timeout.lowtimeout);

    await homepage.login(configFile.user.logonId, password);
    const megaMenu = await homepage.headerMenu(parentcategory);
    //Navigate to parent category
    await megaMenu.goToParentCategoryFrom3TierMenu(subcategory.subCategoryName);
    const plp = new ProductListingPage();
    const pdp: ProductDetailPage = await plp.productSelect(product1.name);

    Utils.log(m, "Select Type1 SKU and type2 Sku");
    await pdp.quantity(subproduct1.type1.sku, dataFile.quantity.One);
    await pdp.quantity(subproduct1.type2.sku, dataFile.quantity.Two);

    Utils.log(m, "Click on Add to Current order button");
    await browser.pause(envConfig.timeout.lowtimeout);
    await pdp.addToCurrentOrder();

    Utils.log(m, "Verify alert message after adding product to the cart");
    await browser.pause(envConfig.timeout.lowtimeout);
    await pdp.verifyAlertMessage(dataFile.alertmsg.twoItemsAddedB2B);

    Utils.log(m, "Click on view cart link from the alert message");
    await pdp.navFromMiniCart();

    Utils.log(m, "Verify order item table for type 1 and type 2 product");
    await browser.pause(envConfig.timeout.midtimeout);
    const scp = new ShoppingCartPage();
    let type1expectedPrice = await scp.verifyOrderItemTable(subproduct1.type1, dataFile.quantity.One);
    let type2expectedPrice = await scp.verifyOrderItemTable(subproduct1.type2, dataFile.quantity.Two);

    Utils.log(m, "Verify all the images are loaded");
    await scp.verifyAllImagesIsLoaded();

    Utils.log(m, "Verify promo code section");
    await scp.verifyPromoCodeSection();

    Utils.log(m, "Verify order summary section");
    await scp.verifyOrderSummarySection(type1expectedPrice + type2expectedPrice);

    Utils.log(m, "Click on the checkout button");
    await scp.checkout();
    const ckp = await CheckoutPage.get();

    await ckp.createNewAddress();
    await ckp.verifySaveAndSelectBtnColor(dataFile.buttonColor.backgroundColorDisabled);
    await ckp.addAddressDetails(testData.addressBook[0]);
    await ckp.verifySaveAndSelectBtnColor(dataFile.buttonColor.backgroundColorEnabled);
    await ckp.saveAndSelectThisAddress();
    await ckp.selectShippingMethod(testData.shippingMethod);
    await ckp.continueToPayment();
    await ckp.verifyPaymentMethodTypes(dataFile.paymentMethodType);
    await ckp.selectPaymentMethod(testData.paymentMethod);
    await ckp.createNewAddress();
    await ckp.verifySaveAndSelectBtnColor(dataFile.buttonColor.backgroundColorDisabled);
    await ckp.addAddressDetails(testData.addressBook[1]);
    await ckp.verifySaveAndSelectBtnColor(dataFile.buttonColor.backgroundColorEnabled);
    await ckp.saveAndSelectThisAddressPaymentPage();
    await ckp.reviewOrder();
    type1expectedPrice = await ckp.verifyReviewOrderItemTable(subproduct1.type1, dataFile.quantity.One);
    type2expectedPrice = await ckp.verifyReviewOrderItemTable(subproduct1.type2, dataFile.quantity.Two);
    await ckp.verifyAllImagesIsLoaded();
    await ckp.verifyReviewOrderSummarySection(type1expectedPrice + type2expectedPrice);
    await ckp.verifyShipAddressName(shippingaddress.firstName);
    await ckp.verifyShipAddressMethod(testData.shippingMethod);
    await ckp.verifyBillAddressName(billingaddress.firstName);
    await ckp.verifyPaymentMethod(testData.paymentMethod);
    await ckp.placeOrder();
    const orderConfimationPage = await OrderConfirmationPage.get();
    await orderConfimationPage.verifyOrderConfirmationPage(dataFile.orderConfirmation);
    await orderConfimationPage.verifyOrderId();
  });
});
