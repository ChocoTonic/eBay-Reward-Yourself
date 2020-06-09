"use strict"
const fsp = require("fs").promises;
const path = require("path");
const rn = require("random-number");
const Scraper = require("images-scraper");
const ebay = require("./ebay");

(async ()=>{
	await ebay.getAccessToken();
})()

//util functions--------------------------------------------

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

//Module---------------------------------------------------
class Category{


	// static async scrapeCategoryImage(categoryName){

	// 	try{
	// 		const google = new Scraper({
	// 			puppeteer: {
	// 				headless: true,
	// 			},
	// 			tbs:{
	// 				isz: "m",
	// 				itp:  "photo",
	// 				sur: "fmc"
	// 			}
	// 		});

	// 		const results = await google.scrape(categoryName, 1);
	// 		console.log('results', results);
	// 		return results[0].url;
	// 	}catch(err){
	// 		throw err;
	// 	}
	// }

  static async getHomePageCategories(count){
		const categories = await this.getRootCateroryTree();

		//destruct/get data we want 
		const {rootCategoryNode:{childCategoryTreeNodes}} = categories;

		//construct custom obj
		const categoriesObj = [];
		for(let {category:{categoryId, categoryName}} of childCategoryTreeNodes){
			categoriesObj.push({id: categoryId, name: categoryName});
		}
		//randomly select $count categories to showcase on homepage
		const selectedCategories = [];
		const length = categoriesObj.length;
		const options = {min: 0, max: length-1,integer: true}

		while(selectedCategories.length < count){
			let index = rn(options);
			let exists = null;

			//make sure we won't duplicate categories
			for(let obj of selectedCategories){
				if(categoriesObj[index].id === obj.id){
					exists = true;
				}
			}
			if(!exists) selectedCategories.push(categoriesObj[index]);
		}

		return selectedCategories;
  }//end getHomePageCategories


  static async getRootCateroryTree(){
    try{
			let categoryTree = null;
			const versionFilePath = 
				path.join(__dirname, "..", "data", "root_category_tree","version.json");
			const categoryTreeFilePath =
				path.join(__dirname, "..", "data", "root_category_tree","data.json");

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
				if(categoryTree) console.log("rootCategoryTree pulled from ebay");

				const dataSavedToFile = await this.saveCategoryTreeToFile(categoryTree);
				if(!dataSavedToFile) throw "couldn't save data to file";
			}
			
			
      return categoryTree;
    }catch(err){
      throw err;
    }
	}//end getRootCateroryTree


	static async saveCategoryTreeToFile(categoryTree){
			
			const filePath = path.join(__dirname, "..", "data", "root_category_tree","data.json");

			const dataSaved = await saveDataToFile(
				filePath, 
				categoryTree, 
				"CategoryTree successfully saved to file")
				.catch(err=>console.log(err));

			return dataSaved;
	}//end saveCategoryTreeToFile


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
	}//end saveCategoryVersionToFile

}


module.exports = Category;