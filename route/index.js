const router=require("express").Router();
router.use("/user",require("./user/index"));
router.use("/getData",require("./getData/index"));
router.use("/friend",require("./friend/index"));
module.exports = router;