const SESSION_KEY = 'session_token'

export class LocalItem {
  key: string

  public constructor(key: string) {
    this.key = key
  }

  get() {
    return localStorage.getItem(this.key)
  }

  set(data: string) {
    localStorage.setItem(this.key, data)
  }

  reset() {
    localStorage.removeItem(this.key)
  }
}

export const LocalSession = new LocalItem(SESSION_KEY)
