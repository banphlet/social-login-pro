'use strict'
import { pick } from "lodash/fp";
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import shopService from '../../../server/services/shops'
import Cors from 'cors'


const getShopSettings = (req, res) =>
    shopService()
        .getByShopId(req?.query.shop_id)
        .then(pick(['social_login_with_text', 'social_platforms', 'social_platform_status', 'social_button_round']))
        .then(respond({ res, req }))

export default customServerHandler({
    handler: getShopSettings,
    middleware: Cors(),
})
