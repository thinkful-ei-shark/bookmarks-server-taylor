const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { url, title, desc, rating } = req.body;

    if (!url) {
      logger.error('Header is required');
      return res.status(400).send('Invalid data');
    }
    // get an id
    const id = uuid();

    const bookmark = {
      id,
      url,
      title,
      desc,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with ${id} created.`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({ id });
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    // make sure we found a bookmark

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(bkm => bkm.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(400).send('Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
