'use strict'

import * as wix from './wix'

const platformApis = {
  wix
}

const wrongPlatformError = _ => {
  //  eslint-disable-next-line
  throw Error('platform is not supported')
}

export default function platforms (platform) {
  return platformApis[platform] || wrongPlatformError()
}
