const Entry = require('../models/entry.model');
const { generateSummary, generateDigest } = require('../utils/groq');

const createEntry = async (req, res) => {
  try {
    const { content, tags } = req.body;

    const entry = await Entry.create({
      userId: req.user.id,
      content,
      tags: tags || [],
      aiSummary: ''
    });

    try {
      entry.aiSummary = await generateSummary(content);
      await entry.save();
    } catch (groqErr) {
      console.error('Groq summary failed:', groqErr.message);
    }

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.content = req.body.content || entry.content;
    entry.tags = req.body.tags || entry.tags;

    try {
      entry.aiSummary = await generateSummary(entry.content);
    } catch (groqErr) {
      console.error('Groq summary failed:', groqErr.message);
    }

    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getDigest = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await Entry.find({
      userId: req.user.id,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    if (entries.length === 0) {
      return res.json({ digest: 'No entries found in the last 7 days.' });
    }

    const digest = await generateDigest(entries);
    res.json({ digest });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEntry, getEntries, updateEntry, deleteEntry, getDigest };