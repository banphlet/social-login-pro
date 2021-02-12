'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import Cors from 'cors'
import customerService from '../../../server/services/customers'

const isAccessRestricted = (req, res) =>
  customerService()
    .isAccessRestricted(Object.assign({}, req.body, { ip: req.location.ip }))
    .then(respond({ res, req }))

export default customServerHandler({
  handler: isAccessRestricted,
  middleware: Cors(),
  method: 'POST'
})
