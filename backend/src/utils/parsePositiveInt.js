export const parsePositiveInt = (value, fallback) => {
  // base 10 for decimal numbers
  const number = Number.parseInt(value, 10);

  // if parsing fails return fallback
  if (Number.isNaN(number)) {
    return fallback;
  }

  // if number is negative or zero return fallback
  if (number <= 0) {
    return fallback;
  }

  // if number is greater than 100 return fallback
  if (number > 100) {
    return fallback;
  }

  return number;
};