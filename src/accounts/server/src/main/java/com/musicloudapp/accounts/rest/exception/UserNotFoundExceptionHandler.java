package com.musicloudapp.accounts.rest.exception;

import com.musicloudapp.accounts.rest.bean.ErrorBean;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class UserNotFoundExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(Exception.class)
	public final ResponseEntity<ErrorBean> handleAllExceptions(Exception e, WebRequest request)
		throws Exception {
		ErrorBean errorDetails = new ErrorBean(
			LocalDateTime.now(),
			e.getMessage(),
			request.getDescription(false)
		);
		return new ResponseEntity<ErrorBean>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(UserNotFoundException.class)
	public final ResponseEntity<ErrorBean> handleUserNotFoundException(
		Exception e,
		WebRequest request
	) throws Exception {
		ErrorBean errorDetails = new ErrorBean(
			LocalDateTime.now(),
			e.getMessage(),
			request.getDescription(false)
		);
		return new ResponseEntity<ErrorBean>(errorDetails, HttpStatus.NOT_FOUND);
	}
}
