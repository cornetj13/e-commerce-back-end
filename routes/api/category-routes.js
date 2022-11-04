const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // Find all categories and it's associated products.
  Category.findAll({
    include: [Product]
  })
  .then((allCategories) => {
    res.json(allCategories);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.get('/:id', (req, res) => {
  // Find one category by its `id` value and it's associated products.
  Category.findByPk(req.params.id, {
    include: [Product]
  })
  .then((oneCategory) => {
    res.json(oneCategory);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.post('/', (req, res) => {
  // Create a new category.
  Category.create({
    category_name: req.body.category_name
  })
  .then((newCategory) => {
    res.status(201).json(newCategory);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.put('/:id', (req, res) => {
  // Update a category by its `id` value.
  Category.update(
    {
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      },
    }
  )
  .then((updatedCategory) => {
    if (updatedCategory[0] === 0) {
      return res.status(404).json({ msg: "No such category found." });
    }
    res.json(updatedCategory);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.delete('/:id', (req, res) => {
  // Delete a category by its `id` value.
  Category.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((delCategory) => {
    if (delCategory === 0) {
      return res.status(404).json({ msg: "No such category found." });
    }
    res.json(delCategory);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

module.exports = router;
