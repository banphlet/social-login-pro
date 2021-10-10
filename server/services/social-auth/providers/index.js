import Apple from './apple'
import Atlassian from './atlassian'
import Auth0 from './auth0'
import AzureADB2C from './azure-ad-b2c'
import Basecamp from './basecamp'
import BattleNet from './battlenet'
import Box from './box'
import Bungie from './bungie'
import Cognito from './cognito'
import Credentials from './credentials'
import Discord from './discord'
import Email from './email'
import EVEOnline from './eveonline'
import Facebook from './facebook'
import Foursquare from './foursquare'
import FusionAuth from './fusionauth'
import GitHub from './github'
import GitLab from './gitlab'
import Google from './google'
import IdentityServer4 from './identity-server4'
import LINE from './line'
import LinkedIn from './linkedin'
import MailRu from './mailru'
import Medium from './medium'
import Netlify from './netlify'
import Okta from './okta'
import Reddit from './reddit'
import Salesforce from './salesforce'
import Slack from './slack'
import Spotify from './spotify'
import Strava from './strava'
import Twitch from './twitch'
import Twitter from './twitter'
import VK from './vk'
import Yandex from './yandex'
import Tumblr from './tumblr'
import Wordpress from './wordpress'
import config from '../../../config'
import Instagram from './instagram'

const providerMap = {
  Instagram,
  Wordpress,
  Tumblr,
  Apple,
  Atlassian,
  Auth0,
  AzureADB2C,
  Basecamp,
  BattleNet,
  Box,
  Bungie,
  Cognito,
  Credentials,
  Discord,
  Email,
  EVEOnline,
  Facebook,
  Foursquare,
  FusionAuth,
  GitHub,
  GitLab,
  Google,
  IdentityServer4,
  LINE,
  LinkedIn,
  MailRu,
  Medium,
  Netlify,
  Okta,
  Reddit,
  Salesforce,
  Slack,
  Spotify,
  Strava,
  Twitch,
  Twitter,
  VK,
  Yandex
}

function parseProviders ({ providers = [], baseUrl }) {
  return providers.map(provider => ({
    ...provider,
    signinUrl: `${baseUrl}/api/auth/signin/${provider.id}`,
    callbackUrl: `${baseUrl}/api/auth/callback/${provider.id}`
  }))
}

// only providers that are object are allow. mostly because those are enabled
const allowedProvidersArr = Object.values(providerMap).filter(
  provider => typeof provider !== 'function'
)

const providersList = parseProviders({
  providers: allowedProvidersArr,
  baseUrl: config.get('NEXT_PUBLIC_APP_URL')
})

export { providerMap, providersList }
