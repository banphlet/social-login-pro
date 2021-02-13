import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  Pagination,
  ResourceItem,
  ResourceList,
  TextStyle
} from '@shopify/polaris'
import React from 'react'
import useQuery from '../../Hooks/useQuery'

export default function Analytics ({ shop }) {
  const {
    data: { data = { docs: [], nextPage: 1, prevPage: 0, totalDocs: 1 } } = {},
    loading,
    refetch
  } = useQuery({
    path: 'shops/customers',
    initQuery: {
      shop_id: shop.id,
      limit: 10
    }
  })

  const paginate = page => {
    refetch({
      query: {
        page,
        shop_id: shop.id,
        limit: 10
      }
    })
  }

  return (
    <Card.Section title='All User Logins'>
      <ResourceList
        emptyState={
          <EmptyState
            heading='No Blocked Users Yet'
            image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
            fullWidth
          >
            <p>Blocked users will show up here</p>
          </EmptyState>
        }
        resourceName={{ singular: 'user', plural: 'users' }}
        items={data?.docs}
        hasMoreItems={data?.nextPage}
        loading={loading}
        renderItem={(item, id, index) => {
          return (
            <ResourceItem id={item?.item} verticalAlignment='center'>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {!index ? (
                    <TextStyle variation='strong'>IP Address</TextStyle>
                  ) : null}
                  <div style={{ marginTop: 20 }}>{item?.ip}</div>
                </div>
                <div>
                  {index ? null : (
                    <TextStyle variation='strong'>Email</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>{item?.email}</div>
                </div>
                <div>
                  {index ? null : (
                    <TextStyle variation='strong'>Status</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    <Badge status={item?.is_blocked ? 'critical' : 'success'}>
                      {item?.is_blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                </div>
                <div>
                  {index ? null : (
                    <TextStyle variation='strong'>Location</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    {item?.geo_location?.city}, {item?.geo_location?.country}
                  </div>
                </div>
                <div>
                  {index ? null : (
                    <TextStyle variation='strong'>Region</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    {item?.geo_location?.timezone}
                  </div>
                </div>
              </div>
            </ResourceItem>
          )
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          borderTop: ' 1px solid #dfe4e8'
        }}
      >
        <Pagination
          hasPrevious={data?.hasPrevPage}
          previousKeys={[74]}
          previousTooltip='j'
          onPrevious={() => paginate(data?.prevPage)}
          hasNext={data?.hasNextPage}
          nextKeys={[75]}
          nextTooltip='k'
          onNext={() => paginate(data?.nextPage)}
        />
      </div>
    </Card.Section>
  )
}
