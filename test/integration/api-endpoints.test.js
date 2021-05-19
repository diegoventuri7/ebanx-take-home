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
        expect(res.body).to.be.equal('pong')
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
        done()
      })
  })

  it('Bad day: Get balance for non-existing account', function (done) {
    const query = { account_id: '1234' }

    chai.request(this.app)
      .get('/balance')
      .query(query)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(404)
        expect(res.body).to.be.equal(0)
        done()
      })
  })

  it('Happy day: Create account with initial balance', function (done) {
    const body = { type: 'deposit', destination: '100', amount: 10 }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')

        expect(res.body.destination).to.be.a('object')
        expect(res.body.destination.id).to.be.equal('100')
        expect(res.body.destination.balance).to.be.equal(10)
        done()
      })
  })

  it('Happy day: Deposit into existing account', function (done) {
    const body = { type: 'deposit', destination: '100', amount: 10 }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')

        expect(res.body.destination).to.be.a('object')
        expect(res.body.destination.id).to.be.equal('100')
        expect(res.body.destination.balance).to.be.equal(20)
        done()
      })
  })

  it('Happy day: Get balance for existing account', function (done) {
    const query = { account_id: '100' }

    chai.request(this.app)
      .get('/balance')
      .query(query)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(200)
        expect(res.body).to.be.equal(20)
        done()
      })
  })

  it('Bad day: Withdraw from non-existing account', function (done) {
    const body = { type: 'withdraw', origin: '200', amount: 10 }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(404)
        expect(res.body).to.be.equal(0)
        done()
      })
  })

  it('Happy day: Withdraw from existing account', function (done) {
    const body = { type: 'withdraw', origin: '100', amount: 5 }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')

        expect(res.body.origin).to.be.a('object')
        expect(res.body.origin.id).to.be.equal('100')
        expect(res.body.origin.balance).to.be.equal(15)
        done()
      })
  })

  it('Happy day: Transfer from existing account', function (done) {
    const body = { type: 'transfer', origin: '100', amount: 15, destination: '300' }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')

        expect(res.body.origin).to.be.a('object')
        expect(res.body.origin.id).to.be.equal('100')
        expect(res.body.origin.balance).to.be.equal(0)

        expect(res.body.destination).to.be.a('object')
        expect(res.body.destination.id).to.be.equal('300')
        expect(res.body.destination.balance).to.be.equal(15)
        done()
      })
  })

  it('Bad day: Transfer from non-existing account', function (done) {
    const body = { type: 'transfer', origin: '200', amount: 15, destination: '300' }

    chai.request(this.app)
      .post('/event')
      .send(body)
      .end(function (err, res) {
        expect(err).is.equal(null)
        expect(res).to.have.status(404)
        expect(res.body).to.be.equal(0)
        done()
      })
  })
})
