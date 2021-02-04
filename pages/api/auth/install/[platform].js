'use strict'
import config from '../../../../server/config'
import customServerHandler from '../../../../server/request-handler'
import platforms from '../../../../server/services/platforms'

const acceptPermissionHandler = (req, res) =>
  res.redirect(
    platforms(req.query?.platform).getPermissionUrl({
      ...req.query,
      redirectUrl: `${config.get('APP_URL')}/permission-accepted/${
        req.query?.platform
      }`
    })
  )

export default customServerHandler({ handler: acceptPermissionHandler })
