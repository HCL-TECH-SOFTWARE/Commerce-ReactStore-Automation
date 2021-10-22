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
import dataFile = require('../../../tests/data/b2b/orgRegistrationPage.json')
const date = new Date()
const timeStamp =
  date.getHours().toString() +
  date.getMinutes().toString() +
  date.getSeconds().toString() +
  date.getMilliseconds().toString()
const OrgName = dataFile.test01.organizationName + timeStamp
const AdminOrgLogonID = dataFile.test01.logonId + timeStamp

//Registration Page class is used to handle the object of Registration Page
export class RegistrationPage {
  util = new Utils()
  config = require('../../../tests/data/UserManagementData.json')
  registerTextField =
    "//div[@class='MuiGrid-root sc-ezrdKe gdrbsr MuiGrid-container MuiGrid-spacing-xs-2 MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6']"
  alertMsg = "//div[@role='dialog']/div"
  errorMsg = "//div[@class='MuiAlert-message']"
  fieldLocator = "//input[@name= 'field']"
  /**
   * Used to fill the details for the register page of both buyer and organization
   * @param textBoxName : pass field name
   * @param textBoxValue : pass field value
   * @param columnNumber : pass section number
   */
  register (textBoxName: string, textBoxValue: string) {
    $("//label[text()='" + textBoxName + "']/..//div/input").setValue(
      textBoxValue
    )
  }
  /**
   * Used to click on submit button
   */
  completeRegistration () {
    this.util.handleOnClickBtn('Complete Registration')
  }
  /**
   * Used to verify alert message after registration
   * @param alertMsg : pass expected alert message
   * @param buyerAlertMsg : pass alert message locator
   */
  verifyAlertMsg (alertMsg: string, buyerAlertMsg: string) {
    this.util.verifyDialogAlertMsg(alertMsg, buyerAlertMsg)
  }
  /**
   * Used to click on Ok button
   */
  ok () {
    this.util.handleOnClickBtn('OK')
  }
  /**
   * Method is used to store and read Organization Name
   */
  readOrgID () {
    const readfile = require('../../../../../runtime.json')
    let runtime = readfile
    runtime.orgID = OrgName
    return runtime.orgID
  }
  /**
   * Method is used to store and read Admin Organization Logon ID
   */
  readAdminOrgLogonID () {
    const readfile = require('../../../../../runtime.json')
    let runtime = readfile
    runtime.adminOrgLogonID = AdminOrgLogonID
    return runtime.adminOrgLogonID
  }
  /**
   * Method is use to click on add address line 2
   */
  addAddressline2 () {
    this.util.handleOnClickBtn('Add Address Line 2')
  }
  /**
   * Method is use to click on "Next, register an administrator"
   */
  next () {
    this.util.handleOnClickBtn('Next, register an administrator')
  }
  /**
   * Method is use to click on "Back"
   */
  back () {
    this.util.handleOnClickBtn('Back')
  }
  /**
   * Method is used to clear input field value
   * @param textBoxName pass textBoxName as a string
   */
  clearValue (textBoxName: string) {
    const selector = $("//label[text()='" + textBoxName + "']/..//div/input")
    const inputValue = selector.getValue()
    const length = inputValue.length
    const backSpaces = new Array(length).fill('Backspace')
    selector.setValue(backSpaces)
  }
}
