package com.musicloudapp.accounts.rest.model;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Past;

public class User {
	
	private final UUID userID;

	@Min(2)
	private String name;

	@Email
	private String emailAddress;

	@Past
	private long dateJoined;

	private String password;

	public User(UUID userID, String name, String emailAddress, long dateJoined, String password) {
		this.userID = userID;
		this.name = name;
		this.emailAddress = emailAddress;
		this.dateJoined = dateJoined;
		this.password = password;
	}

	public UUID getUserID() {
		return userID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public long getDateJoined() {
		return dateJoined;
	}

	public void setDateJoined(long dateJoined) {
		this.dateJoined = dateJoined;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "User [dateJoined=" + dateJoined + ", emailAddress=" + emailAddress + ", name=" + name + ", password="
				+ password + ", userID=" + userID + "]";
	}
}