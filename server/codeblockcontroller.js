const CodeBlock = require('./models/codeblocks');

// fetch all code blocks
exports.getCodeBlocks = async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching code blocks', error });
  }
};

// fetch a single code block by title
exports.getCodeBlockByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const codeBlock = await CodeBlock.findOne({ title });
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' });
    }
    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching a code block', error});
  }
};