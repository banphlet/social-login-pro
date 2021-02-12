'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import Cors from 'cors'
import customerService from '../../../server/services/customers'

const createOrUpdate = (req, res) =>
  customerService()
    .createOrUpdate(Object.assign({}, req.body, { ip: req.location.ip }))
    .then(respond({ res, req }))

export default customServerHandler({
  handler: createOrUpdate,
  middleware: Cors(),
  method: 'POST'
})
