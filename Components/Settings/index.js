import React from 'react'
import {
  FormLayout,
  Card,
  Layout,
  TextField,
  Heading,
  SettingToggle,
  TextStyle,
  EmptyState,
  Toast,
  Loading,
  Spinner,
  Button,
  Banner,
  TextContainer
} from '@shopify/polaris'
import startCase from 'lodash/startCase'
import CatalogModal from './CatalogModal'
import useMutation from '../../Hooks/useMutation'

export default function Settings ({
  shop,
  socialAccounts = [],
  updateSocialAccount,
  loading,
  fetchSocialAccounts
}) {
  const { loading: syncing, makeRequest } = useMutation({
    path: ''
  })
  const [openModal, setOpenModal] = React.useState(false)
  const [toastMessage, setShowToast] = React.useState('')

  const mergeCatalogIds = socialAccounts.reduce((acc, account) => {
    const mapped = account.catalogs.map(catalog => ({
      catalog,
      user_external_id: account.external_id,
      user_platform: account.platform,
      account_id: account.id
    }))
    acc.push(...mapped)
    return acc
  }, [])

  const toggleModal = React.useCallback(
    () => setOpenModal(openModal => !openModal),
    []
  )

  const addFirstCatalog = (
    <EmptyState
      heading='Add your first facebook catalog where products will be synced to'
      action={{
        content: 'Add your first Catalog',
        onAction: toggleModal
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
  )

  const onUpdateSocialAccount = (payload = {}) => {
    updateSocialAccount({
      shop_id: shop.id,
      ...payload
    })
  }

  const onSyncAllProducts = async account => {
    const payload = {
      catalog_id: account?.catalog.id,
      id: account.account_id,
      shop_id: shop.id
    }
    const {
      data: { message }
    } = await makeRequest(
      payload,
      `shops/social_accounts/${account?.account_id}/sync`
    )
    setShowToast(message)
    setTimeout(() => {
      fetchSocialAccounts({ useInitialQuery: true })
    }, 5000)
  }

  const removeCatalog = async account => {
    await makeRequest(
      {
        shop_id: shop.id,
        catalog_id: account.catalog.id,
        social_account_id: account.account_id
      },
      `shops/social_accounts/${account?.account_id}`
    )
    fetchSocialAccounts({ useInitialQuery: true })
  }

  return (
    <div style={{ padding: 50 }}>
      {toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => setShowToast('')} />
      ) : null}
      <Layout>
        {socialAccounts.map(account => (
          <Layout.AnnotatedSection
            title={`${startCase(account.platform)} Details`}
            description='Information on Connected Facebook Account'
            key={account.id}
          >
            <Card sectioned>
              <FormLayout>
                <TextField
                  type='text'
                  label='Account Name'
                  onChange={() => {}}
                  disabled
                  value={account.name}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        ))}
      </Layout>

      <div style={{ marginTop: 20 }}>
        <Heading>
          Manage Catalogs
          {mergeCatalogIds.length ? (
            <span style={{ marginLeft: 30 }}>
              <Button onClick={toggleModal}>Add Catalog</Button>
            </span>
          ) : null}
        </Heading>
        <div style={{ marginTop: 30 }} />
        <Layout>
          {mergeCatalogIds.length
            ? mergeCatalogIds.map(account => {
                const isPending = account.catalog.sync_status === 'pending'
                const isError = account.catalog.sync_status === 'error'
                const isActive = account.catalog?.status === 'A'
                return (
                  <Layout.Section oneHalf key={account?.catalog.id}>
                    <Card
                      title='Facebook Catalog'
                      actions={[
                        {
                          content: 'Remove',
                          onAction: () => removeCatalog(account),
                          destructive: true
                        },
                        {
                          content: 'View',
                          external: true,
                          url: `https://www.facebook.com/products/catalogs/${account?.catalog.id}/home`
                        },
                        {
                          content:
                            account?.catalog.status === 'A'
                              ? 'Disable'
                              : 'Enable',
                          onAction: () => {
                            const catalogIndex = socialAccounts[0].catalogs.findIndex(
                              item => item.id === account.catalog.id
                            )
                            const newCatalogs = [...socialAccounts[0].catalogs]
                            newCatalogs[catalogIndex] = {
                              ...account.catalog,
                              status:
                                account?.catalog.status === 'A' ? 'D' : 'A'
                            }
                            onUpdateSocialAccount({
                              catalogs: newCatalogs,
                              platform: socialAccounts[0]?.platform,
                              external_id: socialAccounts[0].external_id
                            })
                          }
                        }
                      ]}
                      primaryFooterAction={{
                        content: isPending
                          ? 'Sync Products'
                          : 'Products Synced',
                        destructive: true,
                        onAction: () => onSyncAllProducts(account),
                        disabled: !isPending || !isActive
                      }}
                      sectioned
                    >
                      <Card.Section>
                        <TextStyle variation='subdued'>
                          Catalog Id: {account?.catalog.id}
                        </TextStyle>
                      </Card.Section>
                      <TextContainer>
                        <Banner
                          status={
                            isPending
                              ? 'info'
                              : isError
                              ? 'critical'
                              : !isActive
                              ? 'critical'
                              : 'success'
                          }
                        >
                          {isPending
                            ? !isActive
                              ? 'Product sync is disabled. Product wont be synced to facebook'
                              : ' Click the Sync Product button to start syncing for this catalog '
                            : isError
                            ? account.catalog.error
                            : !isActive
                            ? 'Product sync is disabled. Product wont be synced to facebook'
                            : 'AutoSync in on. Latest products will be synced no action needed.'}
                        </Banner>
                      </TextContainer>
                    </Card>
                  </Layout.Section>
                )
              })
            : addFirstCatalog}
        </Layout>
        {syncing && (
          <div style={{ marginLeft: '40vw', marginTop: 20 }}>
            <Spinner accessibilityLabel='Spinner example' size='small' />
          </div>
        )}
      </div>
      <CatalogModal
        openModal={openModal}
        toggleModal={toggleModal}
        onUpdateSocialAccount={onUpdateSocialAccount}
        socialAccounts={socialAccounts}
        loading={loading}
      />
      {syncing && <Loading />}
    </div>
  )
}
