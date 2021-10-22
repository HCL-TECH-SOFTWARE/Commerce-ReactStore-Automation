/*
*-----------------------------------------------------------------
•	Licensed Materials - Property of HCL Technologies
•	
•	
•	HCL Commerce
•	
•	(C) Copyright HCL Technologies Limited 2020, 2021
•	
*-----------------------------------------------------------------
*/
import { Utils } from '../Utils.po'
import { OrderConfirmationPage } from './OrderConfirmationPage.po'
import { RestHelper } from '../../base/RestHelper'
import * as envConfig from '../../../../../env.config.json'

//ReviewOrderPage class is to handle the object of review order page
export class ReviewOrderPage {
  util = new Utils()
  helper = new RestHelper()
  productTable = "//tbody[@class = 'MuiTableBody-root']"
  //cart details
  totalProducts = $$("//tbody[@class = 'MuiTableBody-root']//tr")
  //Shiping detais
  shippingAddressNickName =
    "//h5[text()='Shipping Address']//..//..//following-sibling::div/p[1]"
  shippingAddressMethod =
    "//h5[text()='Shipping Method']//..//..//following-sibling::div/p"
  //payment details
  billingAddressNickName =
    "//h5[text()='Billing Address']//..//..//following-sibling::div/p[1]"
  paymentMethod =
    "//h5[text()='Payment Method']//..//..//following-sibling::div/p[1]"
  //Order summary
  placeorderButton = "//span[contains(text(),'Place Order')]"
  productImages = 'img.MuiAvatar-img'
  /**
   * method to validate total products display
   * @param expectedCount : pass expected count as a number
   * @returns ReviewOrderPage()
   */
  verifyTotalProducts (expectedCount: number): ReviewOrderPage {
    expect(this.totalProducts.length).toBe(
      expectedCount,
      'number of products not matches'
    )
    return this
  }
  /**
   * method to validate shipping address name display
   * @param expectedNickName : pass expected name
   * @returns ReviewOrderPage()
   */
  verifyShipAddressName (expectedNickName: string): ReviewOrderPage {
    $(this.shippingAddressNickName).scrollIntoView()
    this.util.verifyText(
      expectedNickName,
      this.shippingAddressNickName,
      'ship address name'
    )
    return this
  }
  /**
   * method to validate shipping address method display
   * @param expectedMethod : pass expected method as a string
   * @returns ReviewOrderPage()
   */
  verifyShipAddressMethod (expectedMethod: string): ReviewOrderPage {
    $(this.shippingAddressMethod).scrollIntoView()
    this.util.verifyText(
      expectedMethod,
      this.shippingAddressMethod,
      'ship method'
    )
    return this
  }
  /**
   * method to validate billing address name display
   * @param expectedName : pass expected name as a string
   * @returns ReviewOrderPage()
   */
  verifyBillAddressName (expectedName: string): ReviewOrderPage {
    $(this.billingAddressNickName).scrollIntoView()
    this.util.verifyText(
      expectedName,
      this.billingAddressNickName,
      'bill address'
    )
    return this
  }
  /**
   * method to validate payment method display
   * @param expectedMethod : pass expected method as a string
   * @returns ReviewOrderPage()
   */
  verifyPaymentMethod (expectedMethod: string): ReviewOrderPage {
    $(this.paymentMethod).scrollIntoView()
    this.util.verifyText(expectedMethod, this.paymentMethod, 'payment method')
    return this
  }
  /**
   * method to place order
   * @returns OrderConfirmationPage()
   */
  placeOrder (): OrderConfirmationPage {
    $(this.placeorderButton).scrollIntoView()
    this.util.handleOnClickBtn('Place Order')
    return new OrderConfirmationPage()
  }
  /**
   * method to verify order item table
   * @param sku : sku as a json object from emeraldproduct.json
   * @param quantity : pass expected quantity as a number
   */
  verifyReviewOrderItemTable (sku: object, quantity: number): ReviewOrderPage {
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
    browser.pause(envConfig.timeout.lowtimeout)
    var actualSkuName = this.productTable + "//p[text()='" + skuName + "']"
    expect($(actualSkuName).getText()).toBe(
      'SKU: ' + skuName,
      'In Review order page , expected order item is not present'
    )
    expect($(actualSkuName + '//..//following-sibling::td[1]').getText()).toBe(
      'In Stock',
      'In Shopping cart - Stock is not available'
    )
    expect(
      $(actualSkuName + '//..//following-sibling::td[2]/p').getText()
    ).toBe(quantity.toString(), 'In Shopping cart - Quantity does not matches')
    expect(
      $(actualSkuName + '//..//following-sibling::td[3]/p').getText()
    ).toContain('$' + skuPrice, 'Price is not match')
    return this
  }
  /**
   * Method is used to verify image loaded properly on Review Order Page
   * @returns ReviewOrderPage()
   */
  verifyAllImagesIsLoaded () {
    this.helper.verifyImageLoadedBy('src', this.productImages)
    return this
  }
}
