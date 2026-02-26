const express = require("express");
const { body } = require("express-validator");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
  cancelLeave,
  getLeaveStats,
} = require("../controllers/leaveController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

router.get("/my", protect, getMyLeaves);
router.get("/stats", protect, authorize("manager", "admin"), getLeaveStats);
router.get("/", protect, authorize("manager", "admin"), getAllLeaves);

router.post(
  "/",
  protect,
  [
    body("leaveType")
      .isIn(["annual", "sick", "casual", "unpaid"])
      .withMessage("Invalid leave type"),
    body("startDate").isISO8601().withMessage("Valid start date required"),
    body("endDate").isISO8601().withMessage("Valid end date required"),
    body("reason").notEmpty().withMessage("Reason is required"),
  ],
  applyLeave,
);

router.put("/:id/review", protect, authorize("manager", "admin"), reviewLeave);
router.delete("/:id", protect, cancelLeave);

module.exports = router;
