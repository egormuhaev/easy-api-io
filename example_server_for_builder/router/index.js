const Router = require('express')
const router = new Router()

const testRouter = require('./test.router')

router.use('/test', testRouter)

module.exports  = router

