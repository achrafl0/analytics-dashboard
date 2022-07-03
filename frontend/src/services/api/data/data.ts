import { httpClient } from '../../http'
import {
  IBandwithDataRes,
  IDataReq,
  IAudienceDataRes,
  IStreamsDataRes,
  ICountryDataRes,
  DataApiEndpoint,
  IISPDataRes,
  IPlatformDataRes,
} from './data.types'

export const getBandwithData = async (dataRequest: IDataReq): Promise<IBandwithDataRes> =>
  httpClient.instance.post<IBandwithDataRes>(DataApiEndpoint.BANDWIDTH, dataRequest)

export const getAudienceData = async (dataRequest: IDataReq): Promise<IAudienceDataRes> =>
  httpClient.instance.post<IAudienceDataRes>(DataApiEndpoint.AUDIENCE, dataRequest)

export const getStreamData = async (): Promise<IStreamsDataRes> =>
  httpClient.instance.post<IStreamsDataRes>(DataApiEndpoint.STREAMS)

export const getCountriesData = async (): Promise<ICountryDataRes> =>
  httpClient.instance.post<ICountryDataRes>(DataApiEndpoint.COUNTRIES)

export const getISPData = async (): Promise<IISPDataRes> =>
  httpClient.instance.post<IISPDataRes>(DataApiEndpoint.ISPS)

export const getPlatformData = async (): Promise<IPlatformDataRes> =>
  httpClient.instance.post<IPlatformDataRes>(DataApiEndpoint.PLATFORMS)
