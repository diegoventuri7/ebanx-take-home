const bodyParser = require('body-parser')

module.exports = async ({ app }) => {
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }))
  app.use(bodyParser.json({ limit: '1mb' }))

  app.use('/ping', (req, res) => { res.send('pong') })

  app.use((err, req, res, next) => {
    const error = {
      body: req && req.body ? req.body : null,
      headers: req && req.headers ? req.headers : null,
      query: req && req.query ? req.query : null,
      error: err.message ? err.message : err
    }
    JSON.stringify(error)

    res.status(err.status || 500)
    res.json({ error: err.message ? err.message : err })
  })

  return app
}
