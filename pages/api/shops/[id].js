'use strict'
import customServerHandler from '../../../server/request-handler'
import shopService from '../../../server/services/shops'
import respond from '../../../server/request-handler/respond'

const getShopHandler = (req, res) =>
  shopService()
    .getByExternalId(req.query?.instance_id, req.query?.platform)
    .then(respond({ req, res }))

export default customServerHandler({ handler: getShopHandler })
