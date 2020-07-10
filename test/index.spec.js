var expect = require("chai").expect
var thinQ = require('../src/core/index')
const { assert } = require("chai")

describe("index.js", function() {
    describe("init", function() {
        it('initialization without arguments', async function() {
            var args = await thinQ.init()
            assert(args.db)
            assert(args.node)
            assert(args.room)
            assert(args.passphrase)
            await args.node.stop()
        })

        it('initialization with passphrase username and email arguments', async function() {
            var pass = "This is a test passphrase"
            var user = "Test User"
            var email = "test@test.com"

            var args = await thinQ.init({
                passphrase: pass,
                user: user,
                email: email
            })

            assert(args.db)
            assert(args.node)
            assert(args.room)
            expect(args.passphrase.pass).to.equal(pass)
            expect(args.passphrase.user).to.equal(user)
            expect(args.passphrase.email).to.equal(email)
            await args.node.stop()
        })

        it('initialization with path argument', async function() {
            var args = await thinQ.init({
                path: '/thinq'
            })
            assert(args.db)
            assert(args.node)
            assert(args.room)
            assert(args.passphrase)
            await args.node.stop()
        })

        it('initialization with rname argument', async function() {
            const rname = 'Test Room'

            var args = await thinQ.init({
                rname: rname
            })
            assert(args.db)
            assert(args.node)
            expect(args.room._topic).to.equal(rname)
            assert(args.passphrase)
            await args.node.stop()
        })
    })
})