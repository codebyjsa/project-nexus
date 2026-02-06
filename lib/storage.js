/**
 * Storage utilities for JSON file-based data persistence
 * Used for development - can be replaced with database in production
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Read data from a JSON file
 * @param {string} filename - Name of the JSON file (without path)
 * @returns {Object|Array} Parsed JSON data
 */
export function readData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the JSON file (without path)
 * @param {Object|Array} data - Data to write
 * @returns {boolean} Success status
 */
export function writeData(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

/**
 * Append an item to an array in a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {string} key - Key of the array in the JSON object
 * @param {Object} item - Item to append
 * @returns {boolean} Success status
 */
export function appendToArray(filename, key, item) {
  try {
    const data = readData(filename);
    if (data && Array.isArray(data[key])) {
      data[key].push(item);
      return writeData(filename, data);
    }
    return false;
  } catch (error) {
    console.error(`Error appending to ${filename}:`, error);
    return false;
  }
}

/**
 * Find an item by ID in an array within a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {string} key - Key of the array in the JSON object
 * @param {string} id - ID to search for
 * @returns {Object|null} Found item or null
 */
export function findById(filename, key, id) {
  try {
    const data = readData(filename);
    if (data && Array.isArray(data[key])) {
      return data[key].find(item => item.id === id) || null;
    }
    return null;
  } catch (error) {
    console.error(`Error finding item in ${filename}:`, error);
    return null;
  }
}

/**
 * Update an item by ID in an array within a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {string} key - Key of the array in the JSON object
 * @param {string} id - ID of item to update
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateById(filename, key, id, updates) {
  try {
    const data = readData(filename);
    if (data && Array.isArray(data[key])) {
      const index = data[key].findIndex(item => item.id === id);
      if (index !== -1) {
        data[key][index] = { ...data[key][index], ...updates };
        return writeData(filename, data);
      }
    }
    return false;
  } catch (error) {
    console.error(`Error updating item in ${filename}:`, error);
    return false;
  }
}

/**
 * Delete an item by ID from an array within a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {string} key - Key of the array in the JSON object
 * @param {string} id - ID of item to delete
 * @returns {boolean} Success status
 */
export function deleteById(filename, key, id) {
  try {
    const data = readData(filename);
    if (data && Array.isArray(data[key])) {
      data[key] = data[key].filter(item => item.id !== id);
      return writeData(filename, data);
    }
    return false;
  } catch (error) {
    console.error(`Error deleting item from ${filename}:`, error);
    return false;
  }
}
