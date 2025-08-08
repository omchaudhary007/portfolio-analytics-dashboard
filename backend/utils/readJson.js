import { readFile } from "fs/promises";

/**
 * Reads and parses a JSON file
 *
 * @param {string} path - Relative path to the JSON file
 * @returns {Promise<Object>} - Parsed JSON data
 */
export const readJson = async (path) => {
  const data = await readFile(path, "utf-8");
  return JSON.parse(data);
};
