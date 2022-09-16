package com.musicloudapp.accounts.rest.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.musicloudapp.accounts.rest.dao.UserDAO;
import com.musicloudapp.accounts.rest.model.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class UserController {

	private UserDAO dao;

	public UserController(UserDAO dao) {
		this.dao = dao;
	}

	@GetMapping("")
	public ArrayList<User> retrieveAll() {
		return dao.findAll();
	}

	@GetMapping("{userID}")
	public User retrieveByID(@PathVariable("userID") UUID userID) {
		return dao.find(userID);
	}

	@PostMapping("")
	public ResponseEntity<User> save(@Valid @RequestBody User user) {
		User savedUser = dao.save(user);
		ServletUriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromCurrentRequest();
		URI location = uriBuilder.path("/${userID}").buildAndExpand(savedUser.getUserID()).toUri();
		return ResponseEntity.created(location).build();
	}

	@DeleteMapping("{userID}")
	public void deleteByID(@PathVariable("userID") UUID userID) {
		dao.delete(userID);
	}
}