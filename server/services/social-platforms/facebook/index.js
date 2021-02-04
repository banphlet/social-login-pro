'use strict'
import * as fbLib from '../../../lib/facebook'

export const transformConnectPayload = async payload => {
  if (payload.access_token) {
    payload.access_token = await fbLib.generateLongUserAccessToken(
      payload.access_token
    )
  }
  return payload
}
