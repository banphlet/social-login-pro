import React from 'react'
import {
  Button,
  Modal,
  Stack,
  TextContainer,
  TextField,
  Link,
  Toast
} from '@shopify/polaris'
import uniqBy from 'lodash/uniqBy'

export default function CatalogModal ({
  toggleModal,
  openModal,
  onUpdateSocialAccount,
  socialAccounts,
  loading
}) {
  const [catalogId, setCatalogId] = React.useState('')
  const [showToast, setShowToast] = React.useState(false)
  const toggleToast = () => setShowToast(!showToast)

  return (
    <div style={{ height: '500px' }}>
      {showToast ? (
        <Toast
          content='Catalog Id is about 15 characters'
          onDismiss={toggleToast}
        />
      ) : null}

      <Modal
        open={openModal}
        onClose={toggleModal}
        title='Add a new Catalog Id'
        primaryAction={{
          content: 'Add',
          onAction: async _ => {
            if (catalogId.length < 15) return toggleToast()
            await onUpdateSocialAccount({
              external_id: socialAccounts[0].external_id,
              catalogs: uniqBy(
                [...socialAccounts[0].catalogs, { id: catalogId }],
                'id'
              ),
              platform: socialAccounts[0]?.platform
            })
            setCatalogId('')
            toggleModal()
          },
          loading
        }}
        secondaryActions={[
          {
            content: 'Close',
            onAction: toggleModal
          }
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <Stack.Item>
              <TextContainer>
                <p>
                  Add a catalog id from facebook{' '}
                  <Link url='https://www.facebook.com/products/' external>
                    View Catalogs
                  </Link>
                </p>
              </TextContainer>
            </Stack.Item>
            <Stack.Item fill>
              <TextField
                value={catalogId}
                label='Catalog Id'
                placeholder='Enter facebook catalog id'
                onChange={setCatalogId}
                type='number'
                minLength={12}
              />
            </Stack.Item>
          </Stack>
        </Modal.Section>
      </Modal>
    </div>
  )
}
