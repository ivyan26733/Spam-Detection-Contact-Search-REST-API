"use strict";
// export const isPasswordValid = (password: string): boolean => {
//     const lengthRequirement = password.length >= 8;
//     const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     const uppercaseRequirement = /[A-Z]/.test(password);
//     const digitRequirement = /[0-9]/.test(password);
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordValidationErrors = void 0;
//     return lengthRequirement && specialCharRequirement && uppercaseRequirement && digitRequirement;
//   };
//   // Optional: Add a function to return detailed error messages
const getPasswordValidationErrors = (password) => {
    const errors = [];
    if (password.length < 8)
        errors.push('Password must be at least 8 characters long.');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        errors.push('Password must contain at least one special character.');
    if (!/[A-Z]/.test(password))
        errors.push('Password must contain at least one uppercase letter.');
    if (!/[0-9]/.test(password))
        errors.push('Password must contain at least one digit.');
    return errors;
};
exports.getPasswordValidationErrors = getPasswordValidationErrors;
