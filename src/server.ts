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

type User = {
  id: number
  name: string
  email: string
  profilePicture: string
}

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

      res.redirect('http://localhost:5173/')
    })
    .catch(() => { console.log('Erro 01') })
})

async function getUserData (token: string): Promise<any> {
  const options = {
    url: 'https://api.github.com/user',
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  }

  const userData = await axios(options)

  return userData.data
}

async function getUserEmail (token: string): Promise<string> {
  const options = {
    url: 'https://api.github.com/user/emails',
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  }

  const emails = await axios(options)

  const email = emails.data[0].email

  return email
}

app.get('/user', async (req, res) => {
  const token = req.headers.token as string

  const userData = await getUserData(token)

  const email = await getUserEmail(token)

  const user: User = {
    id: userData.id,
    name: userData.name,
    email,
    profilePicture: userData.avatar_url
  }

  res.json(user)
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
