"use strict"

const ebay = require("./ebay");


//Model--------------------------------------
class Item{

  static async getRecommendedItem(categories, counter){
    try{
      //arbitrarily pick element in [$counter] position of category array
      const [data] = await ebay.findItemsByCategory(categories[counter].id);
      const {searchResult:[{item}]} = data;
      
      for(let key in item[0]){
        if(key === "pictureURLLarge"){
          return item[0];
        }
      }
      //if item doesn't come with a pictureURLLarge prop then recurse and try next elem
      return await this.getRecommendedItem(categories, ++counter);
    }catch(err){
      throw err;
    }
  }
}



module.exports = Item;