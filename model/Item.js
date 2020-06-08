"use strict"
const eBay = require("ebay-node-api");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

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
// (async()=>{
//   await ebay.getAccessToken();
// })()


class Item{
  constructor(){
    this.categories = null;
  }

  static async init(){
    this.getAllCaterogies();
  }//end init


  static async getAllCaterogies(){
    try{
      await ebay.getAccessToken();
      const {
				categoryTreeId, 
				categoryTreeVersion} = await ebay.getDefaultCategoryTreeId("EBAY_US");

			const categoryTree = await ebay.getCategoryTree(categoryTreeId);

			const dataSavedToFile = await this.saveCategoryTreeToFile(categoryTree);

			if(!dataSavedToFile) throw "couldn't save data to file";

      // const {rootCategoryNode:{childCategoryTreeNodes}} = await ebay.getCategoryTree(categoryTreeId);
      // let categoryNames = [];
      // for(let {category} of childCategoryTreeNodes){
      //   categoryNames.push(category.categoryName);
      // }
      return data;
    }catch(err){
      throw err;
    }
	}//end getCategories

	static async saveCategoryTreeToFile(categoryTree){
		try{
			const filePath = path.join(__dirname, "..","data","category-tree.json");
			const dataSavedToFile = await fs.writeFile(filePath, JSON.stringify(categoryTree), (err)=>{
				if(err) throw err;
				console.log("data successfully saved to file");
				
			})
			return await dataSavedToFile;

		}catch(err){
			throw err;
		}
	}


  // static async getRandomItem(){
  //   try{
  //     await ebay.getAccessToken();
  //     const data = await ebay.getMostWatchedItems({
  //       maxResults: 1,
  //       })
      
  //     const item = await data.getMostWatchedItemsResponse.itemRecommendations.item[0]

  //     //modifying "item.buyItNowPrice.@currencyId" << illegal object key 
  //     const illegalKey = "@currencyId";
  //     const legalKey = "currency"
  //     const {buyItNowPrice:{__value__: value, [illegalKey]:currency}, ...rest} = item;
  //     const validItem = {
  //       buyItNowPrice:{[legalKey]: currency, value},
  //       ...rest
  //     }
  //     return validItem;
  //   }catch(err){
  //     throw err;
  //   }

  //}//end getRandomItem
}

Item.init();

module.exports = Item;