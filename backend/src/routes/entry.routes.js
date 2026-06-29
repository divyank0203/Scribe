const router = require('express').Router();
const { createEntry, getEntries, updateEntry, deleteEntry, getDigest } = require('../controllers/entry.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/digest', getDigest);
router.get('/', getEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;