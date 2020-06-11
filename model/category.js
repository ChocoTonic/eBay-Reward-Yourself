const fsp = require('fs').promises;
const path = require('path');
const rn = require('random-number');
const ebay = require('./ebay');

(async () => {
  await ebay.getAccessToken();
})();

// util functions--------------------------------------------

const saveDataToFile = async (filePath, data) => {
  await fsp.writeFile(filePath, JSON.stringify(data));
  return true;
};

const loadJsonFile = async (filePath) => {
  const response = await fsp.readFile(filePath, { encoding: 'utf-8' });
  const data = await JSON.parse(response);
  return data;
};

// Model---------------------------------------------------
class Category {
  static async getHomePageCategories(count) {
    const categories = await this.getRootCateroryTree();

    if (!categories) return null;
    // destruct/get data we want
    const {
      rootCategoryNode: { childCategoryTreeNodes },
    } = categories;

    // construct custom obj
    const categoriesObj = [];

    childCategoryTreeNodes.forEach(
      ({ category: { categoryId, categoryName } }) => {
        categoriesObj.push({ id: categoryId, name: categoryName });
      },
    );
    // return all categories if $count equals "ALL" string
    // else return $count categories
    if (count === 'ALL') return categoriesObj;

    const selectedCategories = [];
    const { length } = categoriesObj;
    const options = { min: 0, max: length - 1, integer: true };

    while (selectedCategories.length < count) {
      const index = rn(options);
      let exists = null;

      selectedCategories.forEach((obj) => {
        if (categoriesObj[index].id === obj.id) {
          exists = true;
        }
      });
      if (!exists) selectedCategories.push(categoriesObj[index]);
    }

    return selectedCategories;
  } // end getHomePageCategories

  static async getRootCateroryTree() {
    try {
      let categoryTree = null;
      const versionFilePath = path.join(
        __dirname,
        '..',
        'data',
        'root_category_tree',
        'version.json',
      );
      const categoryTreeFilePath = path.join(
        __dirname,
        '..',
        'data',
        'root_category_tree',
        'data.json',
      );

      const {
        categoryTreeId,
        categoryTreeVersion,
      } = await ebay.getDefaultCategoryTreeId('EBAY_US');

      const { version: savedVersion } = await loadJsonFile(
        versionFilePath,
        'version retrieved from local storrage',
      );

      // check if there has been any updates
      if (savedVersion === categoryTreeVersion) {
        // load categoreTree from localStorage
        categoryTree = await loadJsonFile(
          categoryTreeFilePath,
          'categoryTree retrieved from local storrage',
        );
      } else {
        // request updated data from ebay Api
        // update locally stored version and categoryTree
        const versionSavedToFile = await this.saveCategoryVersionToFile(
          categoryTreeVersion,
        );
        if (!versionSavedToFile)
          throw new Error("couldn't save version to file");

        categoryTree = await ebay.getCategoryTree(categoryTreeId);

        const dataSavedToFile = await this.saveCategoryTreeToFile(categoryTree);
        if (!dataSavedToFile) throw new Error("couldn't save data to file");
      }

      return categoryTree;
    } catch (err) {
      return null;
    }
  } // end getRootCateroryTree

  static async saveCategoryTreeToFile(categoryTree) {
    const filePath = path.join(
      __dirname,
      '..',
      'data',
      'root_category_tree',
      'data.json',
    );

    const dataSaved = await saveDataToFile(
      filePath,
      categoryTree,
      'CategoryTree successfully saved to file',
    );

    return dataSaved;
  } // end saveCategoryTreeToFile

  static async saveCategoryVersionToFile(version) {
    // make a version obj
    const versionObject = {
      version,
      lastChecked: Date.now(),
    };

    const filePath = path.join(
      __dirname,
      '..',
      'data',
      'root_category_tree',
      'version.json',
    );

    const dataSaved = await saveDataToFile(
      filePath,
      versionObject,
      'CategoryTree version successfully saved to file',
    );

    return dataSaved;
  } // end saveCategoryVersionToFile
}

module.exports = Category;
