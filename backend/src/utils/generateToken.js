import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user?._id ?? user?.id,
      email: user?.email,
      username: user?.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user?._id ?? user?.id,
      email: user?.email,
      username: user?.username,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

export const generateTokenPair = (user) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});
