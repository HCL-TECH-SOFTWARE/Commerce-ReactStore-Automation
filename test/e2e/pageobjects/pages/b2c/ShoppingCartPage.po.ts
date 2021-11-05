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
import { ShippingDetailPage } from './ShippingDetailsPage.po'
import { Utils } from '../Utils.po'
import { RestHelper } from '../../base/RestHelper'

//ShoppingCartPage class is to handle the object of shopping cart page
export class ShoppingCartPage {
  util = new Utils()
  helper = new RestHelper()
  shoppingCartHeading = "//h1[text() = 'Shopping Cart']"
  productTable = "//tbody[@class = 'MuiTableBody-root']"
  totalProducts = $$("//img[@class = 'MuiAvatar-img']")
  //Promo code
  promoCodeHeading = $("//h6[contains(text(),'Promo Code')]")
  promoCodeLabel = $("//label[@id='cart_input_promocode-label']")
  promoCodeInput = $("//input[@id='cart_input_promocode']")
  promoCodeApply = $("//button[@id='cart_link_2_promocode']")
  //button
  checkoutButton = $("//span[contains(text(), 'Checkout')]")
  //Order Summary
  orderSummaryHeading = "//h6[contains(text(),'Order Summary')]"
  orderSummaryTotalHeading = $("//h6[contains(text(),'Total')]")
  orderSummarySubTotalPrice = $(
    "//p[contains(text(),'Subtotal')]/parent::div/following-sibling::div[1]/p"
  )
  //product images
  productImageList = 'img.MuiAvatar-img'
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    $(this.shoppingCartHeading).waitForDisplayed()
  }
  /**
   * method to validate number of products loaded on cart page
   * @param expectedRows : expected number of products as a number
   * @returns ShoppingCartPage()
   */
  verifyNumberOfProductsLoaded (expectedRows: number): ShoppingCartPage {
    var totalProductRows = this.totalProducts.length
    console.log('total number of products loaded ' + totalProductRows)
    expect(totalProductRows).toEqual(
      expectedRows,
      'number of product loaded not matches'
    )
    return this
  }
  /**
   * method to verify order item table
   * @param sku : sku as a json object from emeraldproduct.json
   * @param quantity : pass quantity as a number
   */
  verifyOrderItemTable (sku: object, quantity: number) {
    let skuName
    let skuPrice
    for (let [key, value] of Object.entries(sku)) {
      if (key == 'sku') {
        skuName = value
      }
      if (key == 'priceOffering') {
        skuPrice = value
      }
    }
    const actualSkuName = this.productTable + "//p[text()='" + skuName + "']"
    expect($(actualSkuName).getText()).toBe(
      'SKU: ' + skuName,
      'In Shopping cart , expected order item is not present'
    )
    expect($(actualSkuName + '//..//following-sibling::td[1]').getText()).toBe(
      'In Stock',
      'In Shopping cart - Stock is not available'
    )
    expect(
      $(actualSkuName + '//..//following-sibling::td[2]/p//input').getAttribute(
        'value'
      )
    ).toBe(quantity.toString(), 'In Shopping cart - Quantity does not matches')
    const expectedPrice = quantity * skuPrice
    expect(
      $(actualSkuName + '//..//following-sibling::td[3]/p').getText()
    ).toContain('$' + expectedPrice, '')
    expect(
      $(
        actualSkuName + '//..//following-sibling::td[4]/div/button'
      ).getAttribute('title')
    ).toBe('Delete', 'In Shopping cart -  Delete cart action not available')
  }
  /**
   * method to verify Promo code section
   */
  verifyPromoCodeSection () {
    expect(this.promoCodeHeading.getText()).toBe(
      'Promo Code',
      'Promo Code Heading is not available'
    )
    expect(this.promoCodeLabel.isDisplayed()).toBe(
      true,
      "Promo code label 'Enter Your Promo Code' - is not displayed"
    )
    expect(this.promoCodeInput.isDisplayed()).toBe(
      true,
      'Promo code text field is not displayed'
    )
    expect(this.promoCodeApply.isDisplayed()).toBe(
      true,
      'Promo code - Apply button is not displayed'
    )
  }
  /**
   * method to verify Order Summary section
   * @param totalPrice Pass total price as number
   */
  verifyOrderSummarySection (totalPrice: number) {
    expect($(this.orderSummaryHeading).getText()).toBe(
      'Order Summary',
      'Order Summary Heading is not displayed'
    )
    expect(this.orderSummaryTotalHeading.getText()).toBe(
      'Total',
      'Total Heading is not displayed'
    )
    expect(this.orderSummarySubTotalPrice.getText()).toContain(
      totalPrice.toString(),
      ' Total Price  ' + totalPrice + ' is different -Fail '
    )
  }
  /**
   * method to navigate shipping detail page
   * @returns ShippingDetailPage()
   */
  checkOut (): ShippingDetailPage {
    expect(this.checkoutButton.isClickable()).toBe(
      true,
      'checkout button is not clickable'
    )
    this.util.handleOnClickBtn('Checkout')
    return new ShippingDetailPage()
  }
  /**
   * Method is used to add the quantity on shopping cart
   * @param skuName : pass subcategory Name
   */
  quantityIncrement (subcategoryName: string) {
    const selector =
      this.productTable +
      "//a[text()='" +
      subcategoryName +
      "']/../..//following-sibling::td[2]//span/input//../b[1]"
    $(selector).click()
  }
  /**
   * Method is used to reduce the quantity on shopping cart
   * @param skuName : pass subcategory Name
   */
  quantityDecrement (subcategoryName: string) {
    const selector =
      this.productTable +
      "//a[text()='" +
      subcategoryName +
      "']/../..//following-sibling::td[2]//span/input//../b[2]"
    $(selector).click()
  }
  /**
   * Method is used to verify image loaded properly on Cart Page
   * @returns ShoppingCartPage()
   */
  verifyAllImagesIsLoaded () {
    this.helper.verifyImageLoadedBy('src', this.productImageList)
    return this
  }
}
