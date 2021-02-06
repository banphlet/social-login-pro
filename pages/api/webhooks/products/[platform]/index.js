'use strict'
import customServerHandler from '../../../../../server/request-handler'
import syncService from '../../../../../server/services/products-sync'
import respond from '../../../../../server/request-handler/respond'

const syncHandler = (req, res) =>
  syncService
    .webhookProduct(Object.assign({}, { token: req.body }, req.query))
    .then(respond({ req, res }))

export default customServerHandler({ handler: syncHandler, method: 'POST' })
