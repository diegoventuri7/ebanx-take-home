const chai = require('chai')
const chaiHttp = require('chai-http')
const Server = require('../../src/loaders/server.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('API-endpoints', function () {
  this.timeout(5000)
  let app, server

  before(async function () {
    server = new Server()
    app = await server.start()
  })

  after(async function () {
    await server.stop()
  })

  it('Happy day: Check PING endpoint', function (done) {
    chai.request(app)
      .get('/ping')
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(200)
        expect(res.text).to.be.equal('pong')
        expect(res.body).to.be.a('object').that.is.empty
        done()
      })
  })
})
