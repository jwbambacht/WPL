module serviceFunctions

function statusText(code: Int): String {
	if(code == 200) {
		return "OK";
	}else if(code == 400) {
		return "Bad Request";
	}else if(code == 401) {
		return "Unauthorized"; 
	}else if(code == 405) {
		return "Method not Allowed";
	}
	return "";
}

function successResponse(): JSONObject {
	var msg := JSONObject();
	msg.put("status", 200);
	msg.put("message", statusText(200));
	
	return msg;
}

function errorResponse(code: Int): JSONObject {
	var msg := JSONObject();
	msg.put("status", code);
	msg.put("message", statusText(code));
	
	return msg;
}

function errorArray(errors: [String]): JSONArray {
	var array := JSONArray();
	
	for(error : String in errors) {
		var obj := JSONObject();
		obj.put("error", error);
		array.put(obj);
	}
	
	return array;
}

function checkIfNonNegative(value: Float, name: String, errorList: ErrorList): ErrorList {
	if(value < 0.0) {
		errorList.addError("~name must be nonnegative", 400);
	}
	return errorList;
}

function checkIfFloat(string: String, name: String, errorList: ErrorList): ErrorList {
	if(string.parseFloat() == null) {
		errorList.addError("~name must be a float", 400);
	}
	return errorList;
}

function checkIfInteger(string: String, name: String, errorList: ErrorList): ErrorList {
	if(string.parseInt() == null) {
		errorList.addError("~name must be an integer", 400);
	}
	return errorList;
}

function checkStringEmpty(string: String, name: String, errorList: ErrorList): ErrorList {
	if(string.length() == 0) {
		errorList.addError("~name cannot be empty", 400);
	}	
	return errorList;
}

function checkValidUUID(string: String, name: String, errorList: ErrorList): ErrorList {
	if(string.length() == 0) {
		errorList.addError("~name cannot be empty", 400);
	}
	if(string.parseUUID() == null) {
		errorList.addError("~name has no valid format", 400);
	}
	return errorList;
}

function checkJSONObjectNull(object: JSONObject, name: String, errorList: ErrorList): ErrorList {
	if(object == null) {
		errorList.addError("~name object not provided", 400);
	}	
	
	return errorList;
}

function checkAuthorization(token: String, username: String, admin: Bool, errorList: ErrorList): ErrorList {
	
	if(token.length() == 0) {
		errorList.addError("Token cannot be empty",400);
	}

	if(username.length() == 0) {
		errorList.addError("Username cannot be empty",400);
	}
	
	if(User{}.findUserByAPI(username,token).length == 0) {
		errorList.addError("No user identified by this token",401);
	}

	if(admin == true && errorList.noErrors()) {
		var users := User{}.findUserByAPI(username, token);
		
		if(!users[0].isAdmin()) {
			errorList.addError("User is not allowed because it is not an administrator",401);
		}
	}
	
	return errorList;
}