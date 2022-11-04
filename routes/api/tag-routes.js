const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // Find all tags and its associated product data.
  Tag.findAll({
    include: [Product]
  })
  .then((allTags) => {
    res.json(allTags);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.get('/:id', (req, res) => {
  // Find a single tag by its `id` and its associated product data.
  Tag.findByPk(req.params.id, {
    include: [Product]
  })
  .then((oneTag) => {
    res.json(oneTag);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.post('/', (req, res) => {
  // Create a new tag.
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then((newTag) => {
    res.status(201).json(newTag);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.put('/:id', (req, res) => {
  // Update a tag's name by its `id` value.
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      },
    }
  )
  .then((updatedTag) => {
    if (updatedTag[0] === 0) {
      return res.status(404).json({ msg: "No such tag found." });
    }
    res.json(updatedTag);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.delete('/:id', (req, res) => {
  // Delete on tag by its `id` value.
  Tag.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((delTag) => {
    if (delTag === 0) {
      return res.status(404).json({ msg: "No such tag found." });
    }
    res.json(delTag);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

module.exports = router;
