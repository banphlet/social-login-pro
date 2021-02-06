'use strict'
import customServerHandler from '../../../../../server/request-handler'
import shopService from '../../../../../server/services/shops'
import respond from '../../../../../server/request-handler/respond'

const syncHandler = (req, res) =>
  shopService()
    .removeCatalogById(req.body || {})
    .then(respond({ req, res }))

export default customServerHandler({ handler: syncHandler, method: 'POST' })
