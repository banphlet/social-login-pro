'use strict'

import * as facebook from './facebook'

const platformApis = {
  facebook
}

const wrongPlatformError = _ => {
  //  eslint-disable-next-line
  throw Error('social platform is not supported')
}

export default function platforms (platform) {
  return platformApis[platform] || wrongPlatformError()
}
