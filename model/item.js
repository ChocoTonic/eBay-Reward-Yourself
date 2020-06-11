const pagination = require('pagination');
const ebay = require('./ebay');

// util funcitons -------------

// Model--------------------------------------
class Item {
  static async getCategoryItems(categoryId, entriesPerPage, pageNumber) {
    try {
      const [data] = await ebay.findItemsAdvanced({
        categoryId,
        entriesPerPage,
        pageNumber,
        filter: 'HideDuplicateItems:true',
      });

      const { searchResult } = data;
      const { item: items } = searchResult[0];

      // server side pagination
      const paginator = new pagination.SearchPaginator({
        prelink: '/',
        current: pageNumber,
        rowsPerPage: entriesPerPage,
        totalResult: entriesPerPage * 100,
      });

      const paginationData = paginator.getPaginationData();

      return { items, paginationData };
    } catch (err) {
      return { items: null, paginationData: null };
    }
  }
}

module.exports = Item;
