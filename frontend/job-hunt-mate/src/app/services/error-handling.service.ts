import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  handleError(error: any) {
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

    // Log error for debugging
    console.error('Error Details:', errorDetails);

    // Show user-friendly notification
    this.notificationService.showError(errorDetails.message);
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
        message = 'Please log in to continue.';
        code = 'UNAUTHORIZED';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        code = 'FORBIDDEN';
        break;
      case 404:
        message = 'The requested resource was not found.';
        code = 'NOT_FOUND';
        break;
      case 409:
        message = 'This operation conflicts with another request.';
        code = 'CONFLICT';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        code = 'RATE_LIMIT';
        break;
      case 500:
        message = 'A server error occurred. Please try again later.';
        code = 'SERVER_ERROR';
        break;
      default:
        message = 'An unexpected error occurred. Please try again.';
        code = 'UNKNOWN';
    }

    return {
      message,
      code,
      technical: error.message
    };
  }

  private handleGenericError(error: Error): ErrorDetails {
    return {
      message: 'An application error occurred. Please try again.',
      technical: error.message
    };
  }
}
