'use strict'
import customServerHandler from '../../server/request-handler'
import respond from '../../server/request-handler/respond'
import Cors from 'cors'

const getIp = (req, res) => respond({ req, res })(req.location)

export default customServerHandler({ handler: getIp, middleware: Cors() })
