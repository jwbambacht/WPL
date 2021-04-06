package errors;

public class Error {
	public String message;
	public int code;
	
	public Error(String message, int code) {
		this.message = message;
		this.code = code;
	}
	
	public String getMessage() {
		return this.message;
	}
	
	public int getCode() {
		return this.code;
	}
}
