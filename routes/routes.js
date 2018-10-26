const router = require('express').Router();
const apiRouter = require('express').Router();
const user = require('./userRoute');

router.all('/info', function(req, res){
    res.status(200).json({ status:"OK", message: "chick's express API"});
});

router.use('/api', apiRouter);

apiRouter.use('/user', user);

module.exports = router;