import { RestHelper } from '../pageobjects/base/RestHelper'
import configFile = require('./data/UserManagementData.json')
import dataFile = require('../tests/data/b2b/buyerRegistrationPage.json')
describe('Post Test - Delete User using API', function () {
  const storeName = configFile.store
  afterEach(function () {
    browser.deleteAllCookies()
    browser.execute(() => localStorage.clear())
    browser.execute(() => sessionStorage.clear())
  })
  it('Post Test - Delete User Using Already Exist Organization', function () {
    console.log('Post Test - Delete User Using Already Exist Organization')
    const helper = new RestHelper()
    helper.deleteUser(configFile.user.logonId, configFile.store.sapphireId) //wcsautomationadmin
    helper.deleteUser(dataFile.test01.logonId, configFile.store.sapphireId) //Delete Buyer Registration user
    helper.deletePassword()
    browser.url(storeName.sappire)
  })
})
