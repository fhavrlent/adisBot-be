const express = require('express');

const { loginUser } = require('../controllers/userControler');
const { refreshJwtToken } = require('../middlewares/refreshJwtToken');

const router = express.Router();

router.post('/user/login', loginUser);
router.post('/user/refresh', refreshJwtToken);

module.exports = router;
