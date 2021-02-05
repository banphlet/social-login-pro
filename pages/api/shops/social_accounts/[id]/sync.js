'use strict'
import customServerHandler from '../../../../../server/request-handler'
import syncProductsToCatalogs from '../../../../../server/services/products-sync'
import respond from '../../../../../server/request-handler/respond'

const syncHandler = (req, res) =>
  syncProductsToCatalogs(req.body).then(respond({ req, res }))

export default customServerHandler({ handler: syncHandler, method: 'POST' })
