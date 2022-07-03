export enum IUserApiEndpoint {
  AUTH = '/auth',
  LOGOUT = '/logout',
  INFO = '/myinfo',
  UPDATEPWD = '/updatepwd',
  UPDATEINFO = '/updateinfo',
}

export interface IUserCredentials {
  identifiant: string
  password: string
}

export interface IAuthRes {
  session_token: string
}

export interface IUserInfoRes {
  company: string
  fname: string
  lname: string
  email: string
  website: string
  timestamp: number
  description: string
  apitoken: string
}

export interface IUpdatePwdReq {
  old_password: string
  new_password: string
}

// The user cannot change his apitoken nor his timestamp
export type IUpdateUserInfoReq = Partial<Omit<IUserInfoRes, 'apitoken' | 'timestamp'>>
