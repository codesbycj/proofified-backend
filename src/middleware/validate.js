export function requireString(value, { field, min = 1, max = Infinity }) {
  if (typeof value !== 'string') {
    return `${field} must be a string`;
  }
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return `${field} must be at least ${min} characters`;
  }
  if (trimmed.length > max) {
    return `${field} must be at most ${max} characters`;
  }
  return null;
}
