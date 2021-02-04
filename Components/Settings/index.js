import React from 'react'
import {
  FormLayout,
  Card,
  Layout,
  TextField,
  Page,
  SettingToggle,
  TextStyle,
  EmptyState
} from '@shopify/polaris'
import startCase from 'lodash/startCase'
import CatalogModal from './CatalogModal'

export default function Settings ({ shop, socialAccounts = [] }) {
  const [active, setActive] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)

  const mergeCatalogIds = socialAccounts.reduce((acc, account) => {
    const mapped = account.catalog_ids.map(catalog => ({
      id: catalog,
      user_external_id: account.external_id,
      user_platform: account.platform
    }))
    acc.push(...mapped)
    return acc
  }, [])

  console.log(mergeCatalogIds)

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

  return (
    <div style={{ padding: 50 }}>
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

      <Layout>
        {addFirstCatalog}
        {/* {Array.from({ length: 3 }).map(() => (
          <Layout.Section oneHalf>
            <Card title='Florida'>
              <Card.Section>
                <TextStyle variation='subdued'>455 units available</TextStyle>
              </Card.Section>
              <Card.Section title='Items'>form here</Card.Section>
            </Card>
          </Layout.Section>
        ))} */}
      </Layout>
      <CatalogModal openModal={openModal} toggleModal={toggleModal} />
    </div>
  )
}
