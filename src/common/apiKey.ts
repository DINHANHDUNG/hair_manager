export const API_URL = process.env.REACT_APP_BASE_URL ?? ''

export const NetWork = {
  //Admin
  login: 'auth/login',
  refresh_token: 'auth/refresh-token',

  //Account
  account: 'account',

  //Pokemon
  pokemon: 'api/v2/'
}
