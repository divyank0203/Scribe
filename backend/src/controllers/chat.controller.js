const Entry = require('../models/entry.model');
const { chatWithEntries } = require('../utils/groq');

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const entries = await Entry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    if (entries.length === 0) {
      return res.json({
        answer: "You don't have any journal entries yet. Start writing to use the chat feature."
      });
    }

    const answer = await chatWithEntries(question, entries);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { chat };