const router = require("express").Router();

const user = require('./userRoute/userRoute');
const admin = require('./adminRoute/adminRoute');
const contactUs = require('./contactUsRoute/contactUsRoute');

router.use('/user',user);
router.use('/admin',admin);
router.use('/contactUs',contactUs);
module.exports = router;