var express = require('express');
var router = express.Router();
const { isAuth } = require('../middleware/isAuth');
const db = require('../models');
const BookmarkService = require('../services/BookmarkService');
const bookmarkService = new BookmarkService(db);

/* GET home page. */
router.get('/:id', isAuth, async (req, res, next) => {
  try {
    const result = await bookmarkService.getUserBookmarkById(req.params.id, req.user.id);
    return res.status(200).send({ message: 'Found bookmark', bookmark: result });
  } catch (error) {
    return res.status(500).send({ message: 'An error occurred while trying to fetch bookmark' });
  }
});

router.post('/', isAuth, async (req, res, next) => {
  const { Name, URL } = req.body;
  bookmarkService.create(Name, URL, req.user.id).then(bookmark => {
    res.status(201).send({ message: 'Bookmark created successfully' })
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
})

router.put('/', isAuth, async function (req, res, next) {
  try {
    const { Name, id } = req.body;
    const result = await bookmarkService.updateUserBookmark(id, req.user.id, Name)
    console.log(result);
    res.status(200).send({ message: 'Successfully updated category', category: result });

  } catch (err) {
    res.status(500).send({ message: err.message })
  }

})

module.exports = router;
 