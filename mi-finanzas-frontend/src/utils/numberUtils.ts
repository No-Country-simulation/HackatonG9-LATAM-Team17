import React from 'react';

/**
 * Utilities for strict positive numeric inputs across the application.
 */

/**
 * Sanitizes input string to ensure strictly non-negative positive numbers (including decimal points).
 * Replaces any negative signs or invalid characters.
 */
export function sanitizePositiveNumber(value: string): string {
  if (!value) return '';
  // Remove minus signs, plus signs, exponents, and any letters
  let cleaned = value.replace(/[-+eE]/g, '');
  
  // Ensure at most one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
}

/**
 * KeyDown handler to prevent typing minus '-', 'e', 'E', or '+'
 */
export function preventNegativeKeys(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
    e.preventDefault();
  }
}

/**
 * Parses a numeric string to a strictly non-negative float.
 */
export function parsePositiveFloat(value: string | number, defaultValue: number = 0): number {
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num) || num < 0) return defaultValue;
  return Math.max(0, num);
}
