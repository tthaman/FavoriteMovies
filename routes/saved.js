const { Router } = require("express");
const router = Router();
const savedDAO = require('../daos/saved');

//get user's favorites...userId must have been set in request by middleware
router.get("/", async (req, res, next) => {
  const userId = req.userId;
  try {
    let saved = await savedDAO.getByUserId(userId);
    if (saved) {

      res.render('index', {
        movies: ['item one', 'other', 'new item']
      });
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

// Check for saved movie with userId.  If found, update movies array.  Else, create saved movie with 1 instance in movies.
router.put("/:id", async (req, res, next) => {
  const noteId = req.params.id;
  const note = req.body;
  if (!note || JSON.stringify(note) === '{}' ) {
    res.status(400).send('note is required"');
  } else {
    const updatednote = await noteDAO.updateById(noteId, note);
    res.json(updatednote);
  }
});
