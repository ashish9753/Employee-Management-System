const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserLeaves,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin", "manager"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.get(
  "/:id/leaves",
  protect,
  authorize("admin", "manager"),
  getUserLeaves,
);

module.exports = router;
