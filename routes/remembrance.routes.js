const express = require("express");

const router = express.Router();

const remembranceUpload = require(
  "../middleware/remembranceUpload"
);

const {
  createRemembrance,
  getApprovedRemembrances,
  getAllRemembrances,
  getRemembranceById,
  updateRemembranceStatus,
} = require(
  "../controllers/remembrance.controller"
);

router.post(
  "/",
  remembranceUpload.single("photo"),
  createRemembrance
);

router.get(
  "/approved",
  getApprovedRemembrances
);

router.get(
  "/all",
  getAllRemembrances
);

router.get(
  "/:id",
  getRemembranceById
);

router.patch(
  "/:id/status",
  updateRemembranceStatus
);


module.exports = router;