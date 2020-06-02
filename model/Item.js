const eBay = require("ebay-node-api");
const dotenv = require("dotenv");
dotenv.config();

const ebay = new eBay({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  body: {
  grant_type: 'client_credentials',
  scope: 'https://api.ebay.com/oauth/api_scope'
}
});

class Item{

  static getProductsByCategory(category){

  }

  static async getRandomItem(){
  try{
    await ebay.getAccessToken();
    const data = await ebay.getMostWatchedItems({
      maxResults: 1
      })
    
    const item = data.getMostWatchedItemsResponse.itemRecommendations.item[0]
    //modifying "item.buyItNowPrice.@currencyId" << illegal object key 
    // const illegalKey = "@currencyId";
    // const legalKey = "currency"
    // const {buyItNowPrice:{__value__: value, [illegalKey]:currency}, ...rest} = item;
    // const newItem = {
    //   buyItNowPrice:{[legalKey]: currency, value},
    //   ...rest
    // }
    return item;
  }catch(err){
    throw err;
  }

  }
}

module.exports = Item;