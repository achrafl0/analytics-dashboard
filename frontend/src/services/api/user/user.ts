import { httpClient } from '../../http'
import {
  IAuthRes,
  IUpdatePwdReq,
  IUpdateUserInfoReq,
  IUserApiEndpoint,
  IUserCredentials,
  IUserInfoRes,
} from './user.types'

export const login = async (credentials: IUserCredentials): Promise<IAuthRes> =>
  httpClient.instance.post<IAuthRes>(IUserApiEndpoint.AUTH, credentials)

export const logout = async (): Promise<void> => httpClient.instance.post<void>(IUserApiEndpoint.LOGOUT)

export const getInfo = async (): Promise<IUserInfoRes> =>
  httpClient.instance.post<IUserInfoRes>(IUserApiEndpoint.INFO)

export const updatePwd = async (pwds: IUpdatePwdReq) =>
  httpClient.instance.post<void>(IUserApiEndpoint.UPDATEPWD, pwds)

export const updateInfo = async (changedInfo: IUpdateUserInfoReq) =>
  httpClient.instance.post<void>(IUserApiEndpoint.UPDATEINFO, changedInfo)
