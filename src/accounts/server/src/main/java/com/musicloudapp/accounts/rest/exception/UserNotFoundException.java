package com.musicloudapp.accounts.rest.exception;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
	public UserNotFoundException(UUID userID) {
		super(String.format("User not found. userID:%s", userID.toString()));
	}
}