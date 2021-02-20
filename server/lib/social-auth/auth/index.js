'use strict'

import curry from "lodash/fp/curry";
import pino from 'pino'
import extendRes from './extend-req'
import parseProviders from './parse-providers'
import config from '../../../config'
import * as defaultEvents from './default-events'
import * as defaultCallbacks from './default-callback'
import * as routes from './routes'

const logger = pino()


/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 * @param {import(".").NextAuthOptions} userOptions
 */
async function NextAuthHandler(userOptions, req, res) {

    const baseUrl = config.get('NEXT_PUBLIC_APP_URL')

    return new Promise(async resolve => { // eslint-disable-line no-async-promise-executor
        extendRes(req, res, resolve)

        if (!req.query.nextauth) {
            const error = 'Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly.'

            logger.error('MISSING_NEXTAUTH_API_ROUTE_ERROR', error)
            return res.status(500).end(`Error: ${error}`)
        }

        const {
            nextauth,
            action = nextauth[0],
            providerId = nextauth[1],
            error = nextauth[1]
        } = req.query

        // console.log(req.body);

        const providers = parseProviders({ providers: userOptions.providers, baseUrl })
        const provider = providers.find(({ id }) => id === providerId)

        if (provider &&
            provider.type === 'oauth' && provider.version?.startsWith('2') &&
            (!provider.protection && provider.state !== false)
        ) {
            provider.protection = 'state'
        }

        // User provided options are overriden by other options,
        // except for the options with special handling above
        req.options = {
            pages: {},
            ...userOptions,
            baseUrl,
            action,
            provider,
            providers,
            // Event messages
            events: {
                ...defaultEvents,
                ...userOptions.events
            },
            // Callback functions
            callbacks: {
                ...defaultCallbacks,
                ...userOptions.callbacks
            },
            logger
        }

        if (req.method === 'GET') {
            switch (action) {
                case 'providers':
                    return routes.providers(req, res)
                case 'signin':
                    return console.log('signin')
                case 'callback':
                    if (provider) {
                        return routes.callback(req, res)
                    }
                    break
                case 'verify-request':
                    if (pages.verifyRequest) {
                        return res.redirect(pages.verifyRequest)
                    }
                    return render.verifyRequest()
                default:
            }
        } else if (req.method === 'POST') {
            switch (action) {
                case 'signin':
                    return routes.signin(req, res)
                case 'callback':
                    if (provider) {
                        return routes.callback(req, res)
                    }
                    break
                default:
            }
        }
        return res.status(400).end(`Error: HTTP ${req.method} is not supported for ${req.url}`)
    })
}

/** Tha main entry point to next-auth */
export default curry(NextAuthHandler)