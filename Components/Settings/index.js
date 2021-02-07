import React from 'react'
import {
  FormLayout,
  Card,
  Layout,
  TextField,
  Heading,
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
import nextI18n from '../../i18n'

export default function Settings ({
  shop,
  socialAccounts = [],
  updateSocialAccount,
  loading,
  fetchSocialAccounts
}) {
  const { t: translate } = nextI18n.useTranslation()

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
      heading={translate('no_catalogs_empty_header_text')}
      action={{
        content: translate('no_catalogs_empty_button_text'),
        onAction: toggleModal
      }}
      image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
      fullWidth
    >
      <p>{translate('no_catalogs_empty_content_text')}</p>
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
    await makeRequest(
      payload,
      `shops/social_accounts/${account?.account_id}/sync`
    )
    setShowToast(translate('start_sync_loading'))
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
            title={translate('account_section_detail', {
              platform: startCase(account.platform)
            })}
            description={translate('account_section_detail_text')}
            key={account.id}
          >
            <Card sectioned>
              <FormLayout>
                <TextField
                  type='text'
                  label={translate('account_section_input_text')}
                  onChange={() => {}}
                  disabled
                  value={account?.name || account?.external_id}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        ))}
      </Layout>

      <div style={{ marginTop: 20 }}>
        <Heading>
          {translate('manage_catalogs_text')}
          {mergeCatalogIds.length ? (
            <span style={{ marginLeft: 30 }}>
              <Button onClick={toggleModal}>
                {translate('add_catalogs_text')}
              </Button>
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
                      title={translate('catalog_card_title')}
                      actions={[
                        {
                          content: translate('remove'),
                          onAction: () => removeCatalog(account),
                          destructive: true
                        },
                        {
                          content: translate('view'),
                          external: true,
                          url: `https://www.facebook.com/products/catalogs/${account?.catalog.id}/home`
                        },
                        {
                          content:
                            account?.catalog.status === 'A'
                              ? translate('enable')
                              : translate('disable'),
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
                          ? translate('start_sync')
                          : translate('products_synced'),
                        destructive: true,
                        onAction: () => onSyncAllProducts(account),
                        disabled: !isPending || !isActive
                      }}
                      sectioned
                    >
                      <Card.Section>
                        <TextStyle variation='subdued'>
                          {translate('catalog_id')}: {account?.catalog.id}
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
                              ? translate('pending_sync_status_inactive')
                              : translate('pending_sync_status_active')
                            : isError
                            ? account.catalog.error
                            : !isActive
                            ? translate('error_sync_status_inactive')
                            : translate('pushed_sync_status_active')}
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
            <Spinner accessibilityLabel='loader' size='small' />
          </div>
        )}
      </div>
      <CatalogModal
        openModal={openModal}
        toggleModal={toggleModal}
        onUpdateSocialAccount={onUpdateSocialAccount}
        socialAccounts={socialAccounts}
        loading={loading}
        translate={translate}
      />
      {syncing && <Loading />}
    </div>
  )
}
