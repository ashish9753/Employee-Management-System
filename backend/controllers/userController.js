const User = require("../models/User");
const Leave = require("../models/Leave");

// @desc    Create a new user (by admin)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, leaveBalance } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
      department: department || "General",
      leaveBalance: leaveBalance || { annual: 15, sick: 10, casual: 7 },
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user role/status
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { role, isActive, department, leaveBalance } = req.body;

    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (department) updateData.department = department;
    if (leaveBalance) updateData.leaveBalance = leaveBalance;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    await Leave.deleteMany({ employee: user._id });
    await user.deleteOne();

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's leave history
// @route   GET /api/users/:id/leaves
// @access  Private (Admin, Manager)
const getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.id })
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserLeaves,
};
