const router = require("express").Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/users");
const jwt = require('jsonwebtoken');
const verifyAccessToken = require('../middlewares/auth');

// Register Route
// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user in the database
    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Send the verification email
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: user.email,
      subject: "Verify your email address",
      html: `Click <a href="http://${req.hostname}/auth/verify-email/${token}">here</a> to verify your email address.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: "Registeration success check email to verify" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Verify a user's email address
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { userId } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.verified = true;

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(401).json({ msg: "No user with email : "+req.body.email });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    const access = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refresh = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.googleAccessToken = null;
    user.googleRefreshToken = null;

    await user.save();

    res.json({ msg:"Signed Up", access, refresh });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Request a password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: user.email,
      subject: "Reset your password",
      html: `Click <a href="http://${req.hostname}/reset-password/${token}">here</a> to reset your password.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Reset a user's password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { userId } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Change a user's password
router.put("/change-password", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password changed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Handle Google OAuth2 authentication
router.post("/google-auth", async (req, res) => {
  try {
    const { access_token, refresh_token, email, name } = req.body;

    const profile = await verifyGoogleAccessToken(access_token);

    if (profile.email !== email) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const fullName = name.split(" ");
      const first_name = fullName[0];
      const last_name = fullName[1] || "";

      user = await User.create({
        first_name,
        last_name,
        email,
        password: null,
        verified: true,
        googleAccessToken: access_token,
        googleRefreshToken: refresh_token,
      });
    } else {
      user.googleAccessToken = access_token;
      user.googleRefreshToken = refresh_token;

      await user.save();
    }

    const access = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refresh = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ access, refresh });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Verify a Google access token
const verifyGoogleAccessToken = async (access_token) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );

  return data;
};

// Refresh an access token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refresh } = req.body;

    if (!refresh) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decodedToken = jwt.verify(refresh, process.env.JWT_SECRET);

    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (user.googleAccessToken || user.googleRefreshToken) {
      return res
        .status(401)
        .json({ msg: "Google accounts cannot refresh tokens" });
    }
    jwt.verify(refresh, user.refresh, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      const access = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.json({ access });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
