import User from "../modal/User.js";
export const getProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Profile structure
    const profile = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phoneNumber || "",
      bio: user.bio || "",
      role: user.role || "",
      dailyGoal: user.dailyGoal || 0,
      weeklyGoal: user.weeklyGoal || 0,
      defaultCategory: user.defaultCategory || "",
      joinDate: new Date(user.createdAt).toDateString(),
      hoursTracked: user.hoursTracked || 0,
      avatar: user.avatar || "",
    };

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


export const updatePersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const { firstName, lastName, phoneNumber, bio } = req.body;

    // Block restricted fields
    if (req.body.email || req.body.avatar || req.body.password) {
      return res.status(400).json({
        success: false,
        message: "You cannot update email, avatar or password from this route",
      });
    }

    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (bio) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
