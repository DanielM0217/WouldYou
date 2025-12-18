var express = require('express');
var router = express.Router();
const Questions = require('../models/Questions')

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index', {title: 'Would You?'});
});

router.get('/api/questions', async (req, res, next) => {
      try {
        const QuestionList = await Questions.find()
        res.json(QuestionList);
      } catch (err) {
        next (err);
      }
});

//accesses public js post script to add document
router.post('/api/questions', async (req, res, next) =>{
  try {
    const question = await Questions.create({
      Question: req.body.question,
      yesCount: 0,
      noCount: 0
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//takes from public function yesCount to update document's yesCount
router.post('/api/questions/:id/yes', async(req, res) =>{
  try {
    const updated = await Questions.findByIdAndUpdate(
      req.params.id,
      { $inc: { yesCount: 1 } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//same as above but for no
router.post('/api/questions/:id/no', async(req, res) =>{
  try {
    const updated = await Questions.findByIdAndUpdate(
      req.params.id,
      { $inc: { noCount: 1 } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;