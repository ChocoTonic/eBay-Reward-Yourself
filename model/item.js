const ebay = require('./ebay');

// util funcitons -------------


// Model--------------------------------------
class Item {
  static async getRecommendedItem(categories, index) {
    // arbitrarily pick element in [$index] position of category array
    const [data] = await ebay.findItemsByCategory(categories[index].id);
    const { searchResult: [{ item }] } = data;

    // ad hoc : get 1 single item from itemArr
    // check if selected item has picture prop, if not recurse test next item
    if (Object.prototype.hasOwnProperty.call(item[0], 'pictureURLLarge')) return item[0];

    const nextIndex = index + 1;
    const recursion = await this.getRecommendedItem(categories, nextIndex);
    return recursion;
  }

  static async getCategoryItems(categoryId, entriesPerPage) {
    const [data] = await ebay.findItemsAdvanced({
      categoryId,
      entriesPerPage,
      filter: 'HideDuplicateItems:true',
    });
    // const { searchResult: [{ item }] } = data;
    const { searchResult } = data;
    const { item: items } = searchResult[0];

    return items;
  }
}


module.exports = Item;
