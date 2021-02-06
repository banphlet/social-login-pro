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
      console.log(err.response.data)
    })

export async function getServerSideProps (context) {
  const shop = await getShop(context.query?.instance)
  if (!shop)
    return {
      notFound: true
    }
  return {
    props: {
      shop
    }
  }
}
