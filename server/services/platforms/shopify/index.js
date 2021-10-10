'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../../config'
import { required } from '../../../lib/utils'
import { Platforms } from '../../../models/shops/schema'
import request from '../../../lib/request'

const renderSnippet = "{% render 'limit-login.liquid', form: form %}"

const API_VERSION = '2021-07'

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
    // 'read_themes',
    // 'write_themes',
    'write_customers',
    'read_customers',
    'write_script_tags'
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
    .then(shopDetails => {
      return {
        domain: shopDetails.domain,
        platformDomain: shopDetails.myshopify_domain,
        email: shopDetails.email,
        platform: Platforms.SHOPIFY,
        external_access_token: accessToken,
        name: shopDetails.name,
        externalId: shopDetails.id,
        locale: shopDetails.primary_locale
      }
    })

const insertSnippetIntoCurrentLiquid = (value = '', isLoginPage = true) => {
  const snippet = "{% render 'limit-login.liquid', form: form %}"
  const match = isLoginPage
    ? value.match(/customer_login.*}/)
    : value.match(/create_customer.*}/)
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

const injectScriptInLogin = async ({
  themeId,
  shopifyLibInstance,
  templateBasePath,
  shopId,
  isLoginPage
}) => {
  const pageAsset = await shopifyLibInstance.asset.get(themeId, {
    'asset[key]': `${templateBasePath}.liquid`
  })

  const hasSnippet = new RegExp(renderSnippet).test(pageAsset.value)

  if (hasSnippet)
    return shopifyLibInstance.asset.update(themeId, {
      key: 'snippets/limit-login.liquid',
      value: await loadScript(shopId)
    })

  // backup customer login file
  await shopifyLibInstance.asset.create(themeId, {
    key: `${templateBasePath}-backup.liquid`,
    value: pageAsset.value
  })

  await shopifyLibInstance.asset.create(themeId, {
    key: 'snippets/limit-login.liquid',
    value: await loadScript(shopId)
  })

  await shopifyLibInstance.asset.update(themeId, {
    key: `${templateBasePath}.liquid`,
    value: insertSnippetIntoCurrentLiquid(pageAsset.value, isLoginPage)
  })
}

const injectScript = async ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  shopId = required('shopId')
}) => {
  const shopify = shopifyClient({ shop: platformDomain, accessToken })
  // const publishedTheme = (await shopify.theme.list()).find(
  //   theme => theme.role === 'main'
  // )
  // await Promise.all([
  //   injectScriptInLogin({
  //     themeId: publishedTheme.id,
  //     templateBasePath: 'templates/customers/login',
  //     shopifyLibInstance: shopify,
  //     shopId,
  //     isLoginPage: true
  //   }),
  //   injectScriptInLogin({
  //     themeId: publishedTheme.id,
  //     templateBasePath: 'templates/customers/register',
  //     shopifyLibInstance: shopify,
  //     shopId,
  //     isLoginPage: false
  //   })
  // ])
  const hasInjectedScript = await shopify.scriptTag.count()
  if (hasInjectedScript) return
  return shopify.scriptTag
    .create({
      event: 'onload',
      src: `${config.get('NEXT_PUBLIC_APP_URL')}/js/lla.js?shop_id=${shopId}`
    })
    .catch(err => console.error(err.response.body))
}

const installWebhooks = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain')
}) => {
  return shopifyClient({ shop: platformDomain, accessToken })
    .webhook.create({
      topic: 'app/uninstalled',
      address: `${config.get('NEXT_PUBLIC_APP_URL')}/api/uninstall`,
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
}) =>
  shopifyClient({ shop: platformDomain, accessToken })
    .recurringApplicationCharge.create({
      name: 'Pro Plan',
      price: '2.99',
      return_url: `${config.get(
        'NEXT_PUBLIC_APP_URL'
      )}/api/plans/callback?shop_id=${shopId}`,
      test: config.get('IS_TEST_CHARGE')
    })
    .then(response => response.confirmation_url)

const confirmCharge = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  chargeId = required('chargeId')
}) =>
  shopifyClient({
    shop: platformDomain,
    accessToken
  }).recurringApplicationCharge.activate(chargeId)

const verifyHmac = shopifyToken.verifyHmac

const createCustomer = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  customer
}) =>
  shopifyClient({ shop: platformDomain, accessToken }).customer.create(customer)

const updateCustomerPassword = async ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  email = required('email'),
  password = required('password')
}) => {
  const shopify = shopifyClient({ shop: platformDomain, accessToken })
  const [customer] = await shopify.customer.search({
    query: `email:${email}`
  })
  return shopify.customer.update(customer.id, {
    password: password,
    password_confirmation: password
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
