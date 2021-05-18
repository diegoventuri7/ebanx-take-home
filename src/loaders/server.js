const express = require('express')
const expressLoader = require('./express.js')
const PORT = process.env.PORT || 8080

module.exports = class Server {
  constructor () {
    this.server = null
    this.app = express()
  }

  async start () {
    expressLoader({ app: this.app })

    this.server = this.app.listen(PORT, err => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`Server started on ${PORT} port`)
    })
  }

  async stop () {
    await this.server.close()
  }

  getApp () {
    return this.app
  }
}
