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
import { RestHelper } from '../pageobjects/base/RestHelper'
import configFile = require('./data/UserManagementData.json')
import envConfig = require('../../../env.config.json')
import { Utils } from '../pageobjects/pages/Utils.po'
describe('Pre Test - Create User using API', function () {
  const storeName = configFile.store
  const helper = new RestHelper()
  const utils = new Utils()
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })

  it('Pre Test - Create Organization and Admin User', function () {
    console.log('Pre Test - Create Organization and Admin User')
    helper.verifyOrganizationExist()
    utils.url(storeName.sappire)
  })
})
