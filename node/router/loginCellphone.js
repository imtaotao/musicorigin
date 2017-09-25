const express = require("express")
const crypto = require('crypto')
const router = express()
const { createWebAPIRequest } = require("../util/util")

// 限制为30s才能登录一次
let loginTime = Date.now()

router.get("/", (req, res) => {
  //判断当前的请求时间，如果过了 30s 才被允许
  const nowTime = Date.now()
  if (nowTime - loginTime < 30000) {
    return res.send(JSON.stringify({code: 403}))
  }

  const phone = req.query.phone
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const md5sum = crypto.createHash('md5')
  md5sum.update(req.query.password)
  const data = {
    'phone': phone,
    'password': md5sum.digest('hex'),
    'rememberLogin': 'true'
  }

  createWebAPIRequest(
    'music.163.com',
    '/weapi/login/cellphone',
    'POST',
    data,
    cookie,
    (music_req, cookie) => {
      console.log(music_req)
      res.set({
        'Set-Cookie': cookie,
      })
      loginTime = Date.now()
      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})

module.exports = router