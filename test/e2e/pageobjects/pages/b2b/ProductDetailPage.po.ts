/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 1996, 2020
 *
 *--------------------------------------------------
 */
import { Utils } from '../Utils.po'
import * as envConfig from '../../../../../env.config.json'
import { RestHelper } from '../../base/RestHelper'

//Product Detail Page Page class is used to handle the object of Product Detail Page
export class ProductDetailPage {
  util = new Utils()
  helper = new RestHelper()
  productName = $("//h4[@itemprop = 'name']")
  productSKU = $("//p[contains(text(), 'SKU')]")
  shortDescription = $("//p[@itemprop = 'description']")
  productOfferPrice = $("//h5/span[@class='product-price']")
  productDisplayPrice = $("//h5/span[@class='strikethrough']")
  productLongDescription = $("//div[@role='tabpanel']/div")
  productSubtypeQuantity = $("//tbody[@class='MuiTableBody-root']")
  pleaseSignInToShop = $("//a/span[@class='MuiButton-label']")
  sign_in = $("//h1[text()='Sign In']")
  addToCurrent_Order = $("//button/span[text()='Add to Current Order']")
  addToCartAlertMessage = "//div[@class='MuiAlert-message']/span"
  productQuantityIncrement = $('.react-numeric-input > b:nth-child(2)')
  productQuantityDecrement = $('.react-numeric-input > b:nth-child(3)')
  inventoryAvailability = $('div.inventory-status in-stock')
  addToCartConfirmation = 'div.MuiAlert-message'
  viewcartLink = $('/html/body/div[1]/div/div/div[1]/div/div/div[2]/span/a')
  outofStock = "//span[text()='Out of Stock']"
  productImages =
    "//div[contains(@class, 'product-image')]//img[@itemprop='image']"
  /**
   * used to validate product name , product sku , product description
   */
  validate () {
    this.productName.waitForDisplayed()
    this.productSKU.waitForDisplayed()
    this.shortDescription.waitForDisplayed()
  }
  /**
   * Used to verfiy Product Information
   * @param subproduct : pass json array of child of subproduct from sappireproduct.json
   */
  verifyProductInfo (subproduct: object) {
    for (let [key, value] of Object.entries(subproduct)) {
      if (key !== 'subproduct') {
        //console.log(key + ":" +value)
        switch (key) {
          case 'name':
            expect(this.productName.getText()).toMatch(
              value,
              'Product name not matches'
            )
            break
          case 'sku':
            expect(this.productSKU.getText()).toBe(value, 'SKU not matches')
            break
          case 'shortDescription':
            expect(this.shortDescription.getText()).toBe(
              value,
              'Short Description not matches'
            )
            break
          case 'longDescription':
            expect(this.productLongDescription.getText()).toBe(
              value,
              'Long Description price not matches'
            )
            break
          case 'numberofsubtype':
            const int = Number(value)
            expect(this.productSubtypeQuantity.$$('.//tr').length).toBe(
              int,
              'Sub Product quantity not matches'
            )
            break
        }
      }
    }
  }
  /**
   * Used to verify sub product type
   * @param productInfo : json object of sub product type 1/type 2 from sappireproduct.json
   */
  verifySubProdcutType (productInfo: object) {
    let subcategories: string[] = Object.keys(productInfo)
    console.log(subcategories)
    let skuValue
    let count = -1
    for (let [key, value] of Object.entries(productInfo)) {
      count++
      if (key == 'sku') {
        skuValue = this.productSubtypeQuantity
          .$(".//tr/td[@value='" + value + "']")
          .getAttribute('value')
        expect(skuValue).toBe(
          value,
          key + ' value is not matches with expected '
        )
        console.log('Pass =' + key)
      }
      if (key !== 'quantity' && key !== 'sku') {
        {
          const text = this.productSubtypeQuantity
            .$(
              ".//tr/td[@value='" +
                skuValue +
                "']/following-sibling::td[" +
                count +
                ']'
            )
            .getText()
          expect(text).toBe(value, key + ' value is not matches with expected ')
          console.log('Pass =' + key)
        }
      }
    }
  }
  /**
   * Used to verify quantity column is disabled
   * @param skuName : pass skuName as string
   */
  verifyQuantityIsDisabled (skuName: string) {
    const selector = $(
      "//table[@class='MuiTable-root']/tbody/tr/td[text()='" +
        skuName +
        "']/following-sibling::td[5]//input[@type='text']"
    )
    const isEnabled = selector.isEnabled()
    if (!isEnabled)
      expect(isEnabled).toMatch('false', 'Quantity is not disabled')
    console.log('Qunatity is disabled :Pass')
  }
  /**
   * Used to set quality with skuname
   * @param skuName : pass skuname as string
   * @param numberOfQunatity : pass quantity as number
   */
  quantity (skuName: string, numberOfQunatity: number) {
    const selector = $(
      "//table[@class='MuiTable-root']/tbody/tr/td[text()='" +
        skuName +
        "']/following-sibling::td[5]//input[@type='text']"
    )
    browser.waitUntil(() => selector.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Qunatity for' + skuName + ' is not displayed'
    })
    selector.scrollIntoView()
    const isEnabled = selector.isEnabled()
    if (isEnabled) {
      selector.setValue(numberOfQunatity)
    }
  }
  /**
   * Used to click on pleasesingintoshop button
   */
  pleaseSignIntoShop () {
    const IsEnabled = this.pleaseSignInToShop.isEnabled()
    expect(IsEnabled).toBe(true, 'Please Sing in to shop button is not enabled')
    if (IsEnabled) {
      this.pleaseSignInToShop.click()
    }
  }
  /**
   * Used to verify sing in page displayed
   */
  verifySignInPage () {
    this.sign_in.waitForDisplayed()
    expect(this.sign_in.isDisplayed()).toBe(
      true,
      'Sign in / register page is not displayed'
    )
  }
  /**
   * Used to click on addtoCurrentOrder button
   */
  addToCurrentOrder () {
    browser.waitUntil(() => this.addToCurrent_Order.isDisplayed() === true, {
      timeout: envConfig.timeout.maxtimeout,
      timeoutMsg: 'Add to current order button is not displayed'
    })
    this.addToCurrent_Order.click()
  }
  /**
   * Used to verify Alert Message
   * @param expectedMsg : pass expected message
   */
  verifyAlertMessage (expectedMsg: string) {
    this.util.verifyDialogAlertMsg(expectedMsg, this.addToCartAlertMessage)
  }
  /**
   * Used to cick on  view cart link from alert message
   */
  viewCartFromAlertMessage () {
    browser.waitUntil(
      () => $(this.addToCartAlertMessage + '//a').isDisplayed() === true,
      {
        timeout: envConfig.timeout.maxtimeout,
        timeoutMsg: 'Add to cart Alert Message is not displayed'
      }
    )
    $(this.addToCartAlertMessage + '//a').click()
  }
}
