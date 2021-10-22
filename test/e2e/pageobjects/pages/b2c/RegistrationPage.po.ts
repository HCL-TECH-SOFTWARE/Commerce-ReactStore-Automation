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

//RegistrationPage class is to handle the object of registration and sign-in page
export class RegistrationPage {
  util = new Utils()
  signInHeading = $('//h1[contains(text(),"Sign In")]')
  registerHeading = $('//h1[contains(text(),"Register")]')
  registrationform =
    "//form[@id = 'registration_form_5_sign-in-registration-page-new-registration']"
  loginform = "//div[@id = 'sectionone_sign-in-registration-page']//form"
  constructor () {
    this.signInHeading.waitForDisplayed()
  }
  /**
   * method to navigate register new user screen
   * @returns RegistrationPage()
   */
  registernow () {
    this.util.handleOnClickBtn('Register Now')
    this.registerHeading.waitForDisplayed()
  }
  /**
   * method to register a new user
   * @param textboxName : pass field name
   * @param textboxValue : pass input value
   * @returns RegistrationPage()
   */
  register (textboxName: string, textboxValue: string): RegistrationPage {
    $(
      this.registrationform + "//input[@name = '" + textboxName + "']"
    ).clearValue()
    $(
      this.registrationform + "//input[@name = '" + textboxName + "']"
    ).setValue(textboxValue)
    return this
  }
  /**
   * method to login
   * @param textboxName : pass field name
   * @param textboxValue : pass input value
   * @returns RegistrationPage()
   */
  login (textboxName: string, textboxValue: string): RegistrationPage {
    $(this.loginform + "//input[@name = '" + textboxName + "']").clearValue()
    $(this.loginform + "//input[@name = '" + textboxName + "']").setValue(
      textboxValue
    )
    return this
  }
  /**
   * method to submit register
   */
  submitRegister () {
    this.util.handleOnClickBtn('Complete Registration ')
  }
  /**
   * method to submit login
   */
  submitLogin () {
    this.util.handleOnClickBtn('Sign In')
  }
}
