// utils/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return re.test(String(phone));
};
