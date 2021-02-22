'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../../config'
import { asyncPipe, required } from '../../../lib/utils'
import { Platforms } from '../../../models/shops/schema'
import request from '../../../lib/request'

const renderSnippet = "{% render 'limit-login.liquid', form: form %}"

const API_VERSION = '2020-04'

const shopifyClient = ({
  shop = required('shop'),
  accessToken = required('accessToken')
}) => {
  const shopify = new Shopify({
    shopName: shop.replace(/(^\w+:|^)\/\//, ''),
    accessToken,
    autoLimit: true,
    apiVersion: API_VERSION
  })

  return shopify
}

const shopifyToken = new ShopifyToken({
  sharedSecret: config.get('SHOPIFY_CLIENT_SECRET'),
  redirectUri: `${config.get(
    'NEXT_PUBLIC_APP_URL'
  )}/api/permission-accepted/shopify`,
  apiKey: config.get('NEXT_PUBLIC_SHOPIFY_CLIENT_ID'),
  scopes: ['read_themes', 'write_themes', 'write_customers', 'read_customers']
})

const getPermissionUrl = ({ shop = required('shop') }) =>
  shopifyToken.generateAuthUrl(shop)

const getOauthAccessTokens = ({
  code = required('code'),
  shop = required('shop')
}) =>
  shopifyToken.getAccessToken(shop, code).then(response => ({
    accessToken: response.access_token,
    scope: response.scope
  }))

const getSiteDetails = ({
  shop = required('shop'),
  accessToken = required('accessToken')
}) =>
  shopifyClient({ shop, accessToken })
    .shop.get()
    .then(shopDetails => ({
      domain: shopDetails.domain,
      platformDomain: shopDetails.myshopify_domain,
      email: shopDetails.email,
      platform: Platforms.SHOPIFY,
      external_access_token: accessToken,
      name: shopDetails.name,
      externalId: shopDetails.id
    }))

const insertSnippetIntoCurrentLiquid = (value = '') => {
  const snippet = "{% render 'limit-login.liquid', form: form %}"
  const match = value.match(/customer_login.*}/)
  if (!match) return value
  const indexAfterFormTag = match.index + match[0].length
  return (
    value.slice(0, indexAfterFormTag) + snippet + value.slice(indexAfterFormTag)
  )
}
const loadScript = async shopId => {
  const script = await request(
    `${config.get('NEXT_PUBLIC_APP_URL')}/script.liquid`,
    {
      responseType: 'text',
      rejectUnauthorized: false
    }
  ).then(response => response.body)
  return script
    .replace(/SHOP_ID/g, shopId)
    .replace(/NEXT_PUBLIC_APP_URL/g, config.get('NEXT_PUBLIC_APP_URL'))
}

const injectScript = async ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  shopId = required('shopId')
}) => {
  const loginTemplateBasePath = 'templates/customers/login'
  const shopify = shopifyClient({ shop: platformDomain, accessToken })
  const publishedTheme = (await shopify.theme.list()).find(
    theme => theme.role === 'main'
  )

  const customerLoginAsset = await shopify.asset.get(publishedTheme.id, {
    'asset[key]': `${loginTemplateBasePath}.liquid`
  })

  const hasSnippet = new RegExp(renderSnippet).test(customerLoginAsset.value)
  if (hasSnippet) return shopify.asset.update(publishedTheme.id, {
    key: 'snippets/limit-login.liquid',
    value: await loadScript(shopId)
  })

  // backup customer login file
  await shopify.asset.create(publishedTheme.id, {
    key: `${loginTemplateBasePath}-backup.liquid`,
    value: customerLoginAsset.value
  })

  await shopify.asset.create(publishedTheme.id, {
    key: 'snippets/limit-login.liquid',
    value: await loadScript(shopId)
  })

  await shopify.asset.update(publishedTheme.id, {
    key: `${loginTemplateBasePath}.liquid`,
    value: insertSnippetIntoCurrentLiquid(customerLoginAsset.value)
  })
}

const installWebhooks = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain')
}) => {
  return shopifyClient({ shop: platformDomain, accessToken })
    .webhook.create({
      topic: 'app/uninstalled',
      address: `${'https://71279c09c393.ngrok.io' ||
        config.get('NEXT_PUBLIC_APP_URL')}/api/uninstall`,
      format: 'json'
    })
    .catch(err => {
      console.log(err.response.body)
    })
}

const createCharge = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  shopId = required('shopId')
}) => shopifyClient({ shop: platformDomain, accessToken })
  .recurringApplicationCharge.create({
    name: 'Pro Plan',
    price: '2.99',
    return_url: `${config.get('NEXT_PUBLIC_APP_URL')}/api/plans/callback?shop_id=${shopId}`,
    test: config.get('IS_TEST_CHARGE')
  }).then(response => response.confirmation_url)

const confirmCharge = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  chargeId = required('chargeId')
}) => shopifyClient({ shop: platformDomain, accessToken })
  .recurringApplicationCharge.activate(chargeId)

const verifyHmac = shopifyToken.verifyHmac

const createCustomer = ({ accessToken = required('accessToken'), platformDomain = required('platformDomain'), customer }) => shopifyClient({ shop: platformDomain, accessToken }).customer.create(customer)

const updateCustomerPassword = async ({ accessToken = required('accessToken'), platformDomain = required('platformDomain'), email = required('email'), password = required('password') }) => {
  const shopify = shopifyClient({ shop: platformDomain, accessToken })
  const [customer] = await shopify.customer.search({
    query: `email:${email}`
  })
  return shopify.customer.update(customer.id, {
    "password": password,
    "password_confirmation": password
  })
}

export {
  createCustomer,
  getPermissionUrl,
  getOauthAccessTokens,
  getSiteDetails,
  injectScript,
  installWebhooks,
  verifyHmac,
  updateCustomerPassword,
  createCharge,
  confirmCharge
}
