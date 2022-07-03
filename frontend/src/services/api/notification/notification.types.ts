export enum INotificationAPIEndpoint {
  NOTIFICATION = '/notifications',
}
export enum INotificationType {
  NOTE = 'note',
  ERROR = 'error',
  WARNING = 'warning',
}
export interface INotification {
  type: INotificationType
  message: string
}
