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
  const page = parseInt(req.query.page, 10);
  const categoryId = req.params.categoryid || 0;
  const pageNumber = page > 0 && page <= 100 && page ? page : 1;

  const { items, paginationData } = await Item.getCategoryItems(
    categoryId,
    5,
    pageNumber,
  );
  res.render('pages/category', {
    path: null,
    items,
    paginationData,
    categoryId,
  });
};
