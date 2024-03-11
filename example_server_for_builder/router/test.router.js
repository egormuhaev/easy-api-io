const Router =  require( 'express')
const router = new Router()
const testController  =  require( '../controller/testController')

router.get('/', testController.test) 

module.exports = router