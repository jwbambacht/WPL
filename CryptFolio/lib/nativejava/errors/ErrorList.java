package errors;

import java.util.*;


public class ErrorList {
	public List<Error> errors;
	
	public ErrorList() {
		this.errors = new ArrayList<>();
	}
	
	public void addError(String message, int code) {
		this.errors.add(new Error(message, code));
	}
	
	public void addErrors(List<String> messages, int code) {
		for(String message : messages) {
			this.addError(message, code);
		}
	}
	
	public List<String> getMessages() {
		List<String> messages = new ArrayList<>();
		
		for(Error error : this.errors) {
			messages.add(error.getMessage());
		}
		
		return messages;
	}
	
	public int getStatusCode() {
		return Collections.max(this.errors, Comparator.comparing(e -> e.getCode())).getCode();
	}
	
	public boolean noErrors() {
		return this.errors.size() == 0;
	}
}
