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
import { Utils } from '../pages/Utils.po'
import axios from 'axios'
import https = require('https')
import fs = require('fs')
const userConfig = require('../../tests/data/UserManagementData')
const envConfig = require('../../../../env.config.json')

axios.defaults.timeout = 60000

const date = new Date()
const timeStamp =
  date.getHours().toString() +
  date.getMinutes().toString() +
  date.getSeconds().toString() +
  date.getMilliseconds().toString()
const verifyPassword = userConfig.user.password + timeStamp
const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
})

// Rest Helper class handle api calls
export class RestHelper {
  util = new Utils()
  memberID = ''
  username = userConfig.admin.username
  password = userConfig.admin.password
  hostname = envConfig.servers[0].hostName
  portnumber = envConfig.servers[0].portNumber
  schema = envConfig.servers[0].schema
  CSRMemberID = ''
  auth =
    'Basic ' +
    Buffer.from(this.username + ':' + this.password).toString('base64')
  postheaders = {
    'Content-Type': 'application/json',
    Authorization: this.auth
  }
  getHeader = {
    'Accept-Encoding': 'gzip, deflate, br',
    Accept: '*/*',
    Authorization: this.auth
  }
  /**
   * Used to store password to runtime json
   */
  storePassword () {
    const json = {
      password: verifyPassword
    }
    fs.writeFileSync('runtime.json', JSON.stringify(json))
  }
  /**
   * Used to read passowrd form runtime json
   */
  readPassword (): string {
    const readfile = require('../../../../runtime.json')
    return readfile.password
  }
  /**
   * Used to delete runtime json
   */
  deletePassword () {
    const path = 'runtime.json'
    try {
      fs.unlinkSync(path)
    } catch (err) {
      console.error(err)
    }
  }
  /**
   * Calling Create API for B2B
   * @return : status code
   */
  createUser () {
    this.storePassword()
    console.log('#####Create User Function Started#####')
    let parentOrgID = ''
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const postheaders = {
      'Content-Type': 'application/json',
      Authorization: auth
    }
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    console.log(
      `#To Get the Org ID =` +
        this.schema +
        `://` +
        this.hostname +
        `:` +
        this.portnumber +
        `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
        userConfig.organization.organizationName +
        `&sort=organizationName`
    )
    return axios
      .get(
        this.schema +
          `://` +
          this.hostname +
          `:` +
          this.portnumber +
          `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
          userConfig.organization.organizationName +
          `&sort=organizationName`,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_OrgID => {
        console.log(
          '#Response status of Org ID Get API : ' + getResponse_OrgID.status
        )
        console.log(
          '#Parent Organization Id : ' + getResponse_OrgID.data.items[0].id
        )
        parentOrgID = getResponse_OrgID.data.items[0].id
        let postRequestCreateUser = userConfig.user
        postRequestCreateUser.parentOrganizationId = parentOrgID
        if (getResponse_OrgID.status !== 200) this.createUser()
        console.log(
          `#To Create User =` +
            this.schema +
            `://` +
            this.hostname +
            `:` +
            this.portnumber +
            `/rest/admin/v2/users`
        )
        return axios.post(
          this.schema +
            `://` +
            this.hostname +
            `:` +
            this.portnumber +
            `/rest/admin/v2/users`,
          postRequestCreateUser,
          {
            headers: postheaders,
            httpsAgent: agent,
            timeout: axios.defaults.timeout
          }
        )
      })
      .then(postResponseCreateUser => {
        console.log(
          'Response Status of Create User Post API : ' +
            postResponseCreateUser.status
        )
        console.log(
          `#To Get the Member ID  :` +
            this.schema +
            `://` +
            this.hostname +
            `:` +
            this.portnumber +
            `/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=` +
            userConfig.user.logonId
        )
        return axios.get(
          this.schema +
            `://` +
            this.hostname +
            `:` +
            this.portnumber +
            `/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=` +
            userConfig.user.logonId,
          {
            headers: getHeader,
            httpsAgent: agent,
            timeout: axios.defaults.timeout
          }
        )
      })
      .then(getResponse_MemberId => {
        console.log(
          '#Response status of Memeber ID API : ' + getResponse_MemberId.status
        )
        console.log(
          '#MemberId : ' + getResponse_MemberId.data.items[0].address.memberId
        )
        this.memberID = getResponse_MemberId.data.items[0].address.memberId
        return this.assignRole(
          this.memberID,
          userConfig.organizationNames.sapphireOrg,
          userConfig.roleId.registerCustomer
        )
          .then(response => {
            if (response == 201) {
              let status
              userConfig.roleId.buyerRole.forEach((element: number) => {
                status = this.assignRole(
                  this.memberID,
                  userConfig.organization.organizationName,
                  element
                )
              })
              return status
            }
          })
          .then(response => {
            console.log(
              '#Retun Response from Assign Role Method for Root Organization - Buyer Buy Side :' +
                response
            )
            if (response == 201) {
              return this.patchResetPasswordAPI(this.memberID)
            }
          })
      })
      .catch(error => {
        console.log('#PostResponseCreateUser Error :' + error)
      })
  }
  /**
   * Used to delete user using API
   * @param logonId : pass username
   */
  deleteUser (logonId: string, storeId: number) {
    console.log(logonId)
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    axios
      .get(
        this.schema +
          `://` +
          this.hostname +
          `:` +
          this.portnumber +
          `/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=` +
          logonId,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_MemberId => {
        console.log('Response status: ' + getResponse_MemberId.status)
        if (getResponse_MemberId.data.items !== null) {
          this.memberID = getResponse_MemberId.data.items[0].address.memberId
          this.hostname = envConfig.servers[2].hostName
          this.portnumber = envConfig.servers[2].portNumber
          const url =
            this.hostname +
            `:` +
            this.portnumber +
            `/wcs/resources/store/` +
            storeId +
            `/person/` +
            this.memberID
          console.log(url)
          axios
            .delete(
              this.schema +
                `://` +
                this.hostname +
                `:` +
                this.portnumber +
                `/wcs/resources/store/` +
                storeId +
                `/person/` +
                this.memberID,
              {
                headers: getHeader,
                httpsAgent: agent,
                timeout: axios.defaults.timeout
              }
            )
            .then(deleteUserResponse => {
              console.log('#DeleteUserResponse', deleteUserResponse.data)
            })
        } else {
          console.log('User not found')
        }
      })
  }
  /**
   * This runs get request to check if user is created or not if not then this function run createUser() method
   */
  verifyUserExist () {
    console.log('#####Verify User Exist Started#####')
    const self = this
    self.storePassword()
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    console.log(
      `#To Get Memeber ID from verify user exist =` +
        self.schema +
        `://` +
        self.hostname +
        `:` +
        self.portnumber +
        `/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=` +
        userConfig.user.logonId
    )
    axios
      .get(
        self.schema +
          `://` +
          self.hostname +
          `:` +
          self.portnumber +
          `/rest/admin/v2/users/manageable?offset=0&limit=10&sort=loginId&searchString=` +
          userConfig.user.logonId,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_MemberId => {
        console.log(
          '#Response status Of Get Member ID API from verify user exist : ' +
            getResponse_MemberId.status
        )
        console.log('#Member ID = ' + getResponse_MemberId.data.items)
        browser.pause(envConfig.timeout.lowtimeout)
        if (getResponse_MemberId.data.items === null) {
          return this.createUser().then(res => {
            if (res !== 200) return this.createUser()
          })
        } else {
          console.log(
            '#####User is already created, resetting the password#####'
          )
          this.memberID = getResponse_MemberId.data.items[0].address.memberId
          return this.assignRole(
            this.memberID,
            userConfig.organizationNames.sapphireOrg,
            userConfig.roleId.registerCustomer
          )
            .then(response => {
              let status_code
              if (response == 201) {
                userConfig.roleId.buyerRole.forEach((element: number) => {
                  status_code = this.assignRole(
                    this.memberID,
                    userConfig.organization.organizationName,
                    element
                  )
                })
                return status_code
              }
            })
            .then(response => {
              console.log('#Return Response from Assign Role :' + response)
              if (response == 201) {
                return this.patchResetPasswordAPI(this.memberID)
              }
            })
        }
      })
      .catch(error => {
        console.log(
          '#getResponse_MemberId.data.items ************* ---- Error : ' + error
        )
      })
    console.log('****')
  }
  /**
   * This runs post request to assign role
   * @param memberID : pass memeberID as string
   * @param orgName : pass Org name
   * @param orgRole : pass Org role id
   */
  assignRole (memberID: string, orgName: string, orgRole: number) {
    console.log('#####Assign Role Method#####')
    let parentOrgID = ''
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    const postheaders = {
      'Content-Type': 'application/json',
      Authorization: auth
    }
    console.log(
      `#To Get Org ID = ` +
        this.schema +
        `://` +
        this.hostname +
        `:` +
        this.portnumber +
        `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
        orgName +
        `&sort=organizationName`
    )
    return axios
      .get(
        this.schema +
          `://` +
          this.hostname +
          `:` +
          this.portnumber +
          `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
          orgName +
          `&sort=organizationName`,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_OrgID => {
        console.log(
          '#Response status of Org ID API : ' + getResponse_OrgID.status
        )
        console.log(
          '#Parent Organization Id : ' + getResponse_OrgID.data.items[0].id
        )
        parentOrgID = getResponse_OrgID.data.items[0].id
        let postRequestAssignRole = userConfig.assignRole
        postRequestAssignRole.memberId = memberID
        postRequestAssignRole.organizationId = parentOrgID
        postRequestAssignRole.roleId = orgRole
        console.log('#PostRequestAssignRole', postRequestAssignRole)
        console.log(
          '#To Assign Role=' +
            this.schema +
            '://' +
            this.hostname +
            ':' +
            this.portnumber +
            '/rest/admin/v2/role-assignments'
        )
        return axios.post(
          this.schema +
            '://' +
            this.hostname +
            ':' +
            this.portnumber +
            '/rest/admin/v2/role-assignments',
          postRequestAssignRole,
          {
            headers: postheaders,
            httpsAgent: agent,
            timeout: axios.defaults.timeout
          }
        )
      })
      .then(postResponseAssignRole => {
        console.log(
          '#Response Status of Assign Role : ',
          postResponseAssignRole.status
        )
        return postResponseAssignRole.status
      })
      .catch(error1 => {
        console.log('#Assign Role- Error : ' + error1)
      })
  }
  /**
   * This runs patch request for reset password ( CMC API)
   */
  patchResetPasswordAPI (memberID: string) {
    console.log('##### Reset Password Method#####')
    this.storePassword()
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    let patchRequestForResetPassword = userConfig.userPassword
    patchRequestForResetPassword.password = this.readPassword()
    patchRequestForResetPassword.passwordVerify = this.readPassword()
    console.log(
      `#To Reset the Password  :` +
        this.schema +
        `://` +
        this.hostname +
        ':' +
        this.portnumber +
        '/rest/admin/v2/users/' +
        this.memberID
    )
    return axios
      .patch(
        this.schema +
          `://` +
          this.hostname +
          ':' +
          this.portnumber +
          '/rest/admin/v2/users/' +
          memberID,
        patchRequestForResetPassword,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(patchResponse => {
        console.log(
          '#Response Status of Reset Password API :' + patchResponse.status
        )
        return patchResponse.status
      })
      .catch(error => {
        console.log('#ResetPassoword- Error : ' + error)
      })
  }
  /**
   * Method is used to verify image load
   * @param attribute pass load by attribute as a string
   * @param imageLocator pass imageLocator as a string
   */
  verifyImageLoadedBy (attribute: string, imageLocator: string) {
    let imageUrl = ''
    if ($$(imageLocator).length !== 0) {
      $$(imageLocator).forEach(imgElement => {
        if (
          imgElement.getAttribute(attribute) !== null &&
          attribute == 'style'
        ) {
          imgElement.scrollIntoView()
          imageUrl =
            envConfig.servers[2].schema +
            `://` +
            envConfig.servers[2].hostName +
            `:` +
            envConfig.servers[2].portNumber +
            imgElement.getAttribute(attribute).split('"')[1]
        } else if (
          imgElement.getAttribute(attribute) !== null &&
          attribute == 'src'
        ) {
          imageUrl =
            envConfig.servers[2].schema +
            `://` +
            envConfig.servers[2].hostName +
            `:` +
            envConfig.servers[2].portNumber +
            imgElement.getAttribute(attribute)
        }
        axios
          .get(imageUrl, { httpsAgent: agent })
          .then(response => {
            if (response.status != 200) {
              throw new Error('Invalid image url')
            }
          })
          .catch(error => {
            console.log('Image API Error: ' + error)
          })
      })
    }
  }
  /**
   * Method is used to verify if organization is created or not if not then create and call verifyUserExist
   */
  verifyOrganizationExist () {
    let self = this
    self.storePassword()
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    console.log(
      `#To Get Memeber ID =` +
        self.schema +
        `://` +
        self.hostname +
        `:` +
        self.portnumber +
        `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
        userConfig.organization.organizationName +
        `&sort=organizationName`
    )
    axios
      .get(
        self.schema +
          `://` +
          self.hostname +
          `:` +
          self.portnumber +
          `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
          userConfig.organization.organizationName +
          `&sort=organizationName`,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_MemberId => {
        console.log(
          '#Response status Of Get Member ID API : ' +
            getResponse_MemberId.status
        )
        console.log('#Member ID = ' + getResponse_MemberId.data.limit)
        if (getResponse_MemberId.data.limit === 0) {
          return this.createOrganization().then(res => {
            if (res === 201) return this.verifyUserExist()
          })
        } else {
          return this.verifyUserExist()
        }
      })
  }
  /**
   * Method is used to create organization
   * @returns Response from Assign Member group API
   */
  createOrganization () {
    console.log('#####Create Organization Function Started#####')
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const postheaders = {
      'Content-Type': 'application/json',
      Authorization: auth
    }
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    let postcreateOrgRequestBody = userConfig.organization
    return axios
      .post(
        this.schema +
          `://` +
          this.hostname +
          `:` +
          this.portnumber +
          `/rest/admin/v2/organizations?locale=en_US`,
        postcreateOrgRequestBody,
        {
          headers: postheaders,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(postcreateorgresponse => {
        console.log(
          'Create Organization status :' + postcreateorgresponse.status
        )
        if (postcreateorgresponse.status === 201) {
          return axios
            .get(
              this.schema +
                `://` +
                this.hostname +
                `:` +
                this.portnumber +
                `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
                userConfig.organization.organizationName +
                `&sort=organizationName`,
              {
                headers: getHeader,
                httpsAgent: agent,
                timeout: axios.defaults.timeout
              }
            )
            .then(getResponse_MemberId => {
              console.log(
                'Member id :' +
                  getResponse_MemberId.data.items[0].address.memberId +
                  '& Response status :' +
                  getResponse_MemberId.status
              )
              this.memberID =
                getResponse_MemberId.data.items[0].address.memberId
              let status_code
              userConfig.roleId.orgRole.forEach((element: number) => {
                status_code = this.assignRole(
                  this.memberID,
                  userConfig.organization.organizationName,
                  element
                )
              })
              return status_code
            })
            .then(resp => {
              console.log('Response from Assign Role' + resp)
              console.log('Execute Assign Approval Type')
              if (resp == 201) {
                let status
                userConfig.approvalId.orgApproval.forEach((element: string) => {
                  status = this.assignApprovalType(
                    userConfig.organization.organizationName,
                    element
                  )
                })
                return status
              }
            })
            .then(resp => {
              console.log('Response from Assign Approval Type' + resp)
              console.log('Execute Memeber Group Type')
              if (resp == 201) {
                let status
                userConfig.memberTypeId.orgGroupId.forEach(
                  (element: string) => {
                    status = this.assignMemberGroup(this.memberID, element)
                  }
                )
                return status
              }
            })
            .then(resp => {
              console.log('Response from Assign Memeber Group type :' + resp)
              if (resp == 201) {
                console.log('Organization created successfully')
              }
              return resp
            })
        }
      })
      .catch(error => {
        return error
      })
  }
  /**
   * Method is used to assign Approval type to organization
   * @param orgName : pass organization name
   * @param approvalTypeId : pass approval type id
   * @returns postResponseAssignApprovalType status
   */
  assignApprovalType (orgName: string, approvalTypeId: string) {
    console.log('#####Assign Approval Type Method#####')
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const getHeader = {
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
      Authorization: auth
    }
    const postheaders = {
      'Content-Type': 'application/json',
      Authorization: auth
    }
    console.log(
      `#To Get Org ID = ` +
        this.schema +
        `://` +
        this.hostname +
        `:` +
        this.portnumber +
        `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
        orgName +
        `&sort=organizationName`
    )
    return axios
      .get(
        this.schema +
          `://` +
          this.hostname +
          `:` +
          this.portnumber +
          `/rest/admin/v2/organizations/manageable?offset=0&limit=10&organizationName=` +
          orgName +
          `&sort=organizationName`,
        {
          headers: getHeader,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(getResponse_OrgID => {
        console.log(
          '#Response status of Org ID API for assignApprovalType: ' +
            getResponse_OrgID.status
        )
        console.log(
          '#Parent Organization Id for assignApprovalType: ' +
            getResponse_OrgID.data.items[0].id
        )
        let parentOrgID = getResponse_OrgID.data.items[0].id
        let postRequestAssignApprovalType = userConfig.assignApprovalType
        postRequestAssignApprovalType.organizationId = parentOrgID
        postRequestAssignApprovalType.approvalTypeId = approvalTypeId
        browser.pause(envConfig.timeout.lowtimeout)
        console.log(
          'postRequestAssignApprovalType ' + postRequestAssignApprovalType
        )
        return axios.post(
          this.schema +
            '://' +
            this.hostname +
            ':' +
            this.portnumber +
            '/rest/admin/v2/approval-type-assignments?locale=en_US',
          postRequestAssignApprovalType,
          {
            headers: postheaders,
            httpsAgent: agent,
            timeout: axios.defaults.timeout
          }
        )
      })
      .then(postResponseAssignApprovalType => {
        console.log(
          '#Response Status of Assign Approval Type : ',
          postResponseAssignApprovalType.status
        )
        return postResponseAssignApprovalType.status
      })
      .catch(error1 => {
        console.log('#Assign Approval Type- Error : ' + error1)
      })
  }
  /**
   * Method is used to assign Group member to organization
   * @param memberID : pass member id
   * @param memberGroupId : pass memberGroupId
   * @returns postResponseMemberGroupType status
   */
  assignMemberGroup (memberID: string, memberGroupId: string) {
    console.log('#####Assign Member Type Method#####')
    const auth =
      'Basic ' +
      Buffer.from(this.username + ':' + this.password).toString('base64')
    const postheaders = {
      'Content-Type': 'application/json',
      Authorization: auth
    }
    let postRequestMemberGroupType = userConfig.assignMemberType
    postRequestMemberGroupType.memberId = memberID
    postRequestMemberGroupType.memberGroupId = memberGroupId
    console.log('#postRequestMemberGroupType ' + postRequestMemberGroupType)
    return axios
      .post(
        this.schema +
          '://' +
          this.hostname +
          ':' +
          this.portnumber +
          '/rest/admin/v2/member-group-memberships?locale=en_US',
        postRequestMemberGroupType,
        {
          headers: postheaders,
          httpsAgent: agent,
          timeout: axios.defaults.timeout
        }
      )
      .then(postResponseMemberGroupType => {
        console.log(
          '#Response Status of Assign Approval Type : ',
          postResponseMemberGroupType.status
        )
        return postResponseMemberGroupType.status
      })
      .catch(error1 => {
        console.log('#Assign Approval Type- Error : ' + error1)
      })
  }
}
