import config from '../../../config'
const apiVersion = '5.126' // https://vk.com/dev/versions

export default {
  id: 'vk',
  name: 'VK',
  type: 'oauth',
  version: '2.0',
  scope: 'email',
  params: {
    grant_type: 'authorization_code'
  },
  accessTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
  requestTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
  authorizationUrl: `https://oauth.vk.com/authorize?response_type=code&v=${apiVersion}`,
  profileUrl: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
  profile: result => {
    const profile = result.response?.[0] ?? {}
    return {
      id: profile.id,
      name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
      email: profile.email || `${profile.id}@vk.com`,
      image: profile.photo_100
    }
  },
  clientId: config.get('VK_CLIENT_ID'),
  clientSecret: config.get('VK_CLIENT_SECRET')
}
