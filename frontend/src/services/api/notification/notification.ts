import { httpClient } from '../../http'
import { INotification, INotificationAPIEndpoint } from './notification.types'

export const getNotification = async (): Promise<INotification[]> =>
  httpClient.instance.post(INotificationAPIEndpoint.NOTIFICATION)
