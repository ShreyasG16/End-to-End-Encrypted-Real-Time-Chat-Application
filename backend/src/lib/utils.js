import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });

    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
        httpOnly: true, // prevents XSS
        sameSite: "strict", // prevents CSRF
        secure: process.env.NODE_ENV !== "development" // only secure cookies in prod
    });

    return token;
};

// ----------------- Message Encryption Utils -----------------

const algorithm = "aes-256-cbc";
const ivLength = 16;
const secretKey = Buffer.from(process.env.MESSAGE_SECRET_KEY, "base64"); // For AES
const hmacKey = Buffer.from(process.env.MESSAGE_HMAC_KEY, "base64");     // For HMAC

// Encrypting.. message with AES-256-CBC and HMAC-SHA256
export const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Generating.. HMAC for iv + content
    const hmac = crypto
        .createHmac("sha256", hmacKey)
        .update(iv.toString("hex") + encrypted)
        .digest("hex");

    return {
        iv: iv.toString("hex"),
        content: encrypted,
        hmac,
    };
};

// Decrypting
export const decrypt = (encrypted) => {
    const { iv, content, hmac } = encrypted;

    // if HMAC present new message , will do integrity check
    if (hmac) {
        const computedHmac = crypto
            .createHmac("sha256", hmacKey)
            .update(iv + content)
            .digest("hex");

        if (hmac !== computedHmac) {
            throw new Error("Message integrity check failed. Possible tampering!");
        }
    }
    
    //older messages so proceeding w/o HMAC check

    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(content, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

//decryption 
export const safeDecrypt = (message) => {
    try {
        if (typeof message === "string") return message; 
    } catch (error) {
        return "[Decryption Failed]";
    }
};