import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

export interface ErrorDetails {
  message: string;
  code?: string;
  technical?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private notificationService: NotificationService) {}

  handleError(error: any, options?: { suppressToast?: boolean }): string {
    let errorDetails: ErrorDetails;

    if (error instanceof HttpErrorResponse) {
      errorDetails = this.handleHttpError(error);
    } else if (error instanceof Error) {
      errorDetails = this.handleGenericError(error);
    } else {
      errorDetails = {
        message: 'An unexpected error occurred',
        technical: JSON.stringify(error)
      };
    }

    console.error('Error Details:', errorDetails);
    if (!options?.suppressToast) {
      this.notificationService.showError(errorDetails.message);
    }

    return errorDetails.message;
  }

  private handleHttpError(error: HttpErrorResponse): ErrorDetails {
    let message: string;
    let code: string | undefined;

    switch (error.status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        code = 'BAD_REQUEST';
        break;
      case 401:
        message = 'Invalid credentials or session expired.';
        code = 'UNAUTHORIZED';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        code = 'FORBIDDEN';
        break;
      case 404:
        message = 'Resource not found.';
        code = 'NOT_FOUND';
        break;
      case 409:
        message = 'Conflict occurred. Possibly duplicate data.';
        code = 'CONFLICT';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        code = 'RATE_LIMIT';
        break;
      case 500:
        message = 'Internal server error. Please try again later.';
        code = 'SERVER_ERROR';
        break;
      default:
        message = error.error?.message || 'An unknown error occurred.';
        code = 'UNKNOWN';
    }

    return { message, code, technical: error.message };
  }

  private handleGenericError(error: Error): ErrorDetails {
    return {
      message: 'An application error occurred.',
      technical: error.message
    };
  }
}
