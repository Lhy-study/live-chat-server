const router=require("express").Router();
router.use("/chat",require("./chat"))
router.use("/user",require("./user"));
router.use("/conversation",require("./conversation"));
router.use("/friend",require("./friends"));
router.use("/fc",require("./cof"))
module.exports = router;