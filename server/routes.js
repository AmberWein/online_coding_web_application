const express = require('express');
const router = express.Router();
const codeblockController = require('./codeblockcontroller');

// fetch all code blocks
router.get('/codeblocks', codeblockController.getCodeBlocks);
// fetch a code block by title
router.get('/codeblocks/:title', codeblockController.getCodeBlockByTitle);

module.exports = router;