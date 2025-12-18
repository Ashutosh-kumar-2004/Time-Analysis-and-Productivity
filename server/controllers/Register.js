import generateToken from "../helper/generateToken.js";
import User from "../modal/User.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create user (pre-save hook hashes password automatically)
    const newUser = await User.create({ firstName, lastName, email, password });

    res.status(201).json({
      success: true,
      message: "Signup successful. Please login to continue.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        projects: newUser.projects,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          projects: user.projects,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, firstName, lastName, avatar } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            projects: user.projects,
          },
          token,
        },
      });
    } else {
      // User doesn't exist, create new user
      // Generate a random password since they are using Google Auth
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = await User.create({
        firstName: firstName || "User",
        lastName: lastName || "",
        email,
        password: randomPassword,
        avatar: avatar || "",
      });

      const token = generateToken(newUser._id);

      return res.status(201).json({
        success: true,
        message: "Google signup successful.",
        data: {
          user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            avatar: newUser.avatar,
            projects: newUser.projects,
          },
          token,
        },
      });
    }
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
