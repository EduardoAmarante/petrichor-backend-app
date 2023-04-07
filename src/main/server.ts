// import 'dotenv/config'
// import { randomUUID } from 'node:crypto'
// import express, { json } from 'express'
// import cors from 'cors'
// import axios from 'axios'

// import { User } from './types/user'

// const port = process.env.PORT ?? 3333
// const urlAuthorize = process.env.URL_AUTHORIZE ?? ''
// const urlAccessToken = process.env.URL_ACCESS_TOKEN ?? ''
// const urlFrontEnd = process.env.URL_FRONTEND ?? ''
// const clientId = process.env.CLIENT_ID ?? ''
// const clientSecret = process.env.CLIENT_SECRET ?? ''
// const scope = 'user'
// const redirect = 'http://localhost:3333/login/github'

// const app = express()
// app.use(cors())
// app.use(json())

// app.get('/login/github', (req, res) => {
//   const state = randomUUID()

//   res.redirect(`${urlAuthorize}?client_id=${clientId}&redirect=${redirect}&scope=${scope}&state=${state}`)
// })

// app.get('/login/github/callback', (req, res) => {
//   const { code, state } = req.query

//   if (code !== null && state !== null) {
//     const data = {
//       client_id: clientId,
//       client_secret: clientSecret,
//       code
//     }

//     axios.post(urlAccessToken, data, {
//       headers: {
//         Accept: 'application/json'
//       }
//     }).then(response => {
//       res.cookie('__t', response.data.access_token)

//       res.redirect(urlFrontEnd)
//     }).catch(() => {
//       res.redirect(`${urlFrontEnd}/login`)
//     })
//   }
// })

// app.get('/api/user', async (req, res) => {
//   const token = req.headers.token as string

//   Promise.all([
//     axios.get('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }),
//     axios.get('https://api.github.com/user/emails', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//   ]).then(([userResponse, emailsResponse]) => {
//     const user: User = {
//       id: userResponse.data.id,
//       name: userResponse.data.name,
//       profilePicture: userResponse.data.avatar_url,
//       email: emailsResponse.data[0].email
//     }
//     res.json(user)
//   }).catch(() => {
//     res.redirect(`${urlFrontEnd}/login`)
//   })
// })

// app.listen(port, () => {
//   console.log(`App is running on http://localhost:${port}`)
// })
