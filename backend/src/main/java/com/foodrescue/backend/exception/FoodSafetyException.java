package com.foodrescue.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FoodSafetyException extends RuntimeException {
    public FoodSafetyException(String message) { super(message); }
}
