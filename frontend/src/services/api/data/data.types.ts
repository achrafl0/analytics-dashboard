export enum DataApiEndpoint {
  BANDWIDTH = '/bandwidth',
  AUDIENCE = '/audience',
  STREAMS = '/streams',
  COUNTRIES = '/countries',
  ISPS = '/isps',
  PLATFORMS = '/platforms',
}

export enum IDataAggregation {
  SUM = 'sum',
  AVERAGE = 'average',
  MAX = 'max',
  MIN = 'min',
}

interface IGenericDataReq {
  from: number
  to: number
}

interface IAggregatedDataReq extends IGenericDataReq {
  aggregate: IDataAggregation
}

export type IDataReq = IGenericDataReq | IAggregatedDataReq

export interface IAggregatedBandwithRes {
  cdn: number
  p2p: number
}

export interface INonAggregatedBandwithRes {
  timestamp: number[]
  cdn: number[]
  p2p: number[]
}

export type IBandwithDataRes = IAggregatedBandwithRes | INonAggregatedBandwithRes

export interface IAggregatedAudienceRes {
  viewers: number
}

export interface INonAggregatedAudienceRes {
  timestamp: number[]
  viewers: number[]
}

export type IAudienceDataRes = IAggregatedAudienceRes | INonAggregatedAudienceRes

export interface IStreamsDataRes extends IAggregatedBandwithRes {
  manifest: string
  max_viewers: number
  average_viewers: number
}

export interface ICountryDataRes extends IAggregatedBandwithRes {
  country: string
}

export interface IISPDataRes extends IAggregatedBandwithRes {
  isp: string
}

export interface IPlatformDataRes extends IAggregatedBandwithRes {
  platform: string
  upload: number
  max_viewers: number
  average_viewers: number
}
/*
export type IDataRes<T, AggregT, NonAggregT> = T extends IAggregatedDataReq ? AggregT : NonAggregT

export type AllKeysToArray<P> = {
    [T in keyof P]: Array<P[T]>
}

export type ToNonAggregatedResponse<P> = AllKeysToArray<P & {timestamp: number}>
*/
