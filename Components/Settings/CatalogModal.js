import React from 'react'
import {
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
  loading,
  translate
}) {
  const [catalogId, setCatalogId] = React.useState('')
  const [showToast, setShowToast] = React.useState(false)
  const toggleToast = () => setShowToast(!showToast)

  return (
    <>
      {showToast ? (
        <Toast
          content={translate('catalog_id_error_message')}
          onDismiss={toggleToast}
        />
      ) : null}

      <Modal
        open={openModal}
        onClose={toggleModal}
        title={translate('add_new_catalog_id_title')}
        primaryAction={{
          content: translate('add'),
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
            content: translate('close'),
            onAction: toggleModal
          }
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <Stack.Item>
              <TextContainer>
                <p>
                  {translate('add_catalog_id_content')}{' '}
                  <Link url='https://www.facebook.com/products/' external>
                    {translate('view_catalogs')}
                  </Link>
                </p>
              </TextContainer>
            </Stack.Item>
            <Stack.Item fill>
              <TextField
                value={catalogId}
                label={translate('add_catalog_id_input_label')}
                placeholder={translate('add_catalog_id_input_placeholder')}
                onChange={setCatalogId}
                type='number'
                minLength={12}
              />
            </Stack.Item>
          </Stack>
        </Modal.Section>
      </Modal>
    </>
  )
}
