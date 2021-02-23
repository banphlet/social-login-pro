import {
  Card,
  Checkbox,
  Layout,
  Select,
  SettingToggle,
  TextStyle,
  ContextualSaveBar,
  Button,
  Tooltip
} from '@shopify/polaris'
import React from 'react'
import useQuery from '../../Hooks/useQuery'
import useMutation from '../../Hooks/useMutation'

import SkeletonLoader from '../SkeletonLoader'
import isEqual from 'lodash/isEqual'

export default function SocialLogin ({ data, shop, makeRequest }) {
  const iframeRef = React.useRef()
  const [showContextSave, setShowContextSave] = React.useState(false)
  const { loading, data: providers = {} } = useQuery({
    path: '/auth/providers'
  })
  const { makeRequest: createNewCharge } = useMutation({
    path: '/plans/charge'
  })

  const initialFormFields = {
    social_platform_status:
      data?.social_platform_status || shop?.social_platform_status,
    social_login_with_text:
      data?.social_login_with_text || shop?.social_login_with_text,
    social_button_round: data?.social_button_round || shop?.social_button_round,
    social_platforms: data?.social_platforms || shop?.social_platforms
  }
  const [formFields, setFormFields] = React.useState(initialFormFields)

  React.useEffect(() => {
    const hasChanges = !isEqual(initialFormFields, formFields)
    setShowContextSave(hasChanges)
  }, [formFields])

  const updateField = (field, value) =>
    setFormFields({ ...formFields, [field]: value })

  const providerList = Object.keys(providers)

  if (loading) return <SkeletonLoader />

  const onSave = async () => {
    await makeRequest({
      shop_id: shop.id,
      ...formFields
    })
    iframeRef.current.contentWindow.location.reload()
    setShowContextSave(false)
  }

  const createCharge = async () => {
    const response = await createNewCharge({
      shop_id: shop.id
    })
    window.parent.location.href = response.data
  }

  return (
    <Card.Section>
      {showContextSave ? (
        <ContextualSaveBar
          fullWidth
          message='Unsaved changes'
          saveAction={{
            onAction: onSave,
            loading,
            disabled: loading || !formFields.social_platform_status
          }}
          discardAction={{
            onAction: () => setFormFields(initialFormFields)
          }}
        />
      ) : null}
      <Layout>
        <Layout.Section>
          <Layout.AnnotatedSection
            title='Login Limit Settings'
            description='Customize Social Login'
          >
            <SettingToggle
              action={{
                content:
                  formFields.social_platform_status === 'A'
                    ? 'Disable'
                    : 'Enable',
                onAction: () =>
                  updateField(
                    'social_platform_status',
                    formFields?.social_platform_status === 'A' ? 'D' : 'A'
                  )
              }}
              enabled={formFields.social_platform_status === 'A'}
            >
              This setting is{' '}
              <TextStyle variation='strong'>
                {formFields.social_platform_status === 'A'
                  ? 'Enabled'
                  : 'Disabled'}
              </TextStyle>
              .
            </SettingToggle>
            <div style={{ marginTop: 20 }} />
            <Select
              label='Button Type'
              options={[
                { value: 'false', label: 'Only Icons' },
                { value: 'true', label: 'Show with Text' }
              ]}
              onChange={e => updateField('social_login_with_text', e)}
              value={String(formFields.social_login_with_text)}
            />
            <div style={{ marginTop: 20 }} />
            <Select
              label='Button Shape'
              options={[
                { value: 'false', label: 'Square Shape' },
                { value: 'true', label: 'Round Shape' }
              ]}
              onChange={e => updateField('social_button_round', e)}
              value={String(formFields.social_button_round)}
            />
            <div style={{ marginTop: 20 }} />

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {providerList.map(provider => {
                const hasProvider = formFields.social_platforms?.includes(
                  provider
                )
                const canUpdateSettings = !/free/gi.test(shop.plan.name)
                return (
                  <div
                    key={provider}
                    style={{
                      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                      transition: 0.3,
                      width: '90px',
                      textAlign: 'center',
                      margin: 10
                    }}
                  >
                    <Tooltip active={false} content={provider}>
                      <a
                        className={`fab social-no-text fa-${provider}`}
                        style={{ width: '100%' }}
                      ></a>
                    </Tooltip>

                    {canUpdateSettings ? (
                      <Checkbox
                        label={hasProvider ? 'Showing' : 'Hidden'}
                        checked={hasProvider}
                        onChange={state =>
                          updateField(
                            'social_platforms',
                            state
                              ? [...formFields?.social_platforms, provider]
                              : formFields.social_platforms?.filter(
                                  p => p !== provider
                                )
                          )
                        }
                      />
                    ) : (
                      <Button onClick={createCharge} destructive>
                        Upgrade
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </Layout.AnnotatedSection>
        </Layout.Section>
        <div style={{ marginTop: 20 }} />

        <Layout.Section>
          <Card title='Site Preview'>
            <div style={{ height: '700px' }}>
              <iframe
                ref={iframeRef}
                width='100%'
                height='100%'
                align='center'
                src={`/api/shops/site?url=${`https://${shop?.platform_domain}/account/login#customer_login`}`}
              />
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Card.Section>
  )
}
