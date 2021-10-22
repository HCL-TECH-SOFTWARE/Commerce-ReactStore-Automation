/*
 *--------------------------------------------------
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 2020, 2021
 *
 *--------------------------------------------------
 */
import { Utils } from '../Utils.po'
import { ShoppingCartPage } from './ShoppingCartPage.po'
import * as envConfig from '../../../../../env.config.json'
import { RestHelper } from '../../base/RestHelper'

//ProductDetailPage class is to handle the object of product detail page
export class ProductDetailPage {
  util = new Utils()
  helper = new RestHelper()
  categoryBreadcrumb = "//li[@class='MuiBreadcrumbs-li'][1]"
  plpBreadcrumb = "//li[@class='MuiBreadcrumbs-li'][2]"
  productName = $("//h4[@itemprop = 'name']")
  productSKU = $("//p[contains(text(), 'SKU')]")
  colorSwatch = $$("//div[@aria-label='Color']//button")
  productQuantityIncrement = $('.react-numeric-input > b:nth-child(2)')
  productQuantityDecrement = $('.react-numeric-input > b:nth-child(3)')
  addToCartConfirmation = 'div.MuiAlert-message'
  viewcartLink = $("//a[text() = 'View Cart']")
  quantityValue = "//p[text()='Quantity']//following-sibling::p/span/input"
  imagesList = "//img[@itemprop='image']"
  constructor () {
    this.validate()
  }
  /**
   * method to validate page load
   */
  validate () {
    this.productName.waitForDisplayed()
    this.productSKU.waitForDisplayed()
  }
  /**
   * method to add item into cart
   * @returns ProductDetailPage()
   */
  addToCart (): ProductDetailPage {
    this.util.handleOnClickBtn('Add to cart')
    return this
  }
  /**
   * method to navigate cart page
   * @returns ShoppingCartPage()
   */
  viewCartOnConfirmationModal (): ShoppingCartPage {
    this.viewcartLink.click()
    return new ShoppingCartPage()
  }
  /**
   * Used to set quality with skuname
   * @param skuName : pass skuname as string
   * @param numberOfQuantity : pass quantity as number
   */
  quantity (numberOfQuantity: number) {
    $(this.quantityValue).scrollIntoView()
    browser.waitUntil(() => $(this.quantityValue).isEnabled() === true, {
      timeout: envConfig.timeout.midtimeout,
      timeoutMsg: 'child category is not displayed in menu'
    })
    $(this.quantityValue).setValue(numberOfQuantity)
    return this
  }
  /**
   * method to increase item quantity
   * @returns ProductDetailPage()
   */
  quantityIncrement (): ProductDetailPage {
    this.productQuantityIncrement.click()
    return this
  }
  /**
   * method to decrease item quantity
   * @returns ProductDetailPage()
   */
  quantityDecrement (): ProductDetailPage {
    this.productQuantityDecrement.click()
    return this
  }
  /**
   * method to select swatch on product detail page
   * @param color pass color name as a string
   */
  selectSwatch (color: string): ProductDetailPage {
    console.log('Swatch to select :' + color.toLowerCase())
    const swatchSelector =
      "//button[contains(@style,'" + color.toLowerCase() + "')]"
    $(swatchSelector).click()
    return this
  }
  /**
   * method to validate alert message
   * @param msg : pass expected message as a string
   */
  verifyAlertMessage (msg: string) {
    this.util.verifyDialogAlertMsg(msg, this.addToCartConfirmation)
  }
  /**
   * Method is used to verify image loaded properly on PDP
   * @returns ProductDetailPage()
   */
  verifyImagesIsLoaded () {
    browser.pause(envConfig.timeout.midtimeout)
    this.helper.verifyImageLoadedBy('src', this.imagesList)
    return this
  }
  /**
   * Method is used to navigate product listing page via breadcrumb
   */
  navigateToPLP () {
    $(this.plpBreadcrumb).scrollIntoView()
    $(this.plpBreadcrumb).click()
  }
  /**
   * Method is used to navigate product listing page
   */
  navigateToCategory () {
    $(this.categoryBreadcrumb).scrollIntoView()
    $(this.categoryBreadcrumb).click()
  }
}
