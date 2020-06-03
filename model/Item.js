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
//get oauth token 
(async()=>{
  await ebay.getAccessToken();
})()


class Item{

  static getProductsByCategory(category){

  }

  static async getRandomItem(){
  try{
    
    const data = await ebay.getMostWatchedItems({
      maxResults: 1,
      })
    
    const item = await data.getMostWatchedItemsResponse.itemRecommendations.item[0]

    //modifying "item.buyItNowPrice.@currencyId" << illegal object key 
    const illegalKey = "@currencyId";
    const legalKey = "currency"
    const {buyItNowPrice:{__value__: value, [illegalKey]:currency}, ...rest} = item;
    const validItem = {
      buyItNowPrice:{[legalKey]: currency, value},
      ...rest
    }
    return validItem;
  }catch(err){
    throw err;
  }

  }
}

module.exports = Item;