"use strict"

const ebay = require("./ebay");

//util funcitons -------------
const ifObjContainsKey = (obj, key)=>{

}


//Model--------------------------------------
class Item{

  static async getRecommendedItem(categories, counter){
    try{
      //arbitrarily pick element in [$counter] position of category array
      const [data] = await ebay.findItemsByCategory(categories[counter].id);
      const {searchResult:[{item}]} = data;

      //ad hoc : get 1 single item from itemArr 
      //check if item has picture prop, if not recurse
      if(item[0].hasOwnProperty("pictureURLLarge")) 
        return item[0];
      else
        return await this.getRecommendedItem(categories, ++counter);
    }catch(err){
      throw err;
    }
  }

  static async getCategoryItems(categoryId, entriesPerPage){

    const [data] = await ebay.findItemsAdvanced({
      categoryId,
      entriesPerPage,
      filter: "HideDuplicateItems:true"
    })
    const {searchResult:[{item}]} = data;

    return item;
  }
}



module.exports = Item;