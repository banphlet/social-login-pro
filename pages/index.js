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
  Form,
  ContextualSaveBar
} from '@shopify/polaris'
import useMutation from '../Hooks/useMutation'
import isEqual from 'lodash/isEqual'

const options = [
  { label: 'IP', value: 'ip' },
  { label: 'EMAIL', value: 'email' }
]

export default function Home ({ shop }) {
  const { makeRequest, loading, data: { data } = {} } = useMutation({
    path: 'shops/me',
    method: 'put'
  })

  const initialFormFields = {
    limit_by: data?.limit_by || shop.limit_by,
    attempts: String(data?.attempts || shop.attempts)
  }
  const [formFields, setFormFields] = React.useState(initialFormFields)
  const [showContextSave, setShowContextSave] = React.useState(false)

  const onSave = async () => {
    await makeRequest({
      shop_id: shop.id,
      ...formFields
    })
    setShowContextSave(false)
  }

  const updateField = (field, value) =>
    setFormFields({ ...formFields, [field]: value })

  React.useEffect(() => {
    const hasChanges = !isEqual(initialFormFields, formFields)
    setShowContextSave(hasChanges)
  }, [formFields])

  return (
    <div style={{ padding: 50 }}>
      {loading ? <Loading /> : null}
      <p style={{ marginBottom: 30 }} />
      <Layout>
        <Layout.AnnotatedSection
          title='Login Limit Settings'
          description='Customize when account should be blocked'
        >
          <Card sectioned>
            <Form onSubmit={onSave}>
              {showContextSave ? (
                <ContextualSaveBar
                  fullWidth
                  message='Unsaved changes'
                  saveAction={{
                    onAction: onSave,
                    loading,
                    disabled: loading || !formFields.attempts
                  }}
                  discardAction={{
                    onAction: () => setFormFields(initialFormFields)
                  }}
                />
              ) : null}
              <FormLayout>
                <Select
                  label='Block By'
                  onChange={value => updateField('limit_by', value)}
                  options={options}
                  value={formFields.limit_by}
                />
                <TextField
                  label='Attempts'
                  helpText='Total login attempts before blocking a user'
                  type='number'
                  placeholder='Total login attempts'
                  value={formFields.attempts}
                  onChange={value => updateField('attempts', value)}
                  min={1}
                  error={!formFields.attempts && 'Enter attempts'}
                />
              </FormLayout>
              {/* <p style={{ marginBottom: 30 }} />
              <Stack distribution='trailing'>
                <Button submit disabled={loading} primary>
                  Save
                </Button>
              </Stack> */}
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
