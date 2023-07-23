const express = require("express");
const nftController = require("../controllers/nftController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.use(authController.protect);

router.get("/nftData", nftController.getAllNfts);
router.get("/nftDataApp", nftController.getAllNftsApp);
router.get("/topComm", nftController.topComm);
router
  .route("/nftData/:nftId")
  .get(nftController.getNftDetails)
  .patch(nftController.updateNft);

router
  .route("/nftDataApp/:nftId")
  .get(nftController.getNftDetailsApp)
  .patch(nftController.updateNftApp);

router.post('/hash', nftController.getHash)
router.post('/lockAsset', nftController.lockAsset)
router.post('/unlockAsset', nftController.unlockAsset)

module.exports = router;
