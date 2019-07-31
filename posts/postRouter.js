const express = require("express");
const db = require("./postDb.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await db.get();
  if (posts) {
    res.status(200).json(posts);
  } else {
    next({
      status: 500,
      message: "The posts could not be retrieved."
    });
  }
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, async (req, res) => {
  const deletedPost = await db.remove(req.params.id);
  if (deletedPost) {
    res.status(200).json(req.post);
  } else {
    next({
      status: 500,
      message: "The post could not be removed."
    });
  }
});

router.put("/:id", validatePostId, validatePost, async (req, res) => {
  const updatedPost = await db.update(req.params.id, req.body);
  if (updatedPost) {
    res.status(200).json(updatedPost);
  } else {
    next({
      status: 500,
      message: "The post information could not be updated."
    });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;
    const post = await db.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      next({
        status: 404,
        message: "The post with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The post information could not be retrieved."
    });
  }
}

function validatePost(req, res, next) {
  console.log(req.body);
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.text && req.body.user_id) {
      next();
    }
    if (!req.body.text && req.body.user_id) {
      next({
        status: 400,
        message: "missing required text field"
      });
    }
    if (!req.body.user_id && req.body.text) {
      next({
        status: 400,
        message: "missing required user_id field"
      });
    }
    if (!req.body.user_id && !req.body.text) {
      next({
        status: 400,
        message: "missing required text & user_id fields"
      });
    }
  } else {
    next({
      status: 400,
      message: "missing post data"
    });
  }
}

module.exports = router;
