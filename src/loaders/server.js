const express = require('express')
const expressLoader = require('./express.js')
const PORT = process.env.PORT || 8080

module.exports = class Server {
  constructor () {
    this.server = null
    this.app = express()
  }

  start () {
    return new Promise((resolve, reject) => {
      expressLoader({ app: this.app })

      this.server = this.app.listen(PORT, err => {
        if (err) {
          reject(err)
        } else {
          console.log(`Server started on ${PORT} port`)
          resolve(this.app)
        }
      })
    })
  }

  async stop () {
    await this.server.close()
  }
}
