import React from 'react'
import {
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Stack,
  Button,
  EmptyState,
  Loading,
  Form
} from '@shopify/polaris'
import useMutation from '../Hooks/useMutation'

const options = [
  { label: 'IP', value: 'ip' },
  { label: 'EMAIL', value: 'email' }
]

export default function Home ({ shop }) {
  const [attempts, setAttempts] = React.useState(String(shop?.attempts))
  const [limitBy, setLimitBy] = React.useState(shop?.limit_by)

  const { makeRequest, loading } = useMutation({
    path: 'shops/me',
    method: 'put'
  })

  const onSave = () => {
    makeRequest({
      shop_id: shop.id,
      attempts,
      limit_by: limitBy
    })
  }

  return (
    <div style={{ padding: 50 }}>
      {loading ? <Loading /> : null}

      {/* <Stack distribution='trailing'>
        <Button onClick={onSave} disabled={loading} primary>
          Save
        </Button>
      </Stack> */}
      <Layout>
        <Layout.AnnotatedSection
          title='Login Limit Settings'
          description='Customize when account should be blocked'
        >
          <Card sectioned>
            <Form onSubmit={onSave}>
              <FormLayout>
                <Select
                  label='Limit By'
                  onChange={setLimitBy}
                  options={options}
                  value={limitBy}
                />
                <TextField
                  label='Attempts'
                  helpText='Total login attempts before blocking a user'
                  type='number'
                  placeholder='Total login attempts'
                  value={attempts}
                  onChange={setAttempts}
                  min={2}
                />
              </FormLayout>
              <p style={{ marginBottom: 30 }} />
              <Stack distribution='trailing'>
                <Button submit disabled={loading} primary>
                  Save
                </Button>
              </Stack>
            </Form>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <p style={{ marginBottom: 30 }} />

      <EmptyState
        heading='No Blocked Users Yet'
        image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
        fullWidth
      >
        <p>Blocked users will show up here</p>
      </EmptyState>
    </div>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
