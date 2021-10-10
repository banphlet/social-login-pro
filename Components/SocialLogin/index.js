import {
  Card,
  Layout,
  Select,
  SettingToggle,
  TextStyle,
  ContextualSaveBar,
  Tooltip,
  Banner,
  TextContainer,
  Link,
  Button
} from '@shopify/polaris'
import React, { useMemo } from 'react'
import useQuery from '../../Hooks/useQuery'
import useMutation from '../../Hooks/useMutation'

import SkeletonLoader from '../SkeletonLoader'
import isEqual from 'lodash/isEqual'
import SingleProvider from './SingleProvider'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { foundation } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useAppBridge } from '@shopify/app-bridge-react'
import { Toast } from '@shopify/app-bridge/actions'
import { useTranslation } from 'next-i18next'

const loginCode = '<div id="slm_social_login_widget"></div>'

export default function SocialLogin ({ data, shop, makeRequest }) {
  const { t } = useTranslation()
  const iframeRef = React.useRef()
  const shopifyApp = useAppBridge()
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
  const isFreePlan = /free/gi.test(shop.plan.name)

  const { paidProviders, unPaidProviders } = useMemo(() => {
    return {
      paidProviders: providerList,
      unPaidProviders: isFreePlan
        ? providerList.filter(
            provider => !shop.social_platforms.includes(provider)
          )
        : []
    }
  }, [providers])

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

  const onCopy = () => {
    const toastOptions = {
      message: 'Code copied to clipboard',
      duration: 5000
    }
    const toastNotice = Toast.create(shopifyApp, toastOptions)
    toastNotice.dispatch(Toast.Action.SHOW)
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
            disabled: loading || !formFields.social_platform_status,
            content: t('social_settings_contextual_save')
          }}
          discardAction={{
            onAction: () => setFormFields(initialFormFields),
            content: t('social_settings_contextual_discard')
          }}
        />
      ) : null}
      <Layout>
        <Layout.Section>
          <Layout.AnnotatedSection
            title={t('limit_login_settings_header')}
            description={t('limit_login_settings_subheader')}
          >
            {formFields.social_platform_status === 'A' && (
              <Banner
                status='info'
                action={{
                  content: t('enable_customer_accounts_banner_button_text'),
                  url: `https://${shop.platform_domain}/admin/settings/checkout`,
                  external: true
                }}
              >
                <p>
                  To allow customers to login to your site, kindly enable
                  Customer Accounts
                </p>
              </Banner>
            )}

            <SettingToggle
              action={{
                content:
                  formFields.social_platform_status === 'A'
                    ? t('social_settings_status_button_disable_text')
                    : t('social_settings_status_button_enable_text'),
                onAction: () =>
                  updateField(
                    'social_platform_status',
                    formFields?.social_platform_status === 'A' ? 'D' : 'A'
                  )
              }}
              enabled={formFields.social_platform_status === 'A'}
            >
              {t('social_settings_status_text')}{' '}
              <TextStyle variation='strong'>
                {formFields.social_platform_status === 'A'
                  ? t('social_settings_status_button_enable_text')
                  : t('social_settings_status_button_disable_text')}
              </TextStyle>
              .
            </SettingToggle>
            <div style={{ marginTop: 20 }} />

            <Card title={t('social_settings_widget_location_text')} sectioned>
              <TextContainer>
                <Banner>
                  <p>{t('social_settings_widget_location_copy_text')} </p>
                </Banner>
                <p>
                  <CopyToClipboard text={loginCode} onCopy={onCopy}>
                    <span>
                      <Tooltip
                        content={t(
                          'social_settings_widget_location_copy_toolpit_text'
                        )}
                        dismissOnMouseOut
                      >
                        <SyntaxHighlighter
                          language='handlebars'
                          style={foundation}
                        >
                          {loginCode}
                        </SyntaxHighlighter>
                      </Tooltip>
                    </span>
                  </CopyToClipboard>
                </p>
              </TextContainer>
            </Card>
            <div style={{ marginTop: 20 }} />
            <Select
              label='Button Type'
              options={[
                {
                  value: 'false',
                  label: t(
                    'social_settings_button_type_with_icon_dropdown_text'
                  )
                },
                {
                  value: 'true',
                  label: t(
                    'social_settings_button_type_with_text_dropdown_text'
                  )
                }
              ]}
              onChange={e => updateField('social_login_with_text', e)}
              value={String(formFields.social_login_with_text)}
            />
            <div style={{ marginTop: 20 }} />
            <Select
              label='Button Shape'
              options={[
                {
                  value: 'false',
                  label: t('social_settings_button_shape_square_dropdown_text')
                },
                {
                  value: 'true',
                  label: t('social_settings_button_shape_round_dropdown_text')
                }
              ]}
              onChange={e => updateField('social_button_round', e)}
              value={String(formFields.social_button_round)}
            />
            <div style={{ marginTop: 20 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {paidProviders.map(provider => (
                <SingleProvider
                  key={provider}
                  provider={provider}
                  updateField={updateField}
                  formFields={formFields}
                  createCharge={createCharge}
                  shop={shop}
                />
              ))}
            </div>
            {unPaidProviders.length ? (
              <div style={{ marginTop: 20 }} onClick={createCharge}>
                <Button primary>Upgrade to unlock more</Button>
              </div>
            ) : null}
            <div
              className='premium-feature '
              style={{ display: 'flex', flexWrap: 'wrap' }}
            >
              {unPaidProviders.map(provider => (
                <SingleProvider
                  key={provider}
                  provider={provider}
                  updateField={updateField}
                  formFields={formFields}
                  createCharge={createCharge}
                  shop={shop}
                />
              ))}
            </div>
          </Layout.AnnotatedSection>
        </Layout.Section>
        <div style={{ marginTop: 20 }} />

        <Layout.Section>
          <Card title={t('social_settings_site_preview_text')}>
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
