export default (options) => {
    return {
        id: 'tumblr',
        name: 'Tumblr',
        type: 'oauth',
        version: '1.0A',
        scope: '',
        accessTokenUrl: 'https://www.tumblr.com/oauth/access_token',
        requestTokenUrl: 'https://www.tumblr.com/oauth/request_token',
        authorizationUrl: 'https://www.tumblr.com/oauth/authorize',
        profileUrl:
            'https://api.tumblr.com/v2/user/info?include_email=true',
        profile: (profile) => {
            console.log(profile);
            return {
                id: profile.id_str,
                name: profile.name,
                email: profile.email,
                image: profile.profile_image_url_https.replace(/_normal\.jpg$/, '.jpg')
            }
        },
        ...options
    }
}
