import UserTask from "../../modal/personalAnalysis/UserTask.js";
import TimeEntry from "../../modal/personalAnalysis/TimeEntry.js";
import ProductivityGoal from "../../modal/personalAnalysis/ProductivityGoal.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange } = req.query;

    let startDate = new Date();
    let endDate = new Date();

    // Determine date range
    if (timeRange === "Today") {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "This Week") {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "This Month") {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default to all time or specific week? Let's default to This Week if not specified
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    // 1. Total Tracked Time
    const totalTimeAgg = await TimeEntry.aggregate([
      {
        $match: {
          userId: userIdObj,
          startTimestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$durationInMinutes" },
        },
      },
    ]);
    const totalMinutes = totalTimeAgg[0]?.totalMinutes || 0;
    const totalHours = (totalMinutes / 60).toFixed(1);

    // 2. Productivity Score (Avg Focus Score 1-5 mapped to 0-100)
    const productivityAgg = await TimeEntry.aggregate([
      {
        $match: {
          userId: userIdObj,
          startTimestamp: { $gte: startDate, $lte: endDate },
          focusScore: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          avgFocus: { $avg: "$focusScore" },
        },
      },
    ]);
    const avgFocus = productivityAgg[0]?.avgFocus || 0;
    const productivityScore = Math.round((avgFocus / 5) * 100);

    // 3. Goal Achievement (Active Goals Completion %)
    const goals = await ProductivityGoal.find({
      userId,
      goalStatus: {
        $in: ["active", "completed", "ahead_of_schedule", "behind_schedule"],
      },
    });

    let goalAchievement = 0;
    if (goals.length > 0) {
      const totalCompletion = goals.reduce(
        (sum, goal) => sum + (goal.progressData?.completionPercentage || 0),
        0
      );
      goalAchievement = Math.round(totalCompletion / goals.length);
    }

    // 4. Efficiency Rate (from User Tasks updated/created in this range? Or active tasks?)
    // Let's look at tasks that had activity in this range.
    // UserTask has `productivityMetrics.completionEfficiency`
    const efficiencyAgg = await UserTask.aggregate([
      {
        $match: {
          userId: userIdObj,
          "metadata.lastActivityAt": { $gte: startDate, $lte: endDate },
          "productivityMetrics.completionEfficiency": { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgEfficiency: { $avg: "$productivityMetrics.completionEfficiency" },
        },
      },
    ]);
    const efficiencyRate = Math.round(efficiencyAgg[0]?.avgEfficiency || 0);

    // 5. Time Allocation by Category
    const categoryAllocation = await TimeEntry.aggregate([
      {
        $match: {
          userId: userIdObj,
          startTimestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "usertasks", // Check collection name. Mongoose defaults to lowercase plural.
          localField: "taskId",
          foreignField: "_id",
          as: "task",
        },
      },
      { $unwind: "$task" },
      {
        $group: {
          _id: "$task.category",
          totalMinutes: { $sum: "$durationInMinutes" },
        },
      },
      { $sort: { totalMinutes: -1 } },
    ]);

    // Format for chart: { name: 'Work', value: 30, color: ... }
    const categoryColors = {
      academic_studies: "#4F46E5",
      assignment_work: "#8B5CF6",
      project_development: "#059669",
      exam_preparation: "#F59E0B",
      research_work: "#EF4444",
      skill_learning: "#EC4899",
      personal_development: "#06B6D4",
      health_fitness: "#10B981",
      social_activities: "#F97316",
      administrative: "#6B7280",
      other: "#9CA3AF",
    };

    const allocationData = categoryAllocation.map((item) => ({
      name: item._id.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: item.totalMinutes, // We will calculate percentage on frontend or here
      color: categoryColors[item._id] || "#cccccc",
    }));

    // Calculate percentages
    const totalAllocationMinutes = allocationData.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const allocationDataWithPercent = allocationData
      .map((item) => ({
        ...item,
        value: totalAllocationMinutes
          ? Math.round((item.value / totalAllocationMinutes) * 100)
          : 0,
        minutes: item.value,
      }))
      .filter((item) => item.value > 0);

    res.status(200).json({
      stats: {
        totalHours,
        productivityScore,
        goalAchievement,
        efficiencyRate,
      },
      timeAllocation: allocationDataWithPercent,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
};
