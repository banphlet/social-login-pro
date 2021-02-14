'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../../config'
import { asyncPipe, required } from '../../../lib/utils'
import { Platforms } from '../../../models/shops/schema'
import fs from 'fs'
import util from 'util'

const readFilePromise = util.promisify(fs.readFile)

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
  scopes: [
    'read_content',
    'read_script_tags',
    'write_script_tags',
    'read_themes',
    'write_themes'
  ]
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
  const script = (
    await readFilePromise(process.cwd() + '/script.liquid')
  ).toString('utf-8')

  return script
    .replace('SHOP_ID', shopId)
    .replace('NEXT_PUBLIC_APP_URL', config.get('NEXT_PUBLIC_APP_URL'))
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
  if (hasSnippet) return

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

export { getPermissionUrl, getOauthAccessTokens, getSiteDetails, injectScript }
