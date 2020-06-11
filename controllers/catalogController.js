const Category = require('../model/category');
const Item = require('../model/item');

exports.index = async (req, res) => {
  const categories = await Category.getHomePageCategories(8);

  // arbitrarily select one category from which to show recommended Item
  // const bestCurrentDeal = await Item.getRecommendedItem(categories, 0);
  res.render('pages/index', {
    categories,
    path: '/catalog',
  });
};

exports.category_get = async (req, res) => {
  const categoryId = req.params.categoryid;
  const items = await Item.getCategoryItems(categoryId, 12);
  res.render('pages/category', {
    path: null,
    items,
  });
};
