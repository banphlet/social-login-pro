import config from '../../../config'

const apiVersion = '20210119'

export default {
  id: 'foursquare',
  name: 'Foursquare',
  type: 'oauth',
  version: '2.0',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: 'https://foursquare.com/oauth2/access_token',
  authorizationUrl:
    'https://foursquare.com/oauth2/authenticate?response_type=code',
  profileUrl: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,
  profile: data => {
    const profile = data.response.user
    return {
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      image: `${profile.prefix}original${profile.suffix}`,
      email: profile.contact.email
    }
  },
  clientId: config.get('FOUR_SQUARE_CLIENT_ID'),
  clientSecret: config.get('FOUR_SQUARE_CLIENT_SECRET'),
  apiVersion
}
