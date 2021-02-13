'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import customerService from '../../../server/services/customers'

const createOrUpdate = (req, res) =>
  customerService()
    .getCustomers(req.query)
    .then(respond({ res, req }))

export default customServerHandler({
  handler: createOrUpdate
})
