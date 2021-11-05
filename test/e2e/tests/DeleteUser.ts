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
