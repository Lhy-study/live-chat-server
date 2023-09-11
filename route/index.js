const router=require("express").Router();
router.use("/user",require("./user"));
router.use("/conversation",require("./conversation"));
router.use("/friend",require("./friends"));
module.exports = router;