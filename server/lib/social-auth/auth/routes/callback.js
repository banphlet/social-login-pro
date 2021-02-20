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
    adapter,
    baseUrl,
    basePath,
    callbackUrl,
    pages,
    events,
    callbacks
  } = req.options

  if (provider.type === 'oauth') {
    const oauthPayload = await oAuthCallback(req)
    console.log(oauthPayload.profile);
    await callbacks.signIn(oauthPayload)
  }
}
