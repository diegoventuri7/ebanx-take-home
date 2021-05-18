const chai = require('chai')
const chaiHttp = require('chai-http')
const Server = require('../../src/loaders/server.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('API-endpoints', function () {
  this.timeout(5000)

  before(async function () {
    this.server = new Server()
    this.app = await this.server.start()
  })

  after(async function () {
    await this.server.stop()
  })

  it('Happy day: Check PING endpoint', function (done) {
    chai.request(this.app)
      .get('/ping')
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(200)
        expect(res.text).to.be.equal('pong')
        expect(res.body).to.be.a('object').that.is.empty
        done()
      })
  })

  it('Happy day: Reset state before starting tests', function (done) {
    chai.request(this.app)
      .post('/reset')
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(200)
        expect(res.text).to.be.equal('OK')
        expect(res.body).to.be.a('object').that.is.empty
        done()
      })
  })
})
