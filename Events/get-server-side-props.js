import request from '../Lib/requests'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const getShop = shopId =>
  request
    .get('/shops/me', {
      params: {
        shop_id: shopId
      }
    })
    .then(response => response.data)
    .catch(err => {
      // console.log(err?.response?.data)
    })

export async function getServerSideProps (context) {
  const shop = await getShop(context.query?.shop_id)
  if (!shop)
    return {
      notFound: true
    }
  return {
    props: {
      shop,
      ...(await serverSideTranslations(context.locale, ['common']))
    }
  }
}
