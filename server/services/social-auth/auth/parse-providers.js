'use strict'

/** Adds `signinUrl` and `callbackUrl` to each provider. */
export default function parseProviders({ providers = [], baseUrl }) {
    return providers.map((provider) => ({
        ...provider,
        signinUrl: `${baseUrl}/api/auth/signin/${provider.id}`,
        callbackUrl: `${baseUrl}/api/auth/callback/${provider.id}`
    }))
}