const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the CodeBlock schema
const codeBlockSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    template: { // the initial code template for the code block
        type: String,
        required: true,
    },
    solution: { // the solution for the code block
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);