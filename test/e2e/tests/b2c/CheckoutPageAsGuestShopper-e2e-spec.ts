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
import { MegaMenu } from "../../pageobjects/pages/MegaMenu.po";
import { ProductDetailPage } from "../../pageobjects/pages/b2c/ProductDetailPage.po";
import { ProductListingPage } from "../../pageobjects/pages/b2c/ProductListingPage.po";
import { ShoppingCartPage } from "../../pageobjects/pages/b2c/ShoppingCartPage.po";
import { ShippingDetailPage } from "../../pageobjects/pages/b2c/ShippingDetailsPage.po";
import { PaymentPage } from "../../pageobjects/pages/b2c/PaymentPage.po";
import { ReviewOrderPage } from "../../pageobjects/pages/b2c/ReviewOrderPage.po";
import { OrderConfirmationPage } from "../../pageobjects/pages/b2c/OrderConfirmationPage.po";
import configFile from "../data/UserManagementData.json";
import CATALOG from "../data/b2c/EmeraldProducts.json";
import dataFile from "../data/b2c/CheckoutPageAsGuestShopper.json";
import { Utils } from "../../pageobjects/pages/Utils.po";

describe("B2C.CheckoutPageAsGuestShopper - User views checkout page in Emerald store as a guest user", () => {
  let homepage: HomePage;
  const storeName = configFile.store;
  beforeEach(async () => {
    //GIVEN the homepage is loaded and user is not signed in
    await browser.maximizeWindow();
    await browser.url(storeName.emerald);
    //Sign out if the user is signed in
    homepage = new HomePage();
    await homepage.signOutIfSignedIn();
  });

  it("Test01 - To complete guest checkout with a product in emerald store", async () => {
    const m = "CheckoutPageAsGuestShopper.Test01";
    Utils.log(m, "To complete guest checkout with a product in emerald store");
    const testData = dataFile.test01;
    const parentcategory = CATALOG.AllCategories;
    const subcategory = CATALOG.LivingRoom.Furniture;
    const product1 = subcategory["Wooden Cafe Chair"];
    const sku1 = product1["LR-FNTR-0008-0001"];
    //GIVEN the homepage is loaded and guest users shopping cart is empty
    //AND
    //WHEN user navigates to sku page and adds a product to their cart
    const megaMenu: MegaMenu = await homepage.headerMenu(parentcategory.categoryName);
    await megaMenu.goToProductListingPage(subcategory.subCategoryName);
    const plp: ProductListingPage = await new ProductListingPage();
    const pdp: ProductDetailPage = await plp.productThumbnail(product1.productInfo.name);
    //Select product and add to cart
    await (await pdp.selectSwatch(sku1.attributes.Color)).addToCart();
    await pdp.verifyAlertMessage(dataFile.alertmsg.addcartAlertMsg);
    //View cart from confirmation modal
    const shoppingcart: ShoppingCartPage = await pdp.viewCartOnConfirmationModal();
    //verify product details on shopping cart page and promo code, order summary section
    await shoppingcart.verifyOrderItemTable(sku1, dataFile.quantity.One);
    await shoppingcart.verifyOrderSummarySection(sku1.priceOffering);
    await shoppingcart.verifyPromoCodeSection();
    const shipping: ShippingDetailPage = await shoppingcart.checkOutAsGuest();
    //WHEN user inputs all manditory and optional fields for shipping address and clicks save and select address
    Utils.log(m, "User is filling shipping address information");
    await shipping.newAddress();
    await shipping.add(testData.addressBook[0]);
    await shipping.saveAndSelect();
    //THEN wait for save&select address to disappear and shipping method to appear
    await shipping.verifySaveAndSelectNotDisplayed();
    //WHEN user selected method for shipping and clicks on continue payment
    const payment: PaymentPage = await (await shipping.selectShippingMethod(testData.shippingMethod)).continuePayment();
    await payment.selectPayOption(testData.paymentMethod);
    //WHEN user inputs all manditory and optional fields for billing address and clicks save and continue
    Utils.log(m, "User is filling billing address information");
    await payment.newAddress();
    await payment.add(testData.addressBook[1]);
    await payment.saveAndSelect();
    //THEN wait for save&select address to dissapear and review order button to enable
    await payment.verifySaveAndSelectNotDisplayed();
    const revieworder: ReviewOrderPage = await payment.reviewOrder();
    //AND
    //THEN verifies totalproducts, product details, shipaddress, payment and order summary detail
    await revieworder.verifyTotalProducts(dataFile.totalProducts.One);
    await revieworder.verifyReviewOrderItemTable(sku1, dataFile.quantity.One);
    await revieworder.verifyAllImagesIsLoaded();
    await revieworder.verifyShipAddressName(testData.addressBook[0].firstName);
    await revieworder.verifyShipAddressMethod(testData.shippingMethod);
    await revieworder.verifyBillAddressName(testData.addressBook[1].firstName);
    await revieworder.verifyPaymentMethod(testData.paymentMethod);
    //When user clicks on place order button and verify order id to be greater than 0
    const orderconfirmation: OrderConfirmationPage = await revieworder.placeOrder();
    await orderconfirmation.verifyOrderId();
    await orderconfirmation.verifyOrderConfirmationPage(dataFile.orderConfirmation);
  });
});
