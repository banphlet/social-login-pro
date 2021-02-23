import oAuthCallback from '../oauth/callback'
import customers from '../../../customers'
import shopService from '../../../shops'
/**
 * Handle callbacks from login services
 * @param {import("..").NextAuthRequest} req
 * @param {import("..").NextAuthResponse} res
 */
export default async function callback (req, res) {
  const { provider } = req.options

  try {
    if (provider.type === 'oauth') {
      const oauthPayload = await oAuthCallback(req)
      const payload = await customers().createOrLogin(oauthPayload)
      const token = Buffer.from(JSON.stringify(payload)).toString('base64')
      res.redirect(`https://${payload.domain}/account/login?lla_token=${token}`)
    }
  } catch (error) {
    const shopId = req.query?.state || req.query?.shop_id
    const shop = await shopService().getByShopId(shopId)
    const redirectUrl = `https://${shop?.platform_domain}/account/login`
    res.redirect(redirectUrl)
  }
}
