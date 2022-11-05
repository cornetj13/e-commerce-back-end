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
    if (req.body.tagId.length) {
      const productTagIdArr = req.body.tagId.map((tag_id) => {
        return {
          productId: newProduct.id,
          tagId: tag_id
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
    console.log("=========================2=======================");
    console.log(productTags);
    // get list of current tag_ids
    const productTagId = productTags.map(({ tagId }) => tagId);
    console.log("+++++++++++++++++++++++++3++++++++++++++++++++");
    console.log(productTagId);
    console.log("========================4========================");
    console.log(req.body.tagId);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagId;
    console.log("+++++++++++++++++++++++++5++++++++++++++++++++");
    console.log(newProductTags);
    const filterProductTags = newProductTags.filter((tagId) => !productTagId.includes(tagId));
    console.log("=====================6===========================");
    console.log(filterProductTags);
    const mapProductTags = filterProductTags.map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id: tag_id,
      };
    });
    console.log("+++++++++++++++++++++HERE++++++++++++++++++++++++");
    console.log(mapProductTags);
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tagId }) => !req.body.tagId.includes(tagId))
      .map(({ tagId }) => tagId);

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
