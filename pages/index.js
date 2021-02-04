import React from 'react'
import { EmptyState, Toast } from '@shopify/polaris'
import Settings from '../Components/Settings'
import useMutation from '../Hooks/useMutation'
import useQuery from '../Hooks/useQuery'
import SkeletonLoader from '../Components/SkeletonLoader'

export default function Home ({ shop }) {
  const { makeRequest, loading } = useMutation({
    path: 'shops/social_accounts',
    method: 'post'
  })
  const {
    data: { data: socialAccounts = [] } = {},
    loading: fetching
  } = useQuery({
    path: 'shops/social_accounts',
    initQuery: {
      shop_id: shop.id
    }
  })

  React.useEffect(() => {
    window.FB?.init({
      appId: process.env.NEXT_PUBLIC_APP_FACEBOOK_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v9.0'
    })
  }, [])
  const fbLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api('/me', data => {
            console.log(data)
            const payload = {
              access_token: response?.authResponse.accessToken,
              external_id: response.authResponse.userID,
              platform: 'facebook',
              shop_id: shop.id,
              name: data.name
            }
            makeRequest(payload)
          })
        } else {
          // user cancelled
        }
      },
      {
        scope:
          'catalog_management,business_management,ads_management,ads_read,pages_read_engagement,pages_show_list'
      }
    )
  }

  const FacebookNotConnected = (
    <div>
      <EmptyState
        heading='Sync products with your facebook catalog'
        action={{
          content: 'Connect With Facebook',
          onAction: fbLogin,
          loading
        }}
        secondaryAction={{
          content: 'Learn more',
          url: 'https://help.shopify.com'
        }}
        image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
        fullWidth
      >
        <p>
          Sync your products to facebook catalog. Create a shop to sell on
          facebook and instagram
        </p>
      </EmptyState>
    </div>
  )

  if (fetching) return <SkeletonLoader />

  return !socialAccounts.length ? (
    FacebookNotConnected
  ) : (
    <Settings shop={shop} socialAccounts={socialAccounts} />
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
