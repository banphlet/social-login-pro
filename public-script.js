import axios from 'axios'
;(() => {
  if (window.allowCallFunction) return
  window.allowCallFunction = true
  const request = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`
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
  const addEmailToSectionStorage = email =>
    sessionStorage.setItem('email', email)

  const isAccessRestricted = shopId =>
    request
      .post('/customers/is-access-restricted', {
        shop_id: shopId
      })
      .then(response => response.data.data)

  const createOrUpdateCustomer = shopId =>
    request.post('/customers', {
      shop_id: shopId,
      email: sessionStorage.getItem('email')
    })

  const hasAttemptedLogin = () => {
    const body = document.querySelector('body').textContent
    return /incorrect email or password/gi.test(body)
  }

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

    const form = document.querySelector('[action="/account/login"]')
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
    const scriptParam = getParams('js/lla')
    const loginAttempted = hasAttemptedLogin()
    if (loginAttempted) {
      await createOrUpdateCustomer(scriptParam?.shop_id)
    }
    const isRestricted = await isAccessRestricted(scriptParam.shop_id)
    if (!isRestricted.is_restricted) return
    preventFormSubmission(isRestricted)
  }

  function init () {
    var currentPath = window.location.pathname

    var isValidAuthPath = [/account\/login/].every(item =>
      item.test(currentPath)
    )

    if (isValidAuthPath) {
      loadScript()
      trackEmailField()
    }
  }

  init()
})()
