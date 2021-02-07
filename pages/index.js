import React from 'react'
import { EmptyState } from '@shopify/polaris'
import Settings from '../Components/Settings'
import useMutation from '../Hooks/useMutation'
import useQuery from '../Hooks/useQuery'
import SkeletonLoader from '../Components/SkeletonLoader'
import nextI18n from '../i18n'

export default function Home ({ shop }) {
  const { t: translate } = nextI18n.useTranslation()
  const { makeRequest, loading } = useMutation({
    path: 'shops/social_accounts',
    method: 'post'
  })
  const {
    data: { data: socialAccounts = [] } = {},
    loading: fetching,
    refetch,
    updateData
  } = useQuery({
    path: 'shops/social_accounts',
    initQuery: {
      shop_id: shop.id
    }
  })

  React.useEffect(() => {
    window.FB?.init({
      appId: process.env.NEXT_PUBLIC_APP_FACEBOOK_ID,
      autoLogAppEvents: false,
      xfbml: false,
      version: 'v9.0'
    })
  })

  const fbLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api('/me', async data => {
            const payload = {
              access_token: response?.authResponse.accessToken,
              external_id: response.authResponse.userID,
              platform: 'facebook',
              shop_id: shop.id,
              name: data.name
            }
            await makeRequest(payload)
            refetch({ useInitialQuery: true })
          })
        } else {
          // user cancelled
        }
      },
      {
        scope: 'catalog_management'
      }
    )
  }

  const FacebookNotConnected = (
    <div>
      <EmptyState
        heading={translate('empty_account_heading')}
        action={{
          content: translate('empty_account_button_text'),
          onAction: fbLogin,
          loading
        }}
        image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
        fullWidth
      >
        <p>{translate('empty_account_context_text')}</p>
      </EmptyState>
    </div>
  )

  if (fetching) return <SkeletonLoader />

  const updateSocialAccount = async payload => {
    const { data } = await makeRequest(payload)
    const accountIndex = [...socialAccounts].findIndex(
      acc => acc.id === data.id
    )
    socialAccounts[accountIndex] = data
    updateData({
      data: [...socialAccounts]
    })
  }

  return !socialAccounts.length ? (
    FacebookNotConnected
  ) : (
    <Settings
      updateSocialAccount={updateSocialAccount}
      shop={shop}
      socialAccounts={socialAccounts}
      loading={loading}
      fetchSocialAccounts={refetch}
    />
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
