const { validationResult } = require("express-validator");
const Leave = require("../models/Leave");
const User = require("../models/User");

// Calculate number of working days between two dates
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee, Manager)
const applyLeave = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    const numberOfDays = calculateDays(startDate, endDate);

    if (numberOfDays <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Check leave balance (skip for unpaid)
    if (leaveType !== "unpaid") {
      const user = await User.findById(req.user._id);
      if (user.leaveBalance[leaveType] < numberOfDays) {
        return res.status(400).json({
          message: `Insufficient ${leaveType} leave balance. Available: ${user.leaveBalance[leaveType]} days`,
        });
      }
    }

    // Check for overlapping leaves
    const overlap = await Leave.findOne({
      employee: req.user._id,
      status: { $ne: "rejected" },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "You already have a leave request for this period" });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
    });

    await leave.populate("employee", "name email department");

    res.status(201).json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get my leaves
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all leaves (Manager/Admin)
// @route   GET /api/leaves
// @access  Private (Manager, Admin)
const getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const leaves = await Leave.find(filter)
      .populate("employee", "name email department role")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Review leave (Approve/Reject)
// @route   PUT /api/leaves/:id/review
// @access  Private (Manager, Admin)
const reviewLeave = async (req, res) => {
  const { status, reviewNote } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be approved or rejected" });
  }

  try {
    const leave = await Leave.findById(req.params.id).populate("employee");

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Manager cannot approve or reject their own leave — only admin can
    if (
      req.user.role === "manager" &&
      leave.employee._id.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Managers cannot approve or reject their own leave requests. Please contact an admin.",
      });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Leave request has already been reviewed" });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewNote = reviewNote || "";
    leave.reviewedAt = new Date();

    // Deduct balance if approved and not unpaid
    if (status === "approved" && leave.leaveType !== "unpaid") {
      await User.findByIdAndUpdate(leave.employee._id, {
        $inc: { [`leaveBalance.${leave.leaveType}`]: -leave.numberOfDays },
      });
    }

    await leave.save();
    await leave.populate("reviewedBy", "name");

    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel/Delete leave (own pending leave)
// @route   DELETE /api/leaves/:id
// @access  Private
const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (
      leave.employee.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending leaves can be cancelled" });
    }

    await leave.deleteOne();
    res.json({ success: true, message: "Leave request cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get leave statistics
// @route   GET /api/leaves/stats
// @access  Private (Manager, Admin)
const getLeaveStats = async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await Leave.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$leaveType",
          count: { $sum: 1 },
          totalDays: { $sum: "$numberOfDays" },
        },
      },
    ]);

    const formatted = { pending: 0, approved: 0, rejected: 0 };
    stats.forEach((s) => (formatted[s._id] = s.count));

    res.json({ success: true, statusStats: formatted, typeStats });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
  cancelLeave,
  getLeaveStats,
};
