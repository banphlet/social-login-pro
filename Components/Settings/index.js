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
  Button
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
  const [active, setActive] = React.useState(false)
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

  const handleToggle = React.useCallback(() => setActive(active => !active), [])

  const toggleModal = React.useCallback(
    () => setOpenModal(active => !active),
    []
  )

  const contentStatus = active ? 'Disable' : 'Enable'
  const textStatus = active ? 'enabled' : 'disabled'

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
      catalogs: [account?.catalog.id],
      id: account.account_id
    }
    const {
      data: { message }
    } = await makeRequest(
      payload,
      `shops/social_accounts/${account?.catalog.account_id}/sync`
    )
    setShowToast(message)
    setTimeout(() => {
      fetchSocialAccounts({ useInitialQuery: true })
    }, 10000)
  }

  return (
    <div style={{ padding: 50 }}>
      {toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => setShowToast('')} />
      ) : null}
      <Layout>
        <Layout.AnnotatedSection
          title='General Settings'
          description='Enable or disable product syncing'
        >
          <SettingToggle
            action={{
              content: contentStatus,
              onAction: handleToggle
            }}
            enabled={active}
          >
            This setting is{' '}
            <TextStyle variation='strong'>{textStatus}</TextStyle>.
          </SettingToggle>
        </Layout.AnnotatedSection>
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
          Manage Catalogs <Button onClick={toggleModal}>Add Catalog</Button>
        </Heading>
        <div style={{ marginTop: 30 }} />
        <Layout>
          {mergeCatalogIds.length
            ? mergeCatalogIds.map(account => (
                <Layout.Section oneHalf key={account?.catalog.id}>
                  <Card
                    title='Facebook Catalog'
                    actions={[
                      { content: 'Remove' },
                      {
                        content: 'View',
                        external: true,
                        url: `https://www.facebook.com/products/catalogs/${account?.catalog.id}/home`
                      }
                    ]}
                    primaryFooterAction={{
                      content:
                        account.catalog.sync_status === 'pending'
                          ? 'Sync Products'
                          : 'Products Synced',
                      destructive: true,
                      onAction: () => onSyncAllProducts(account),
                      disabled: account.catalog.sync_status !== 'pending'
                    }}
                  >
                    <Card.Section>
                      <TextStyle variation='subdued'>
                        Catalog Id: {account?.catalog.id}
                      </TextStyle>
                    </Card.Section>
                  </Card>
                </Layout.Section>
              ))
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
