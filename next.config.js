/** Simple next.config for Vercel */
module.exports = {
  api: {
    bodyParser: false, // for multer uploads handled via next-connect in upload route
  }
};
