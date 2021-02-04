import React from 'react'
import {
  Button,
  Modal,
  Stack,
  TextContainer,
  TextField,
  Link
} from '@shopify/polaris'

export default function CatalogModal ({ toggleModal, openModal }) {
  const DISCOUNT_LINK = 'https://polaris.shopify.com/'

  const [active, setActive] = React.useState(true)
  const node = React.useRef(null)

  const handleClick = React.useCallback(() => {
    node.current && node.current.input.focus()
  }, [])

  const handleFocus = React.useCallback(() => {
    if (node.current == null) {
      return
    }
    node.current.input.select()
    document.execCommand('copy')
  }, [])

  return (
    <div style={{ height: '500px' }}>
      <Modal
        open={openModal}
        onClose={toggleModal}
        title='Add a new Catalog Id'
        primaryAction={{
          content: 'Add',
          onAction: toggleModal
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
                ref={node}
                label='Catalog Id'
                onFocus={handleFocus}
                placeholder='Enter facebook catalog id'
                onChange={() => {}}
              />
            </Stack.Item>
          </Stack>
        </Modal.Section>
      </Modal>
    </div>
  )
}
