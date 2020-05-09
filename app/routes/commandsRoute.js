const express = require('express');

const verifyAuth = require('../middlewares/verifyAuth');
const {
  createCommand,
  deleteCommand,
  getAllCommands,
} = require('../controllers/commandsController');

const router = express.Router();

router.get('/commands', getAllCommands);
router.post('/commands', verifyAuth, createCommand);
router.delete('/commands/:commandId', verifyAuth, deleteCommand);
module.exports = router;
