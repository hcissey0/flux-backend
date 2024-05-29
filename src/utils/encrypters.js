import crypto from "crypto";

const salt = process.env.HASH_SALT || 'test_salt';

/**
 * Generates a hash for password
 *
 * @param {String} password
 * @returns {String}
 */
export const generateHash = (password) => {
    const hash = crypto.createHash('sha256');

    hash.update(password + salt);

    const hashedPassword = hash.digest('hex');

    return hashedPassword;
}
