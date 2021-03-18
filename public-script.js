import axios from 'axios'

const SERVER_URL = process.env.NEXT_PUBLIC_APP_URL
const request = axios.create({
  baseURL: `${SERVER_URL}/api`
})

function getParams (a) {
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

const addEmailToSectionStorage = email => sessionStorage.setItem('email', email)

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

async function loadScript () {
  const isRestricted = await isAccessRestricted()
  if (!isRestricted.is_restricted) return
  preventFormSubmission(isRestricted)
}

function monitorOnClickSocialClick () {
  const items = document.querySelectorAll('.lla-button')
  items.forEach(item => {
    item.addEventListener('click', async e => {
      const platform = item.getAttribute('value')
      const {
        data: { authorizationUrl }
      } = await request.post(`/auth/signin/${platform}`, {
        shop_id: scriptParam.shop_id,
        domain: window.location.href
      })

      window.location.href = authorizationUrl
    })
  })
}

async function socialLogins () {
  const { data: { data: shop } = {} } = await request.get('/customers/shop', {
    params: { shop_id: scriptParam.shop_id }
  })
  const isActive = shop.social_platform_status === 'A'
  if (!isActive) return
  const selectedSocialBanners = shop.social_platforms
  const includesText = shop.social_login_with_text
  const isRound = !shop.social_login_with_text && shop.social_button_round
  const form = document.getElementById('customer_login')

  const socialContent = selectedSocialBanners.map(platform => {
    return `<a href='#' value="${platform}" class="lla-button ${
      isRound ? 'round' : ''
    } ${includesText ? 'col-6' : ''} social-${
      includesText ? 'with' : 'no'
    }-text fab fa-${platform}">${
      includesText ? ` <span>Sign with ${platform} </span>` : ''
    }</a>`
  })

  const socialHtml = `<div style='margin-top: 10px; margin-bottom: 10px' class='lla'>
      <div style='display: flex; margin-top: 30px; flex-wrap: wrap;justify-content:center'>
        ${socialContent.join('')}
    </div>
      
    </div>`
  form.insertAdjacentHTML('beforebegin', socialHtml)
  monitorOnClickSocialClick()
}

const createInputWithName = ({ value, type }) => {
  const input = document.createElement('input')
  input.type = type
  input.name = `customer[${type}]`
  input.setAttribute('value', value)
  return input
}

const formBasedLogin = () => {
  const search = new URLSearchParams(window.location.search)
  const token = search.get('lla_token')
  if (!token) return
  const data = JSON.parse(atob(token))
  const emailInput = createInputWithName({
    type: 'email',
    value: data.email
  })
  const passwordInput = createInputWithName({
    type: 'password',
    value: data.password
  })
  const form = document.createElement('form')
  form.method = 'post'
  form.action = '/account/login'
  form.appendChild(emailInput)
  form.appendChild(passwordInput)
  document.head.appendChild(form)

  form.submit()
}

formBasedLogin()
loadScript()
window.onload = function () {
  trackEmailField()
  socialLogins()
}
