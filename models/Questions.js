const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema({
    Question: String,
    yesCount: Number,
    noCount: Number,
}, { collection: 'questions' });

module.exports = mongoose.model('Questions', QuestionsSchema);
