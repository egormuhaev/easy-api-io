class TestController {
    async test(req, res, next) {
        const txt = {
            mtx: '213123'
        }

        res.send(txt);
    } 
}


module.exports = new TestController()