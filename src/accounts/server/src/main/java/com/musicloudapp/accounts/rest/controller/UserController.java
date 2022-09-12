package com.musicloudapp.accounts.rest.controller;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.musicloudapp.accounts.rest.dao.UserDao;
import com.musicloudapp.accounts.rest.model.User;

@RestController
@RequestMapping("/users")
public class UserController {

	private UserDao dao;

	public UserController(UserDao dao) {
		this.dao = dao;
	}

	@GetMapping("")
	public ArrayList<User> retrieveAll() {
		return dao.findAll();
	}

	@GetMapping("{id}")
	public User retrieveOne(@PathVariable("id") UUID id) {
		return dao.findOne(id);
	}
}