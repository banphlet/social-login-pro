'use strict'
import { pipe, pick, prop, defaultsDeep, flatten } from 'lodash/fp'
import { asyncPipe, required, validate } from '../../../lib/utils'
import querystring from 'querystring'
import joi from '../../../lib/joi'
import { post, get } from '../../../lib/request'
import got from './wix-retryer'
import config from '../../../config'
import striptags from 'striptags'

const BASE_OAUTH_URL = 'https://www.wix.com'
const BASE_WIX_API = 'https://www.wixapis.com/apps/v1'

const APP_ID = config.get('WIX_CLIENT_ID')
const APP_SECRET = config.get('WIX_CLIENT_SECRET')

const schema = joi.object({
  token: joi.string().required(),
  redirectUrl: joi
    .string()
    .uri()
    .required()
})

const getPermissionUrl = pipe(
  validate(schema),
  params =>
    `${BASE_OAUTH_URL}/app-oauth-installation/consent/?${querystring.stringify({
      appId: APP_ID,
      token: params.token,
      redirectUrl: params.redirectUrl
    })}`
)

const getAccessTokenAndRefreshToken = post(`${BASE_OAUTH_URL}/oauth/access`)

const getOauthAccessTokens = asyncPipe(
  pick(['code']),
  validate(joi.object({ code: joi.string().required() })),
  ({ code }) => ({
    body: {
      code,
      grant_type: 'authorization_code',
      client_id: APP_ID,
      client_secret: APP_SECRET
    }
  }),
  getAccessTokenAndRefreshToken,
  // eslint-disable-next-line camelcase
  ({ access_token, refresh_token }) => ({
    refreshToken: refresh_token,
    accessToken: access_token
  })
)

const getDetails = get(`${BASE_WIX_API}/instance`)
const getShopEmail = get(
  'https://www.wixapis.com/site-properties/v4/properties?fields.paths=email'
)
const getShopDetails = ({ accessToken }) =>
  Promise.all([
    getDetails({
      headers: {
        Authorization: accessToken
      }
    }),
    getShopEmail({
      headers: {
        Authorization: accessToken
      }
    })
  ])

const getSiteDetails = asyncPipe(
  pick(['accessToken']),
  validate(joi.object({ accessToken: joi.string().required() })),
  getShopDetails,
  ([siteDetails, moreDetails]) => ({
    externalId: siteDetails.instance.instanceId,
    domain: siteDetails.site.url,
    name: siteDetails.site.siteDisplayName,
    email: moreDetails.properties.email
  })
)

/**
 *Verify Token from Wix
 *@params {string} token from wix
 *@throws {InvalidTokenError} When we cant verify token
 *@returns {Promise} Resolves to the externalId in the payload
 *
 * **/
const decodeToken = pipe(
  token => token.split('.')[1],
  payload => Buffer.from(payload, 'base64').toString('ascii'),
  JSON.parse
)
const logAndThrowInvalidToken = err => {
  log.error(err)
  throw new Error('token is not valid')
}

const tryCatch = (fn, errorThrower) => params => {
  try {
    return fn(params)
  } catch (error) {
    return errorThrower(error)
  }
}

const verifyToken = asyncPipe(
  validate(joi.object({ token: joi.string().required() })),
  prop('token'),
  tryCatch(decodeToken, logAndThrowInvalidToken),
  prop('instanceId')
)

const fetchCollections = ({
  accessToken,
  refreshToken = required('refreshToken')
}) =>
  got
    .post('collections/query', {
      headers: {
        Authorization: accessToken
      },
      context: { refreshToken },
      json: {
        query: {
          paging: {
            limit: 100
          }
        }
      }
    })
    .then(response => response.body)

const fetchProducts = ({
  accessToken = required('accessToken'),
  refreshToken = required('refreshToken'),
  numericId
}) =>
  got
    .post('products/query', {
      headers: {
        Authorization: accessToken
      },
      context: { refreshToken },
      json: {
        query: {
          paging: {
            limit: 100
          },
          sort: JSON.stringify([{ numericId: 'asc' }]),
          ...(numericId
            ? {
                filter: JSON.stringify({
                  numericId: {
                    $gt: numericId
                  }
                })
              }
            : {})
        },
        includeVariants: true
      }
    })
    .then(response => response.body)

const fetchAllProducts = async ({ accessToken, refreshToken, brand }) => {
  const firstItems = await fetchProducts({ accessToken, refreshToken })
  const allProducts = firstItems.products

  let numericId = allProducts.pop()?.numericId
  while (numericId) {
    const { products } = await fetchProducts({
      accessToken,
      refreshToken,
      numericId
    })
    if (products.length) {
      numericId = products.pop()?.numericId
      return allProducts.concat(products)
    }
    numericId = undefined
  }
  return flatten(allProducts.map(transformProduct(brand)))
}

const transformProduct = brand => product => {
  return product.variants?.length > 1
    ? transformWithVariants({ product, brand })
    : transformWithOutVariants({ brand, product })
}

const supportedVariantsKeys = ['color', 'size']

const transformWithVariants = ({ brand, product }) => {
  return product.variants.map(variant => {
    const choices = Object.keys(variant.choices).reduce((acc, key) => {
      const keyToLowerCase = key.toLowerCase()
      if (supportedVariantsKeys.includes(keyToLowerCase)) {
        acc[keyToLowerCase] = variant.choices[key]
      }
      return acc
    }, {})

    return defaultsDeep(transformWithOutVariants({ brand, product }), {
      retailer_id: variant.id,
      data: {
        price: variant?.variant?.convertedPriceData.price * 100,
        sale_price: variant?.variant?.convertedPriceData.discountedPrice * 100,
        retailer_product_group_id: product.numericId,
        ...choices
      }
    })
  })
}

const transformWithOutVariants = ({ brand, product }) => ({
  method: 'UPDATE',
  retailer_id: product.numericId,
  data: {
    brand,
    image_url: product?.media?.mainMedia?.image?.url,
    availability: product?.stock?.inStock ? 'in stock' : 'out of stock',
    condition: 'new', // should be changed to the true state of the item
    currency: product.convertedPriceData?.currency,
    description: striptags(product?.description),
    name: product?.name,
    price: product?.convertedPriceData?.price * 100,
    sale_price: product?.convertedPriceData?.discountedPrice,
    product_type: product?.productType,
    url: `${product?.productPageUrl?.base}${product?.productPageUrl?.path}`,
    ...(product?.media?.items?.length > 1
      ? {
          additional_image_urls: product?.media?.items
            .slice(1)
            .map(item => item?.image?.url)
            .slice(0, 10)
        }
      : {})
  }
})

const getSingleProduct = ({
  accessToken = required('accessToken'),
  refreshToken = required('refreshToken'),
  productId = required('productId'),
  brand = required('brand')
}) =>
  got
    .get(`products/${productId}`, {
      headers: {
        Authorization: accessToken
      },
      context: { refreshToken }
    })
    .then(response => response.body?.product)
    .then(transformProduct(brand))

export {
  getSingleProduct,
  fetchAllProducts,
  getPermissionUrl,
  getOauthAccessTokens,
  getSiteDetails,
  verifyToken,
  fetchCollections,
  decodeToken
}
