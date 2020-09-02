const { Router } = require("express");
const router = Router();
const reviewDAO = require('../daos/review');
const { isAuthorized } = require("../middleware/middleware");

//get user's reviews...userId must have been set in request by middleware
router.get("/", async (req, res, next) => {
  const email = req.email;
  try {
    let saved = await reviewDAO.getByUserId(email);
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

router.get('/:id/add-review', isAuthorized, (req, res, next) => {
  const { id } = req.params;
  res.render("reviewForm", { id: id });
})

router.post('/:id/add-review', (req, res, next) => {
  const { rating, review } = req.body;
  const { id } = req.params;
  if (!rating || !review ) {
    res.status(400).send('rating and review required"');
  } else {
    res.render("reviewForm", {message: true})
  }
})

module.exports = router;
