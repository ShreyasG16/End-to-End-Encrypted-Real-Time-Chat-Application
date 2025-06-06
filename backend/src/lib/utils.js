import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // prevents XSS
        sameSite: "strict", // prevents CSRF
        secure: process.env.NODE_ENV !== "development" // only secure cookies in prod
    });

    return token;
};

// ----------------- Message Encryption Utils -----------------

const algorithm = "aes-256-cbc";
const ivLength = 16;
const secretKey = process.env.MESSAGE_SECRET_KEY; // Must be 32 bytes

export const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'base64'), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        content: encrypted
    };
};

export const decrypt = (encrypted) => {
    const iv = Buffer.from(encrypted.iv, "hex");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'base64'), iv);
    let decrypted = decipher.update(encrypted.content, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

// Optional fallback for old messages (plain text)
export const safeDecrypt = (message) => {
    try {
        if (typeof message === "string") return message;
        return decrypt(message);
    } catch (error) {
        return "[Decryption Failed]";
    }
};
