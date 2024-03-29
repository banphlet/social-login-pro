import config from '../../../config'

export default () => ({
  id: 'spotify',
  name: 'Spotify',
  type: 'oauth',
  version: '2.0',
  scope: 'user-read-email',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: 'https://accounts.spotify.com/api/token',
  authorizationUrl: 'https://accounts.spotify.com/authorize?response_type=code',
  profileUrl: 'https://api.spotify.com/v1/me',
  profile: profile => {
    return {
      id: profile.id,
      name: profile.display_name,
      email: profile.email,
      image: profile.images?.[0]?.url
    }
  },
  clientId: config.get('SPOTIFY_CLIENT_ID'),
  clientSecret: config.get('SPOTIFY_CLIENT_SECRET')
})
