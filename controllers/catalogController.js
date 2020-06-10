const Category = require("../model/category");
const Item = require("../model/item");



exports.index= async (req, res)=>{
  const categories = await Category.getHomePageCategories(8);

  //arbitrarily select one category from which to show recommended Item
  const bestCurrentDeal = await Item.getRecommendedItem(categories, 0);

  res.render("pages/index", {
    categories,
    bestCurrentDeal,
    path: "/catalog"
  });
}

exports.category_get = async(req,res)=>{
  const categoryId = req.params.categoryid;

  const items = await Item.getCategoryItems(categoryId, 12);
  
  res.render("pages/category", {
    path: null,
    items
  })
}








  // const items = [
  //   {
  //     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQhUXNVqxU9TjKSRkIGXsHtjqUQIppvUgM0xFstnjBmHMgUksGm&usqp=CAU",
  //     price: 5
  //   },
  //   {
  //     imageUrl: "https://lcw-ma.akinoncdn.com/products/2020/02/26/1417587/58694d16-f6a3-4db1-a9c2-cce9c99f765b_quality90.jpg",
  //     price: 10
  //   },
  //   {
  //     imageUrl: "https://cdn.shopify.com/s/files/1/0150/0643/3380/products/Viacom_Spongebob_PhoneCase-iPhone11ProTough_00905_82e34191-68db-472d-adf5-a4596d2b9e78_1024x1024.jpg?v=1573590965",
  //     price: 13
  //   },
  //   {
  //     imageUrl: "https://images.vans.com/is/image/Vans/D3HY28-HERO?$CATEGORY-LANDING-PRODUCT-REC$",
  //     price: 17
  //   },
  //   {
  //     imageUrl: "https://cdn11.bigcommerce.com/s-5b70d/images/stencil/1280x1280/products/786/5631/Baby-Alpaca-Mens-Color-Block-Scarf-Blue-Grey-by-Inca-Fashions-for-Sun-Valley-Alpaca-Loop__42287.1572118398.jpg?c=2?imbypass=on",
  //     price: 25
  //   }
  // ];  