/*
# Copyright 2022 HCL America, Inc.
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
*/
import { Utils } from "../pages/Utils.po";
import axios from "axios";
import https = require("https");
import fs = require("fs-extra");
import userConfig from "../../tests/data/UserManagementData.json";
import envConfig from "../../../../env.config.json";
import { cloneDeep, merge } from "lodash";

axios.defaults.timeout = 60000;

const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

// Rest Helper class handle api calls
export class RestHelper {
  memberID = "";
  static readonly RUNTIME = "runtime.json";

  // reduce REST calls with cache
  readonly org2IdCache: { [key: string]: any } = {};
  readonly user2IdCache: { [key: string]: string } = {};
  readonly ffmC2IdCache: { [key: string]: string } = {};
  readonly pnStore2IdCache: { [key: string]: string } = {};

  readonly util = new Utils();
  readonly username = userConfig.admin.username;
  readonly password = userConfig.admin.password;

  readonly host = envConfig.servers[0].hostName;
  readonly port = envConfig.servers[0].portNumber;
  readonly scheme = envConfig.servers[0].schema;

  readonly auth = "Basic " + new Buffer(this.username + ":" + this.password).toString("base64");
  readonly postHeaders = { "Content-Type": "application/json", Authorization: this.auth };
  readonly getHeader = { "Accept-Encoding": "gzip, deflate, br", Accept: "*/*", Authorization: this.auth };
  readonly payload = { headers: this.getHeader, httpsAgent: agent, timeout: 60000 };
  readonly postPayload = { headers: this.postHeaders, httpsAgent: agent, timeout: 60000 };

  private getBaseURL(scheme = this.scheme, host = this.host, port = this.port) {
    return `${scheme}://${host}:${port}`;
  }

  private logAPI(method: any, api: { status: any }) {
    console.log(`   ${method}: API-status: %o`, api.status);
  }

  private logEntry(method: any) {
    console.log(`>> ${method}`);
  }

  private logExit(method: any) {
    console.log(`<< ${method}`);
  }

  private logError(method: any, error: any) {
    this.logTuples(method, "caught-error", error);
  }

  private logTuples(method: any, ...data: any[]) {
    let msg = "";
    for (let i = 0; i < data.length; i += 2) {
      const k = data[i];
      const v = data[i + 1];
      const kv = `${k}: ${v != null ? v : "<empty>"}`;
      msg = msg ? `${msg}; ${kv}` : kv;
    }
    console.log(`   ${method}: ${msg}`);
  }

  private logAPIAndOthers(m: any, api: { status: any }, ...data: any[]) {
    this.logAPI(m, api);
    this.logTuples(m, ...data);
  }

  private logPOST(m: any, url: any, body: any) {
    this.logTuples(`${m}: POST`, url, JSON.stringify(body));
  }

  private async fetchOrg(org: string) {
    const m = "fetchOrgId";
    let rc = this.org2IdCache[org] ?? undefined;

    if (!rc) {
      this.logEntry(m);
      const url = `${this.getBaseURL()}/rest/admin/v2/organizations/manageable?offset=0&limit=10&sort=organizationName&organizationName=${org}`;
      this.logTuples(m, "get", url);

      try {
        const res = await axios.get(url, this.payload);
        const items = res?.data?.items ?? [];
        const orgId = items[0]?.id ?? "";
        const memberId = items[0]?.address?.memberId ?? "";
        this.logAPIAndOthers(m, res, "org-id", orgId, "address-member-id", memberId);
        if (orgId || memberId) {
          rc = { orgId, memberId };
          this.org2IdCache[org] = rc;
        }
      } catch (e) {
        this.logError(m, e);
      }
      this.logExit(m);
    }

    return rc;
  }

  private async fetchUserId(logon: string) {
    const m = "fetchUserId";
    let rc = this.user2IdCache[logon] ?? "";

    if (!rc) {
      this.logEntry(m);

      const url = `${this.getBaseURL()}/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=${logon}`;
      this.logTuples(m, "get", url);

      try {
        const res = await axios.get(url, this.payload);
        const items = res?.data?.items ?? [];
        rc = items[0]?.address?.memberId ?? "";
        this.logAPIAndOthers(m, res, "user-id", rc);
        if (rc) {
          this.user2IdCache[logon] = rc;
        }
      } catch (e) {
        this.logError(m, e);
      }
      this.logExit(m);
    }

    return rc;
  }

  constructor() {}

  private static readRuntimeJSON() {
    let json;
    if (!fs.existsSync(RestHelper.RUNTIME) || fs.statSync(RestHelper.RUNTIME).size === 0) {
      json = {};
    } else {
      json = fs.readJsonSync(RestHelper.RUNTIME);
    }
    return json;
  }

  static writeRuntimeJSON(input: any) {
    const json = RestHelper.readRuntimeJSON();
    const output = merge(json, input);
    fs.writeJSONSync(RestHelper.RUNTIME, output);
  }

  private storePassword() {
    const dt = new Date();
    const ts = `${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}${dt.getMilliseconds()}`;
    const password = `${userConfig.user.password}${ts}`;
    RestHelper.writeRuntimeJSON({ password });
    return password;
  }

  /**
   * Used to read passowrd form runtime json
   */
  readPassword(): string {
    const json = RestHelper.readRuntimeJSON();
    return json.password;
  }

  static getAutoAdminUser(): string {
    const json = RestHelper.readRuntimeJSON();
    const rc = json.autoAdminUser ?? userConfig.user.logonId;
    return rc;
  }

  /**
   * Used to delete runtime json
   */
  deletePassword() {
    try {
      fs.unlinkSync(RestHelper.RUNTIME);
    } catch (err) {
      console.error(err);
    }
  }

  private async doRoleAssignment() {
    const statuses = [];
    const roles = [
      { org: userConfig.organizationNames.sapphireOrg, role: userConfig.roleId.registerCustomer },
      ...userConfig.roleId.buyerRole.map((r) => ({ org: userConfig.organization.organizationName, role: r })),
    ];

    for (const r of roles) {
      const status = await this.assignRole(this.memberID, r.org, r.role);
      statuses.push(status);
    }

    return statuses.every((s) => s === 201);
  }

  /**
   * Calling Create API for B2B
   * @param userObj input user object
   * @return : status code
   */
  async createUser(userObj: any) {
    const m = "createUser";
    this.logEntry(m);

    const { orgId: parentOrganizationId } = await this.fetchOrg(userConfig.organization.organizationName);
    const body = { ...userObj.user, parentOrganizationId };
    const url = `${this.getBaseURL()}/rest/admin/v2/users`;
    this.logPOST(m, url, body);
    let rc = 400;

    try {
      const res = await axios.post(url, body, this.postPayload);
      this.logAPI(m, res);
      this.memberID = await this.fetchUserId(userObj.user.logonId);
      rc = res.status;

      RestHelper.writeRuntimeJSON({ autoAdminUser: userObj.user.logonId });
    } catch (error) {
      this.logError(m, error);
    }

    this.logExit(m);
    return rc;
  }

  /**
   * Used to delete user using API
   * @param logonId : pass username
   */
  async deleteUser(logonId: string, storeId: number) {
    const m = "deleteUser";
    this.logEntry(m);
    const id = await this.fetchUserId(logonId);

    if (id) {
      this.memberID = id;
      const server = envConfig.servers[2];
      const { hostName, portNumber, schema: scheme } = server;

      const url = `${this.getBaseURL(scheme, hostName, portNumber)}/wcs/resources/store/${storeId}/person/${id}`;
      this.logTuples(m, "delete-user", url);

      const res = await axios.delete(url, this.payload);
      this.logAPI(m, res);
      delete this.user2IdCache[logonId];
    } else {
      this.logTuples(m, "user-not-found", "");
    }
    this.logExit(m);
  }

  /**
   * This runs get request to check if user is created or not if not then this function run createUser() method
   */
  async verifyUserExist(unique = false) {
    const m = "verifyUserExist";
    this.logEntry(m);

    const uniqueObj = Utils.uniqueifyObj(userConfig);
    const obj = unique ? uniqueObj : userConfig;
    const id = await this.fetchUserId(obj.user.logonId);
    let rc = 400;

    try {
      await browser.pause(5000);

      if (!id) {
        rc = await this.createUser(obj);
        if (rc !== 201) {
          rc = await this.createUser(obj);
        }
      } else {
        this.logTuples(m, "user-already-exists", "resetting password");
        this.memberID = id;
      }

      const allDone = await this.doRoleAssignment();
      if (allDone) {
        rc = await this.patchResetPasswordAPI(this.memberID);
      }
    } catch (error) {
      this.logError(m, error);
    }

    this.logExit(m);
  }

  /**
   * This runs post request to assign role
   * @param memberId : pass memeberID as string
   * @param orgName : pass Org name
   * @param roleId : pass Org role id
   */
  async assignRole(memberId: string, orgName: string, roleId: string) {
    const m = "assignRole";
    this.logEntry(m);

    const { orgId: organizationId } = await this.fetchOrg(orgName);
    const body = { ...userConfig.assignRole, memberId, organizationId, roleId };
    const url = `${this.getBaseURL()}/rest/admin/v2/role-assignments`;
    this.logPOST(m, url, body);
    let rc = 400;

    try {
      const res = await axios.post(url, body, this.postPayload);
      this.logAPI(m, res);
      rc = res.status;
    } catch (error1) {
      this.logError(m, error1);
    }

    this.logExit(m);
    return rc;
  }

  /**
   * This runs patch request for reset password ( CMC API)
   */
  async patchResetPasswordAPI(memberID: string) {
    const m = "patchResetPasswordAPI";
    this.logEntry(m);

    const password = this.storePassword();
    const body = { ...userConfig.userPassword, password, passwordVerify: password };
    const url = `${this.getBaseURL()}/rest/admin/v2/users/${memberID}`;
    this.logPOST(m, url, body);
    let rc = 400;

    try {
      const res = await axios.patch(url, body, this.payload);
      this.logAPI(m, res);
      rc = res.status;
    } catch (error) {
      this.logError(m, error);
    }
    this.logExit(m);
    return rc;
  }
  /**
   * Method is used to verify image load
   * @param imageLocator pass imageLocator as a string
   */
  async verifyImageLoadedByStyle(imageLocator: string) {
    const methodName = "RestHelper.verifyImageLoadedByStyle";
    await browser.pause(2500);
    const locator = $$(imageLocator);
    const images = await locator;

    if (images.length !== 0) {
      const server = envConfig.servers[2];
      const uri = `${server.schema}://${server.hostName}:${server.portNumber}`;
      for (const imgElement of images) {
        const style = await imgElement.getAttribute("style");
        Utils.log(methodName, "Style value for an image is -> ", style);
        if (style !== null) {
          imgElement.scrollIntoView();
          const imageUrl = style.split('"')[1];
          try {
            const response = await axios.get(`${uri}${imageUrl}`, { httpsAgent: agent });
            if (response.status != 200) {
              throw new Error("Invalid image url");
            }
          } catch (error) {
            console.log("Image API Error: " + error);
          }
        } else {
          throw new Error("Image is not loaded in product listing page");
        }
      }
    } else {
      throw new Error("Image is not loaded");
    }
  }
  /**
   * Method is used to verify image load
   * @param imageLocator pass imageLocator as a string
   */
  async verifyImageLoadedBySource(imageLocator: string) {
    const locator = $$(imageLocator);
    const images = await locator;
    const server = envConfig.servers[2];
    const uri = `${server.schema}://${server.hostName}:${server.portNumber}`;

    if (images.length !== 0) {
      for (const imgElement of images) {
        const src = await imgElement.getAttribute("src");
        if (src !== null) {
          try {
            const response = await axios.get(`${uri}${src}`, { httpsAgent: agent });
            if (response.status != 200) {
              throw new Error("Invalid image url");
            }
          } catch (error) {
            console.log("Image API Error: " + error);
          }
        } else {
          throw new Error("Image source is not found");
        }
      }
    } else {
      throw new Error("Image is not loaded");
    }
  }
  /**
   * Method is used to verify if organization is created or not if not then create and call verifyUserExist
   */
  async verifyOrganizationExist(unique = false) {
    const m = "verifyOrganizationExist";
    this.logEntry(m);

    const org = userConfig.organization.organizationName;
    const r = await this.fetchOrg(org);
    const { orgId: id } = r ?? {};
    let status = 201;

    if (!id) {
      status = await this.createOrganization();
    }

    if (status === 201) {
      await this.assignRolesApprovalsGroups(org);
      await this.verifyUserExist(unique);
    }
    this.logExit(m);
  }

  async assignRolesApprovalsGroups(org: string) {
    const { memberId } = await this.fetchOrg(org);
    this.memberID = memberId;

    const statuses = [];
    for (const r of userConfig.roleId.orgRole) {
      statuses.push(await this.assignRole(this.memberID, org, r));
    }

    if (statuses.every((s) => s === 201)) {
      statuses.splice(0, statuses.length);
      for (const a of userConfig.approvalId.orgApproval) {
        statuses.push(await this.assignApprovalType(userConfig.organization.organizationName, a));
      }
    } else {
      console.log("Not all role assignments returned 201");
    }

    if (statuses.every((s) => s === 201)) {
      statuses.splice(0, statuses.length);
      for (const g of userConfig.memberTypeId.orgGroupId) {
        statuses.push(await this.assignMemberGroup(this.memberID, g));
      }
    } else {
      console.log("Not all approval assignments returned 201");
    }

    if (statuses.every((s) => s === 201)) {
      console.log("Organization created successfully");
    } else {
      console.log("Not all member-group assignments returned 201");
    }
  }

  /**
   * Method is used to create organization
   * @returns Response from Assign Member group API
   */
  async createOrganization() {
    const m = "createOrganization";
    this.logEntry(m);

    const base = this.getBaseURL();
    const url = `${base}/rest/admin/v2/organizations?locale=en_US`;
    const body = userConfig.organization;
    this.logPOST(m, url, body);

    let rc;
    try {
      const res = await axios.post(url, body, this.postPayload);
      this.logAPI(m, res);

      if (res.status === 201) {
        rc = 201;
      } else {
        rc = 400;
      }
    } catch (error) {
      this.logError(m, error);
      rc = 400;
    }

    this.logExit(m);
    return rc;
  }

  /**
   * Method is used to assign Approval type to organization
   * @param orgName : pass organization name
   * @param approvalTypeId : pass approval type id
   * @returns postResponseAssignApprovalType status
   */
  async assignApprovalType(orgName: string, approvalTypeId: string) {
    const m = "assignApprovalType";
    this.logEntry(m);

    const { orgId: organizationId } = await this.fetchOrg(orgName);
    const body = { ...userConfig.assignApprovalType, organizationId, approvalTypeId };
    const url = `${this.getBaseURL()}/rest/admin/v2/approval-type-assignments?locale=en_US`;
    this.logPOST(m, url, body);
    let rc = 400;

    try {
      await browser.pause(1000);
      const res = await axios.post(url, body, this.postPayload);
      this.logAPI(m, res);

      rc = res.status;
    } catch (error1) {
      this.logError(m, error1);
    }

    this.logExit(m);
    return rc;
  }

  /**
   * Method is used to assign Group member to organization
   * @param memberId : pass member id
   * @param memberGroupId : pass memberGroupId
   * @returns postResponseMemberGroupType status
   */
  async assignMemberGroup(memberId: string, memberGroupId: string) {
    const m = "assignMemberGroup";
    this.logEntry(m);

    const body = { ...userConfig.assignMemberType, memberId, memberGroupId };
    const url = `${this.getBaseURL()}/rest/admin/v2/member-group-memberships?locale=en_US`;
    this.logPOST(m, url, body);

    let rc = 400;
    try {
      const res = await axios.post(url, body, this.postPayload);
      this.logAPI(m, res);
      rc = res.status;
    } catch (error1) {
      this.logError(m, error1);
    }
    this.logExit(m);
    return rc;
  }

  async getFulfillmentCenter(storeId: string, name: string) {
    const m = "getFulfillmentCenter";
    const key = `${storeId}::${name}`;
    let rc = this.ffmC2IdCache[key] ?? undefined;

    if (!rc) {
      this.logEntry(m);
      const url = `${this.getBaseURL()}/rest/admin/v2/fulfillment-centers?storeId=${storeId}&name=${name}`;
      this.logTuples(m, "get", url);

      try {
        const res = await axios.get(url, this.payload);
        const items = res?.data?.items ?? [];
        const id = items[0]?.id ?? "";
        this.logAPIAndOthers(m, res, "ffmcenter-id", id);
        if (id) {
          rc = id;
          this.ffmC2IdCache[key] = id;
        }
      } catch (e) {
        this.logError(m, e);
      }
      this.logExit(m);
    }

    return rc;
  }

  async getCEId(storeId: string, partNumber: string) {
    const m = "getCEId";
    const key = `${storeId}::${partNumber}`;
    let rc = this.pnStore2IdCache[key] ?? undefined;

    if (!rc) {
      this.logEntry(m);
      const url = `${this.getBaseURL()}/wcs/resources/store/${storeId}/catalog_entry?q=byPartNumbers&partNumber=${partNumber}`;
      this.logTuples(m, "get", url);

      try {
        const res = await axios.get(url, this.payload);
        const items = res?.data?.resultList ?? [];
        const id = items[0]?.uniqueID ?? "";
        this.logAPIAndOthers(m, res, "catentryId", id);
        if (id) {
          rc = id;
          this.pnStore2IdCache[key] = id;
        }
      } catch (e) {
        this.logError(m, e);
      }
      this.logExit(m);
    }

    return rc;
  }

  async updateOnlineInventory(storeKey: string, partNumber: string, quantity: number) {
    const m = "updateOnlineInventory";
    this.logEntry(m);
    const all: any = userConfig.allStores;
    const { id, name } = all[storeKey];
    const ffmCenterId = await this.getFulfillmentCenter(id, name);
    const ceId = await this.getCEId(id, partNumber);
    const url = `${this.getBaseURL()}/rest/admin/v2/inventories/catalogEntryId:${ceId},fulfillmentCenterId:${ffmCenterId},storeId:${id}`;

    if (ffmCenterId && ceId) {
      try {
        const body = { quantity };
        this.logPOST(m, url, body);

        const res = await axios.patch(url, body, this.postPayload);
        this.logAPI(m, res);
      } catch (e) {
        this.logError(m, e);
      }

      // Show inventory
      try {
        this.logTuples(m, "get-inventory", url);
        const res = await axios.get(url, this.payload);
        this.logAPI(m, res);

        this.logTuples(m, "inventory", res?.data?.quantity);
      } catch (e) {
        this.logError(m, e);
      }
    } else {
      this.logError(m, "Unable to find fulfillment-center id or catentyr-id to update inventory");
    }
    this.logExit(m);
  }
}
