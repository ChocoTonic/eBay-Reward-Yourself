const path = require("path");
const fs = require("fs");
const sass = require("node-sass");

const cssFilePath = path.join(__dirname, "../../public/styles/main.css");

const renderCss = ()=>{
  sass.render({
    file: path.join(__dirname, "../../utility/sass/main.scss"),
    outFile: cssFilePath
  }, (err, result)=>{
    if(err) throw err;
    fs.writeFile(cssFilePath, result.css, (err)=>{
      if(err) throw err;
      console.log("CSS COMPILED");
    })
  })
}

module.exports = renderCss;