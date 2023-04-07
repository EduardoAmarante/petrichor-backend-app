import './config/module-alias'

import { app } from '@/main/config/app'
import { env } from '@/main/config/env'

app.listen(env.port, () => {
  console.log(`🚀 Server is running at http://localhost:${env.port}`)
})
