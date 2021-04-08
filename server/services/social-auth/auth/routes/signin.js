import getAuthorizationUrl from '../signin/oauth'
import pino from 'pino'

const logger = pino()

/** Handle requests to /api/auth/signin */
export default async function signin (req, res) {
  const { provider, baseUrl } = req.options

  if (!provider.type) {
    return res.status(500).end(`Error: Type not specified for ${provider.name}`)
  }

  if (provider.type === 'oauth' && req.method === 'POST') {
    try {
      const authorizationUrl = await getAuthorizationUrl(req)
      return res.json({ authorizationUrl })
    } catch (error) {
      logger.error('SIGNIN_OAUTH_ERROR', error)
      return res.redirect(`${baseUrl}/status/error?error=OAuthSignin`)
    }
  }
  return res.redirect(`${baseUrl}/status/error?error=OAuthSignin`)
}
