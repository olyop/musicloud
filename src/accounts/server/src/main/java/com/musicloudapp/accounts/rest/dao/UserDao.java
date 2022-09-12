package com.musicloudapp.accounts.rest.dao;

import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.musicloudapp.accounts.rest.model.User;

@Component
public class UserDao {
	
	private static ArrayList<User> users = new ArrayList<>();

	static {
		users.add(new User(UUID.randomUUID(), "Foo", "foo@example.com", Instant.now().getEpochSecond(), "foo"));
		users.add(new User(UUID.randomUUID(), "Bar", "bar@example.com", Instant.now().getEpochSecond(), "bar"));
		users.add(new User(UUID.randomUUID(), "Baz", "baz@example.com", Instant.now().getEpochSecond(), "baz"));
	}

	public ArrayList<User> findAll() {
		return users;
	}

	public User findOne(UUID userID) {
		return users.stream()
								.filter(user -> user.getUserID().equals(userID))
								.findFirst()
								.get();
	}

	public void updatePassword(UUID id, String password) {
		User user = findOne(id);
		user.setPassword(password);
	}
}