import 'dotenv/config'
import express, { json } from 'express'
import axios from 'axios'
import cors from 'cors'

const port = process.env.PORT ?? 3333

const app = express()
app.use(cors())
app.use(json())

const clientId = process.env.CLIENT_ID ?? ''
const clientSecret = process.env.CLIENT_SECRET ?? ''

app.get('/login/github', (req, res) => {
  const { code } = req.query

  const authOptions = {
    url: 'https://github.com/login/oauth/access_token',
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      code
    }
  }

  axios(authOptions)
    .then(response => {
      const accessToken = response.data.access_token

      res.cookie('AccessToken', accessToken)

      res.redirect('http://localhost:5173')
    })
    .catch(() => { console.log('Erro 01') })
})

app.get('/user', (req, res) => {
  const token = req.headers.token

  const options = {
    url: 'https://api.github.com/user',
    method: 'GET',
    headers: {
      Authorization: `token ${token as string}`
    }
  }
  axios(options)
    .then((response) => {
      return response.data
    })
    .then(data => {
      res.json(data)
    })
    .catch(() => { console.log('Erro 02') }
    )
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
