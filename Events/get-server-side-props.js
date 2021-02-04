import request from '../Lib/requests'

const getShop = instanceId =>
  request
    .get('/shops/me', {
      params: {
        instance_id: instanceId,
        platform: 'wix'
      }
    })
    .then(response => response.data)
    .catch(err => {
      throw err
    })

export async function getServerSideProps (context) {
  const shop = await getShop(context.query?.instance)
  return {
    props: {
      shop
    }
  }
}
