const KEY = 'risklens_demo_auth'

export const DEMO_EMAIL = 'demo@risklens.com'
export const DEMO_PASSWORD = 'risklens123'

export function isLoggedIn() {
  return sessionStorage.getItem(KEY) === '1'
}

export function logIn(email: string, password: string) {
  const ok =
    email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
  if (ok) sessionStorage.setItem(KEY, '1')
  return ok
}

export function logOut() {
  sessionStorage.removeItem(KEY)
}