import { Request, Response, NextFunction } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No user data found",
    });
  }

  // Check the Role
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You do not have permission to perform this action",
    });
  }

  next();
};

export default isAdmin;
