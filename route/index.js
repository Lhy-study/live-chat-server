const router=require("express").Router();
router.use("/user",require("./user"));
router.use("/getData",require("./data"));
router.use("/friend",require("./friends"));
module.exports = router;