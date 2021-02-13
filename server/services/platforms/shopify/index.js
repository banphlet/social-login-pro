'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../../config'
import { asyncPipe, required } from '../../../lib/utils'
import { Platforms } from '../../../models/shops/schema'

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
  scopes: ['read_content', 'read_script_tags', 'write_script_tags']
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

const injectScript = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  shopId = required('shopId')
}) =>
  shopifyClient({ shop: platformDomain, accessToken })
    .scriptTag.create({
      src: `${config.get('NEXT_PUBLIC_APP_URL')}/js/lla.js?shop_id=${shopId}`,
      event: 'onload'
    })
    .catch(err => {
      console.log(err)
    })

export { getPermissionUrl, getOauthAccessTokens, getSiteDetails, injectScript }
