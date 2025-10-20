/**
 * @fileoverview Sistema centralizado de manejo de errores
 * @module lib/error-handler
 * 
 * Proporciona utilidades para manejar errores de forma consistente
 * en toda la aplicación, incluyendo logging estructurado y mensajes
 * de error amigables para el usuario.
 */

/**
 * Tipos de errores de la aplicación
 */
export enum ErrorType {
  /** Error de autenticación (401) */
  AUTH = 'AUTH_ERROR',
  /** Error de autorización (403) */
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  /** Error de validación de datos (400) */
  VALIDATION = 'VALIDATION_ERROR',
  /** Recurso no encontrado (404) */
  NOT_FOUND = 'NOT_FOUND_ERROR',
  /** Error de base de datos */
  DATABASE = 'DATABASE_ERROR',
  /** Error de red o API externa */
  NETWORK = 'NETWORK_ERROR',
  /** Error interno del servidor (500) */
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * Clase de error personalizada para la aplicación
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    
    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
    
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Registra un error en la consola con formato estructurado
 * 
 * @param error - Error a registrar
 * @param context - Contexto adicional del error
 */
export const logError = (
  error: Error | AppError,
  context?: Record<string, any>
): void => {
  const timestamp = new Date().toISOString();
  const isAppError = error instanceof AppError;
  
  const errorLog = {
    timestamp,
    message: error.message,
    type: isAppError ? error.type : ErrorType.INTERNAL,
    statusCode: isAppError ? error.statusCode : 500,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    context: {
      ...(isAppError ? error.context : {}),
      ...context,
    },
  };
  
  console.error('[ERROR]', JSON.stringify(errorLog, null, 2));
};

/**
 * Obtiene un mensaje de error amigable para el usuario
 * 
 * @param error - Error del cual obtener el mensaje
 * @returns Mensaje de error amigable
 */
export const getUserFriendlyMessage = (error: Error | AppError): string => {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.AUTH:
        return 'Por favor, inicia sesión para continuar.';
      case ErrorType.AUTHORIZATION:
        return 'No tienes permisos para realizar esta acción.';
      case ErrorType.VALIDATION:
        return error.message || 'Los datos proporcionados no son válidos.';
      case ErrorType.NOT_FOUND:
        return 'El recurso solicitado no fue encontrado.';
      case ErrorType.DATABASE:
        return 'Error al acceder a la base de datos. Por favor, intenta nuevamente.';
      case ErrorType.NETWORK:
        return 'Error de conexión. Verifica tu conexión a internet.';
      default:
        return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  }
  
  return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
};

/**
 * Maneja un error de forma centralizada
 * 
 * @param error - Error a manejar
 * @param context - Contexto adicional
 * @returns Objeto con información del error para el cliente
 */
export const handleError = (
  error: Error | AppError,
  context?: Record<string, any>
): {
  message: string;
  type: ErrorType;
  statusCode: number;
} => {
  // Registrar el error
  logError(error, context);
  
  // Retornar información segura para el cliente
  if (error instanceof AppError) {
    return {
      message: getUserFriendlyMessage(error),
      type: error.type,
      statusCode: error.statusCode,
    };
  }
  
  return {
    message: getUserFriendlyMessage(error),
    type: ErrorType.INTERNAL,
    statusCode: 500,
  };
};

/**
 * Wrapper para funciones async que maneja errores automáticamente
 * 
 * @param fn - Función async a ejecutar
 * @param context - Contexto para logging
 * @returns Función wrapped con manejo de errores
 * 
 * @example
 * ```typescript
 * const safeGetUser = withErrorHandling(
 *   async (userId: string) => {
 *     const user = await db.users.findById(userId);
 *     if (!user) throw new AppError('User not found', ErrorType.NOT_FOUND, 404);
 *     return user;
 *   },
 *   { operation: 'getUser' }
 * );
 * ```
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        throw handleError(error, context);
      }
      throw error;
    }
  }) as T;
};
