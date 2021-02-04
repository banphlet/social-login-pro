'use strict'
import customServerHandler from '../../../../server/request-handler'
import { httpStatusCodes } from '../../../../server/request-handler/error-handler'
import respond from '../../../../server/request-handler/respond'
import authService from '../../../../server/services/auth'

const acceptPermissionHandler = (req, res) =>
authService
    .installShop(req.query)
    .then(respond({ status: httpStatusCodes.OK, req, res }))

export default customServerHandler({ handler: acceptPermissionHandler })
