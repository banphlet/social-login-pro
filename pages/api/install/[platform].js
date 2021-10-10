'use strict'
import config from '../../../server/config'
import customServerHandler from '../../../server/request-handler'
import platforms from '../../../server/services/platforms'

const acceptPermissionHandler = (req, res) => {
  const redirectUrl = platforms(req.query?.platform).getPermissionUrl({
    ...req.query,
    redirectUrl: `${config.get(
      'NEXT_PUBLIC_APP_URL'
    )}/api/permission-accepted/${req.query?.platform}`
  })
  res.redirect(redirectUrl)
}

export default customServerHandler({
  handler: acceptPermissionHandler,
  middleware: Cors()
})
