import oAuthCallback from '../oauth/callback'
import pino from 'pino'

/**
 * Handle callbacks from login services
 * @param {import("..").NextAuthRequest} req
 * @param {import("..").NextAuthResponse} res
 */
export default async function callback(req, res) {
  const {
    provider,
    baseUrl,
    callbacks
  } = req.options

  if (provider.type === 'oauth') {
    const oauthPayload = await oAuthCallback(req)
    await callbacks.signIn(oauthPayload)
    res.redirect(baseUrl)
  }
}
