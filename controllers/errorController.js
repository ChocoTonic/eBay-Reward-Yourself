
exports.notFoundPage = (req, res)=>{
  res.render("pages/error",{
    path: null
  });
};