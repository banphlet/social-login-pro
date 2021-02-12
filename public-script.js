import axios from 'axios'

var allowCallFunction

const request = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`
})

function canCallFun () {
  console.log(allowCallFunction)
  if (allowCallFunction === undefined) {
    allowCallFunction = true
    return true
  }
  allowCallFunction = false
  return false
}

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
const addEmailToSectionStorage = email => sessionStorage.setItem('email', email)

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

const preventFormSubmission = message => {
  const banner = document.createElement('div')
  banner.textContent = message || 'Too many login attempts, Try again later'
  banner.style = `background-color: #B74949;padding: 20px;color: white;margin-top: 20px;margin-bottom: 30px`
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
  preventFormSubmission(isRestricted.message)
}

function init () {
  if (!canCallFun()) return

  var currentPath = window.location.pathname

  var isValidAuthPath = [/account\/login/].every(item => item.test(currentPath))

  if (isValidAuthPath) {
    loadScript()
    trackEmailField()
  }
}

init()
