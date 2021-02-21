const styles = `
<style>

.col-1 {width: 8.33%;}
.col-2 {width: 16.66%;}
.col-3 {width: 25%;}
.col-4 {width: 33.33%;}
.col-5 {width: 41.66%;}
.col-6 {width: 50%;}
.col-7 {width: 58.33%;}
.col-8 {width: 66.66%;}
.col-9 {width: 75%;}
.col-10 {width: 83.33%;}
.col-11 {width: 91.66%;}
.col-12 {width: 100%;}
  @media only screen and (max-width: 768px) {
    [class*="col-"] {
      width: 100% !important
    }
  }
  .social-with-text {
    padding: 10px;
    width: 49%;
    text-align: center;
    text-decoration: none;
    margin: 5px 2px;
    font-size: 20px;
    text-transform: capitalize;
  }
  .social-with-text>span{
    margin-left: 10px
  }

  .round{
    border-radius: 50%;
  }

  .social-no-text {
    padding: 20px;
    font-size: 30px;
    width: 60px;
    text-align: center;
    text-decoration: none;
    margin: 5px 2px;
  }

.fa:hover {
    opacity: 0.7;
}

.fa-facebook {
  background: #3B5998;
  color: white;
}

.fa-twitter {
  background: #55ACEE;
  color: white;
}

.fa-google {
  background: #dd4b39;
  color: white;
}

.fa-linkedin {
  background: #007bb5;
  color: white;
}

.fa-youtube {
  background: #bb0000;
  color: white;
}

.fa-instagram {
  background: #125688;
  color: white;
}

.fa-pinterest {
  background: #cb2027;
  color: white;
}

.fa-snapchat-ghost {
  background: #fffc00;
  color: white;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

.fa-skype {
  background: #00aff0;
  color: white;
}

.fa-android {
  background: #a4c639;
  color: white;
}

.fa-dribbble {
  background: #ea4c89;
  color: white;
}

.fa-vimeo {
  background: #45bbff;
  color: white;
}

.fa-tumblr {
  background: #2c4762;
  color: white;
}

.fa-vine {
  background: #00b489;
  color: white;
}

.fa-foursquare {
  background: #45bbff;
  color: white;
}

.fa-stumbleupon {
  background: #eb4924;
  color: white;
}

.fa-flickr {
  background: #f40083;
  color: white;
}

.fa-yahoo {
  background: #430297;
  color: white;
}

.fa-soundcloud {
  background: #ff5500;
  color: white;
}

.fa-reddit {
  background: #ff5700;
  color: white;
}

.fa-rss {
  background: #ff6600;
  color: white;
}
</style>
`

import axios from 'axios'

const SERVER_URL = process.env.NEXT_PUBLIC_APP_URL
const request = axios.create({
  baseURL: `${SERVER_URL}/api`
})


function getParams(a) {
  var b = document.getElementsByTagName('script')
  for (var i = 0; i < b.length; i++) {
    if (b[i].src.indexOf('/' + a) > -1) {
      var c = b[i].src
        .split('?')
        .pop()
        .split('&')
      var p = {}
      for (var j = 0; j < c.length; j++) {
        var d = c[j].split('=')
        p[d[0]] = d[1]
      }
      return p
    }
  }
  return {}
}

const scriptParam = getParams('js/lla')


const addEmailToSectionStorage = email =>
  sessionStorage.setItem('email', email)

const isAccessRestricted = () =>
  request
    .post('/customers/is-access-restricted', {
      shop_id: scriptParam.shop_id
    })
    .then(response => response.data.data)

window.createOrUpdateCustomer = shopId =>
  request.post('/customers', {
    shop_id: shopId,
    email: sessionStorage.getItem('email')
  })

const trackEmailField = () => {
  const element = document.querySelector('[type=email]')
  element.addEventListener('input', e => {
    addEmailToSectionStorage(e.target.value)
  })
}

const preventFormSubmission = payload => {
  const banner = document.createElement('div')
  const textColor = payload.text_color || 'white'
  const backgroundColor = payload.background_color || '#B74949'
  banner.textContent =
    payload?.message || 'Too many login attempts, Try again later'
  banner.style = `background-color: ${backgroundColor};padding: 20px;color: ${textColor};margin-top: 20px;margin-bottom: 30px; border-radius: 5px`

  const form = document.getElementById('customer_login') // document.querySelector('[action="/account/login"]')
  const button = document.querySelector(
    '[action="/account/login"] [type=submit]'
  )
  form.prepend(banner)
  button.disabled = true
  form.onsubmit = function () {
    return false
  }
}

async function loadScript() {
  const isRestricted = await isAccessRestricted()
  if (!isRestricted.is_restricted) return
  preventFormSubmission(isRestricted)
}

function monitorOnClickSocialClick() {
  const items = document.querySelectorAll('.lla-button')
  items.forEach(item => {
    item.addEventListener('click', async (e) => {
      const platform = item.getAttribute('value')
      const { data: { authorizationUrl } } = await request.post(`/auth/signin/${platform}`, {
        shop_id: scriptParam.shop_id,
        domain: window.location.href
      })

      window.location.href = authorizationUrl
    })
  })
}


function socialLogins() {
  const selectedSocialBanners = ['facebook', 'google', 'twitter']
  const includesText = false
  const form = document.getElementById('customer_login')

  const socialContent = selectedSocialBanners.map(platform => {
    return `<a href='#' value="${platform}" class="lla-button round social-${includesText ? 'with' : 'no'}-text fa col-6 fa-${platform}">${includesText ? ` <span>Sign with ${platform} </span>` : ''}</a>`
  })

  const socialHtml = `<div style='margin: 10px'>
  ${styles}
      <div style='display: flex; margin-top: 30px; flex-wrap: wrap;justify-content:center'>
        ${socialContent.join('')}
    </div>
      
    </div>`
  form.insertAdjacentHTML('beforebegin', socialHtml)
}

const loginCustomerIn = async () => {
  const search = new URLSearchParams(window.location.search)
  const token = search.get('lla_token')
  if (!token) return
  const data = JSON.parse(atob(token))
  var bodyFormData = new FormData();
  bodyFormData.append('form_type', 'customer_login');
  bodyFormData.append('customer[email]', data.email)
  bodyFormData.append('customer[password]', data.password)
  await axios.post('/account/login', bodyFormData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  window.location.href = '/account'
}

loginCustomerIn()
loadScript()
window.onload = function () {
  trackEmailField()
  socialLogins()
  monitorOnClickSocialClick()
}
