import config from '../../../config'

export default {
  id: 'linkedin',
  name: 'LinkedIn',
  type: 'oauth',
  version: '2.0',
  scope: 'r_liteprofile',
  params: {
    grant_type: 'authorization_code',
    client_id: config.get('LINKEDIN_CLIENT_ID'),
    client_secret: config.get('LINKEDIN_CLIENT_SECRET')
  },
  accessTokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  authorizationUrl:
    'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
  profileUrl:
    'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)',
  profile: profile => {
    return {
      id: profile.id,
      name: profile.localizedFirstName + ' ' + profile.localizedLastName,
      email: `${profile.id}@linkedin.com`,
      image: null
    }
  },
  clientId: config.get('LINKEDIN_CLIENT_ID'),
  clientSecret: config.get('LINKEDIN_CLIENT_SECRET')
}
