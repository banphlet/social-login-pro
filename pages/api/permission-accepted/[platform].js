'use strict'
import customServerHandler from '../../../server/request-handler'
import authService from '../../../server/services/auth'

const acceptPermissionHandler = (req, res) =>
authService
    .installShop(req.query)
    .then(data=>{
        res.redirect(data.url)
    })

export default customServerHandler({ handler: acceptPermissionHandler })
