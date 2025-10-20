/**
 * @fileoverview Validadores y sanitizadores de datos
 * @module lib/validators
 * 
 * Proporciona funciones para validar y sanitizar datos de entrada
 * antes de procesarlos o almacenarlos en la base de datos.
 */

import { AppError, ErrorType } from './error-handler';

/**
 * Valida que un email tenga formato correcto
 * 
 * @param email - Email a validar
 * @returns true si el email es válido
 * @throws AppError si el email no es válido
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    throw new AppError(
      'Email is required',
      ErrorType.VALIDATION,
      400
    );
  }
  
  if (!emailRegex.test(email)) {
    throw new AppError(
      'Invalid email format',
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Valida que un string no esté vacío
 * 
 * @param value - Valor a validar
 * @param fieldName - Nombre del campo para mensajes de error
 * @returns true si el valor es válido
 * @throws AppError si el valor está vacío
 */
export const validateRequired = (
  value: string | undefined | null,
  fieldName: string
): boolean => {
  if (!value || value.trim().length === 0) {
    throw new AppError(
      `${fieldName} is required`,
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Valida que un string tenga una longitud mínima
 * 
 * @param value - Valor a validar
 * @param minLength - Longitud mínima
 * @param fieldName - Nombre del campo
 * @returns true si el valor es válido
 * @throws AppError si el valor es muy corto
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): boolean => {
  if (value.length < minLength) {
    throw new AppError(
      `${fieldName} must be at least ${minLength} characters`,
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Valida que un string tenga una longitud máxima
 * 
 * @param value - Valor a validar
 * @param maxLength - Longitud máxima
 * @param fieldName - Nombre del campo
 * @returns true si el valor es válido
 * @throws AppError si el valor es muy largo
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): boolean => {
  if (value.length > maxLength) {
    throw new AppError(
      `${fieldName} must be at most ${maxLength} characters`,
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Valida que un número esté en un rango
 * 
 * @param value - Valor a validar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @param fieldName - Nombre del campo
 * @returns true si el valor es válido
 * @throws AppError si el valor está fuera de rango
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): boolean => {
  if (value < min || value > max) {
    throw new AppError(
      `${fieldName} must be between ${min} and ${max}`,
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Valida que un UUID tenga formato correcto
 * 
 * @param uuid - UUID a validar
 * @param fieldName - Nombre del campo
 * @returns true si el UUID es válido
 * @throws AppError si el UUID no es válido
 */
export const validateUUID = (uuid: string, fieldName: string = 'ID'): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuid || !uuidRegex.test(uuid)) {
    throw new AppError(
      `Invalid ${fieldName} format`,
      ErrorType.VALIDATION,
      400
    );
  }
  
  return true;
};

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * 
 * @param value - Valor a sanitizar
 * @returns Valor sanitizado
 */
export const sanitizeString = (value: string): string => {
  if (!value) return '';
  
  return value
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, ''); // Remover event handlers
};

/**
 * Valida datos de usuario
 * 
 * @param data - Datos del usuario a validar
 * @throws AppError si los datos no son válidos
 */
export const validateUserData = (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): void => {
  if (data.firstName) {
    validateRequired(data.firstName, 'First name');
    validateMinLength(data.firstName, 2, 'First name');
    validateMaxLength(data.firstName, 50, 'First name');
  }
  
  if (data.lastName) {
    validateRequired(data.lastName, 'Last name');
    validateMinLength(data.lastName, 2, 'Last name');
    validateMaxLength(data.lastName, 50, 'Last name');
  }
  
  if (data.email) {
    validateEmail(data.email);
  }
  
  if (data.phone) {
    validateMinLength(data.phone, 10, 'Phone');
    validateMaxLength(data.phone, 20, 'Phone');
  }
};

/**
 * Valida datos de proveedor
 * 
 * @param data - Datos del proveedor a validar
 * @throws AppError si los datos no son válidos
 */
export const validateProviderData = (data: {
  companyName?: string;
  email?: string;
  phone?: string;
  description?: string;
}): void => {
  if (data.companyName) {
    validateRequired(data.companyName, 'Company name');
    validateMinLength(data.companyName, 3, 'Company name');
    validateMaxLength(data.companyName, 100, 'Company name');
  }
  
  if (data.email) {
    validateEmail(data.email);
  }
  
  if (data.phone) {
    validateMinLength(data.phone, 10, 'Phone');
    validateMaxLength(data.phone, 20, 'Phone');
  }
  
  if (data.description) {
    validateMaxLength(data.description, 1000, 'Description');
  }
};

/**
 * Valida datos de vehículo
 * 
 * @param data - Datos del vehículo a validar
 * @throws AppError si los datos no son válidos
 */
export const validateCarData = (data: {
  make?: string;
  model?: string;
  year?: number;
  pricePerDay?: number;
  seatingCapacity?: number;
}): void => {
  if (data.make) {
    validateRequired(data.make, 'Make');
    validateMaxLength(data.make, 50, 'Make');
  }
  
  if (data.model) {
    validateRequired(data.model, 'Model');
    validateMaxLength(data.model, 50, 'Model');
  }
  
  if (data.year) {
    const currentYear = new Date().getFullYear();
    validateRange(data.year, 1900, currentYear + 1, 'Year');
  }
  
  if (data.pricePerDay !== undefined) {
    validateRange(data.pricePerDay, 0, 10000, 'Price per day');
  }
  
  if (data.seatingCapacity !== undefined) {
    validateRange(data.seatingCapacity, 1, 50, 'Seating capacity');
  }
};
