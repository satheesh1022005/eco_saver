import dotenv from "dotenv";
dotenv.config();
export const secret = process.env.JWT_SECRET;

export const expiresIn = "1h";
