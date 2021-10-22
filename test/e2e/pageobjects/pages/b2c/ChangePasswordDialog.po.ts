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
import { MyAccountPage } from './MyAccountPage.po'
import { Utils } from '../Utils.po'
import * as envConfig from '../../../../../env.config.json'

//ChangePassswordDialog class is to handle the object of change password dialog
export class ChangePassswordDialog {
  util = new Utils()
  //Change Password Dialog
  changePasswordDialogTitle = $('h2.MuiTypography-root')
  //alert message
  changePwdSuccessDialog = $('.MuiDialog-paper')
  alertMessage = '.MuiDialogContent-root'
  errorAlertMsg = 'div.MuiAlert-message'
  okButtonOnAlert = $(
    'button.MuiButtonBase-root:nth-child(2) > span:nth-child(1)'
  )
  timeoutvalue: number = envConfig.timeout.maxtimeout
  constructor () {
    browser.pause(envConfig.timeout.maxtimeout)
    this.validate()
  }
  /**
   * method to validate dialog load
   */

  validate () {
    this.changePasswordDialogTitle.waitForDisplayed()
  }
  /**
   * method to handle Ok click
   * @returns MyAccountPage()
   */

  okay (): MyAccountPage {
    this.util.handleOnClickBtn('OK')
    return new MyAccountPage()
  }
  /**
   * method to set password value
   * @param fieldName : pass field name as a string
   * @param value : pass value as a string
   */

  setDialogValue (fieldName: string, value: string) {
    const pwdSelector = "//input[@name='" + fieldName + "']"
    this.util.setValue(value, pwdSelector)
  }
  /**
   * method to save change password
   */

  save () {
    this.util.handleOnClickBtn('Save')
  }
  /**
   * method to cancel change password
   */

  cancel (): MyAccountPage {
    this.util.handleOnClickBtn('Cancel')
    return new MyAccountPage()
  }
  /**
   * method to validate alert message
   * @param expectedMsg : pass expected alert msg as a string
   */

  verifyAlertMsg (expectedMsg: string) {
    browser.pause(envConfig.timeout.maxtimeout)
    this.util.verifyDialogAlertMsg(expectedMsg, this.alertMessage)
  }
  /**
   * method to validate error message on alert
   * @param expectedMsg : pass expected alert msg as a string
   */

  verifyInvalidAlertMsg (expectedMsg: string) {
    this.util.verifyDialogAlertMsg(expectedMsg, this.errorAlertMsg)
  }
}
