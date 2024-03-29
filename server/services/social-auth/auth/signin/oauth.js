import oAuthClient from '../oauth/client'
import pino from 'pino'
const logger = pino()

/** @param {import("../..").NextAuthRequest} req */
export default async function getAuthorizationUrl (req) {
  const { provider } = req.options

  const state = req.body?.shop_id || req.query?.shop_id
  const client = oAuthClient(provider, state)
  if (provider.version?.startsWith('2.')) {
    delete req.query?.nextauth
    // Handle OAuth v2.x
    let url = client.getAuthorizeUrl({
      ...provider.authorizationParams,
      ...req.query,
      redirect_uri: provider.callbackUrl,
      scope: provider.scope,
      state
    })

    // If the authorizationUrl specified in the config has query parameters on it
    // make sure they are included in the URL we return.
    //
    // This is a fix for an open issue with the OAuthClient library we are using
    // which inadvertantly strips them.
    //
    // https://github.com/ciaranj/node-oauth/pull/193
    if (provider.authorizationUrl.includes('?')) {
      const parseUrl = new URL(provider.authorizationUrl)
      const baseUrl = `${parseUrl.origin}${parseUrl.pathname}?`
      url = url.replace(baseUrl, provider.authorizationUrl + '&')
    }

    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  }

  try {
    const oAuthToken = await client.getOAuthRequestToken({
      state
    })
    const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  } catch (error) {
    console.error('GET_AUTHORIZATION_URL_ERROR', error, provider)
    throw error
  }
}
