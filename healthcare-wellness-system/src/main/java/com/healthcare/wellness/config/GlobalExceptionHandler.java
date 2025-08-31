package com.healthcare.wellness.config;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    @ApiResponse(responseCode = "404", description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class),
            examples = @ExampleObject(value = "{\"timestamp\":\"2025-01-25T10:30:00Z\",\"status\":404,\"error\":\"Not Found\",\"message\":\"Resource not found\"}")))
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ApiResponse(responseCode = "401", description = "Unauthorized",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class),
            examples = @ExampleObject(value = "{\"timestamp\":\"2025-01-25T10:30:00Z\",\"status\":401,\"error\":\"Unauthorized\",\"message\":\"JWT token is missing or invalid\"}")))
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            "JWT token is missing or invalid"
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ApiResponse(responseCode = "403", description = "Forbidden",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class),
            examples = @ExampleObject(value = "{\"timestamp\":\"2025-01-25T10:30:00Z\",\"status\":403,\"error\":\"Forbidden\",\"message\":\"Access denied\"}")))
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.FORBIDDEN.value(),
            "Forbidden",
            "Access denied"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ApiResponse(responseCode = "400", description = "Bad Request - Validation Error",
        content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class),
            examples = @ExampleObject(value = "{\"timestamp\":\"2025-01-25T10:30:00Z\",\"status\":400,\"error\":\"Bad Request\",\"message\":\"Validation failed\",\"errors\":{\"email\":\"Email should be valid\",\"password\":\"Password is required\"}}")))
    public ResponseEntity<ValidationErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ValidationErrorResponse error = new ValidationErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            "Validation failed",
            errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    @ApiResponse(responseCode = "500", description = "Internal Server Error",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class),
            examples = @ExampleObject(value = "{\"timestamp\":\"2025-01-25T10:30:00Z\",\"status\":500,\"error\":\"Internal Server Error\",\"message\":\"An unexpected error occurred\"}")))
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;

        public ErrorResponse(LocalDateTime timestamp, int status, String error, String message) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
        }

        // Getters and setters
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ValidationErrorResponse extends ErrorResponse {
        private Map<String, String> errors;

        public ValidationErrorResponse(LocalDateTime timestamp, int status, String error, String message, Map<String, String> errors) {
            super(timestamp, status, error, message);
            this.errors = errors;
        }

        public Map<String, String> getErrors() { return errors; }
        public void setErrors(Map<String, String> errors) { this.errors = errors; }
    }
}
