package com.musicloudapp.accounts.rest.dao;

import com.musicloudapp.accounts.rest.exception.UserNotFoundException;
import com.musicloudapp.accounts.rest.model.User;
import java.time.Instant;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;

@Component
public class UserDAO {

	private static ArrayList<User> users = new ArrayList<>();

	static {
		users.add(
			new User(UUID.randomUUID(), "Foo", "foo@example.com", Instant.now().getEpochSecond(), "foo")
		);
		users.add(
			new User(UUID.randomUUID(), "Bar", "bar@example.com", Instant.now().getEpochSecond(), "bar")
		);
		users.add(
			new User(UUID.randomUUID(), "Baz", "baz@example.com", Instant.now().getEpochSecond(), "baz")
		);
	}

	private static final Predicate<User> userIdFilter(UUID userID) {
		return user -> user.getUserID().equals(userID);
	}

	public ArrayList<User> findAll() {
		return users;
	}

	public User find(UUID userID) {
		try {
			User user = users.stream().filter(userIdFilter(userID)).findFirst().get();
			return user;
		} catch (NoSuchElementException nsee) {
			throw new UserNotFoundException(userID);
		}
	}

	public User save(User user) {
		users.add(user);
		return user;
	}

	public void delete(UUID userID) {
		try {
			users.removeIf(userIdFilter(userID));
		} catch (NullPointerException npe) {
			throw new UserNotFoundException(userID);
		}
	}
}
