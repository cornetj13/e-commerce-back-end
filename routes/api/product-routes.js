const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', (req, res) => {
  // Find all products and its associated category and tag data.
  Product.findAll({
    include: [{
      model: Category
    },{
      model: Tag
    }]
  })
  .then((allProducts) => {
    res.json(allProducts);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.get('/:id', (req, res) => {
  // Find a single product by its `id` and its associated category and tag data.
  Product.findByPk(req.params.id, {
    include: [{
      model: Category
    },{
      model: Tag
    }]
  })
  .then((oneProduct) => {
    res.json(oneProduct);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

router.post('/', (req, res) => {
  // Create a new product.
  Product.create(
    req.body
  )
  .then((newProduct) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(newProduct);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // Update product data.
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updateProduct) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // Delete one product by its `id` value.
  Product.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((delProduct) => {
    if (delProduct === 0) {
      return res.status(404).json({ msg: "No such product found." });
    }
    res.json(delProduct);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err: err });
  });
});

module.exports = router;
