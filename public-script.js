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
  const items = document.querySelectorAll('.btn-social')
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
  const includesText = true
  const submitButton = document.querySelector(
    '[action="/account/login"] [type=submit]'
  )

  const socialContent = selectedSocialBanners.map(platform => {
    const button = `<a value='${platform}' type="submit" class="btn btn-social ${includesText ? "btn-block" : "btn-social-icon"} btn-${platform}" style="margin: 2px">
<span class="fa fa-${platform}"></span>${includesText ? `Sign in with ${platform}` : ""}
</a>`

    return button
  })

  const socialHtml = `<div>
      <h3 style='margin-top: 20px'> Login With Social Accounts </h3>
      <div style='display: flex; margin-top: 30px; flex-basis: 25%; flex-wrap: wrap;'>
        ${socialContent}
    </div>
      
    </div>`
  submitButton.insertAdjacentHTML('afterend', socialHtml)
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
