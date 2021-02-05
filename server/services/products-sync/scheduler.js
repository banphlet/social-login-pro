'use strict'

import schedule from 'node-schedule'
import { verifyPush } from '../../lib/facebook'
import { required } from '../../lib/utils'
import { socialAccount } from '../../models'
import { SyncStatus } from '../../models/social-accounts/schema'

const checkHandleStatus = async params => {
  const status = await verifyPush(params)
  const errorMessage = status.data[0]?.errors[0]?.message
  await socialAccount().updateByCatalogIdAndSocialAccount({
    id: params.id,
    catalogId: params.catalogId,
    update: {
      'catalogs.$.sync_status': errorMessage
        ? SyncStatus.ERRORS
        : SyncStatus.COMPLETED,
      ...(errorMessage ? { 'catalogs.$.error': errorMessage } : {})
    }
  })
}

const addOneMinute = () => {
  const date = new Date()
  return new Date(date.getTime() + 0.5 * 60000)
}

export default function addNewJob ({
  id = required('id'),
  catalogId = required('catalogId'),
  handle = required('handle'),
  accessToken = required('accessToken')
}) {
  return schedule.scheduleJob(
    addOneMinute(),
    checkHandleStatus.bind(null, { id, catalogId, handle, accessToken })
  )
}
