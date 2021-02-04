import React from 'react'
import { EmptyState } from '@shopify/polaris'
import Settings from '../Components/Settings'

export default function Home ({ shop }) {
  React.useEffect(() => {
    FB.init({
      appId: process.env.NEXT_PUBLIC_APP_FACEBOOK_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v9.0'
    })
  }, [])
  const fbLogin = () => {
    window.FB.login(
      function (response) {
        console.log(response)
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
        action={{ content: 'Connect With Facebook', onAction: fbLogin }}
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

  return !shop?.social_accounts?.length ? (
    FacebookNotConnected
  ) : (
    <Settings shop={shop} />
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
