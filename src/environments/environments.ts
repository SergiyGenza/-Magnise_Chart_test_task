export const environments = {
  production: false,
  API_KEY: process.env['API_KEY'],
  USERNAME: process.env['USERNAME'],
  PASSWORD: process.env['PASSWORD'],

  API_INSTRUMENTS: process.env['API_INSTRUMENTS'],
  API_BARS: process.env['API_BARS'],
  WS_URL: process.env['WS_URL'],
}