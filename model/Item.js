"use strict"
const eBay = require("ebay-node-api");
const dotenv = require("dotenv");
const fsp = require("fs").promises;
const path = require("path");
const rn = require("random-number");

dotenv.config();

const ebay = new eBay({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  body: {
  grant_type: 'client_credentials',
  scope: 'https://api.ebay.com/oauth/api_scope'
}
});

//util functions
const saveDataToFile =async (filePath, data, msg)=>{
	try{
		await fsp.writeFile(filePath, JSON.stringify(data));
		console.log(msg);
		return true;
	}catch(err){
		throw err;
	}
}

const loadJsonFile = async (filePath, msg)=>{
	try{
		const response = await fsp.readFile(filePath, {encoding: "utf-8"});
		const data = await JSON.parse(response);
		console.log(msg)
		return data;
	}catch(err){
		throw err;
	}
}


class Item{
  constructor(){
    this.categories = null;
  }

  static async getHomePageCategories(){
		const categories = await this.getRootCateroryTree();

		//destruct/get data we want 
		const {rootCategoryNode:{childCategoryTreeNodes}} = categories;

		//construct custom obj
		const categoriesObj = [];
		for(let {category:{categoryId, categoryName}} of childCategoryTreeNodes){
			categoriesObj.push({id: categoryId, name: categoryName});
		}
		//randomly select 6 categories to showcase on homepage
		const selectedCategories = [];
		const length = categoriesObj.length;
		const options = {min: 0, max: length-1,integer: true}

		while(selectedCategories.length<6){
			let index = rn(options);
			let exists = null;

			//make sure we won't duplicate categories
			for(let obj in selectedCategories){
				if(categoriesObj[index].id === obj.id){
					exists = true;
				}
			}
			if(!exists) selectedCategories.push(categoriesObj[index])
		}

		return selectedCategories;
  }//end init


  static async getRootCateroryTree(){
    try{
			let categoryTree = null;
			const versionFilePath = 
				path.join(__dirname, "..", "data", "root_category_tree","version.json");
			const categoryTreeFilePath =
				path.join(__dirname, "..", "data", "root_category_tree","data.json");

      await ebay.getAccessToken();
      const {
				categoryTreeId, 
				categoryTreeVersion} = await ebay.getDefaultCategoryTreeId("EBAY_US");

			const {version:savedVersion} = await loadJsonFile(versionFilePath, "version retrieved from local storrage");

			//check if there has been any updates 
			if(savedVersion === categoryTreeVersion){
				//load categoreTree from localStorage 
				categoryTree = await loadJsonFile(categoryTreeFilePath, "categoryTree retrieved from local storrage");
			}else{
				//request updated data from ebay Api
				//update locally stored version and categoryTree
				const versionSavedToFile = await this.saveCategoryVersionToFile(categoryTreeVersion);
				if(!versionSavedToFile) throw "couldn't save version to file";

				categoryTree = await ebay.getCategoryTree(categoryTreeId);

				const dataSavedToFile = await this.saveCategoryTreeToFile(categoryTree);
				if(!dataSavedToFile) throw "couldn't save data to file";
			}
			
			
      return categoryTree;
    }catch(err){
      throw err;
    }
	}//end getCategories

	static async saveCategoryTreeToFile(categoryTree){
			
			const filePath = path.join(__dirname, "..", "data", "root_category_tree","data.json");

			const dataSaved = await saveDataToFile(
				filePath, 
				categoryTree, 
				"CategoryTree successfully saved to file")
				.catch(err=>console.log(err));

			return dataSaved;
	}


	static async saveCategoryVersionToFile(version){
		//make a version obj
		const versionObject = {
			version,
			lastChecked: Date.now()
		};

		const filePath = path.join(__dirname, "..", "data", "root_category_tree","version.json");

		const dataSaved = await saveDataToFile(
			filePath, 
			versionObject, 
			"CategoryTree version successfully saved to file")
			.catch(err=>console.log(err));

		return dataSaved;
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



module.exports = Item;