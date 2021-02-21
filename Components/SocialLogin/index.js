import {
    Card,
    Checkbox,
    Layout,
    OptionList,
    Select,
    SettingToggle,
    TextStyle
} from '@shopify/polaris'
import React from 'react'
import useQuery from '../../Hooks/useQuery'
import SkeletonLoader from '../SkeletonLoader'

export default function SocialLogin({ data, shop }) {
    const { loading, data: providers = {} } = useQuery({
        path: '/auth/providers'
    })

    const { data: dd } = useQuery({
        path: 'https://smartbot-wis.myshopify.com/account/login',
        useAxiosInstance: false
    })

    console.log(dd);

    const initialFormFields = {
        status: data?.status || shop?.status,
        social_login_with_text: data?.status || shop?.social_login_with_text,
        social_button_round: data?.social_button_round || shop?.social_button_round,
        social_platforms: data?.social_platforms || shop?.social_platforms
    }
    const [formFields, setFormFields] = React.useState(initialFormFields)

    const updateField = (field, value) =>
        setFormFields({ ...formFields, [field]: value })

    const providerList = Object.keys(providers)

    if (loading) return <SkeletonLoader />

    return (
        <Card.Section>
            <Layout>
                <Layout.Section>
                    <Layout.AnnotatedSection
                        title='Login Limit Settings'
                        description='Customize Social Login'
                    >
                        <SettingToggle
                            action={{
                                content: formFields.status === 'A' ? 'Disable' : 'Enable',
                                onAction: () =>
                                    updateField('status', formFields?.status === 'A' ? 'D' : 'A')
                            }}
                            enabled={formFields.status === 'A'}
                        >
                            This setting is{' '}
                            <TextStyle variation='strong'>
                                {formFields.status === 'A' ? 'Enabled' : 'Disabled'}
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
                            value={String(formFields.social_login_with_text)}
                        />
                        <div style={{ marginTop: 20 }} />

                        <div style={{ display: 'flex' }}>
                            {providerList.map(provider => {
                                const hasProvider = formFields.social_platforms?.includes(provider)
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
                                        <a
                                            className={`fa social-no-text fa-${provider}`}
                                            style={{ width: '100%' }}
                                        ></a>
                                        <Checkbox
                                            label={hasProvider ? 'Showing' : 'Hidden'}
                                            checked={hasProvider}
                                            onChange={state => updateField('social_platforms', state ? [...formFields?.social_platforms, provider] : formFields.social_platforms?.filter(p => p !== provider))}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </Layout.AnnotatedSection>
                </Layout.Section>
                <div style={{ marginTop: 20 }} />

                <Layout.Section>
                    <Card title='Preview' sectioned>
                        <iframe src='https://smartbot-wis.myshopify.com/account/login' ></iframe>
                    </Card>
                </Layout.Section>
            </Layout>
        </Card.Section>
    )
}
