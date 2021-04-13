module services

// All API services
// API GET consists of the following format: .../api/endpoint/spec/param1/param2/param3
// Only the endpoint is required in all services
service api(endpoint: String, spec: String, param1: String, param2: String, param3: String) {
	var response: JSONObject;
	var result := JSONObject();
	var errorList := ErrorList();
	 
	// Request does not contain any parameters (.../api)
	if(endpoint.length() == 0 && spec.length() == 0 && param1.length() == 0 && param2.length() == 0 && param3.length() == 0) {
		 errorList.addError("No endpoint provided", 400);
	}else{
		if(endpoint == "auth") {
			if(getHttpMethod() == "POST") {
				var body := JSONObject(readRequestBody());
				
				// Register user
				// .../api/auth/register (POST)
				if(spec =="register") {
					
					var username := body.getString("username");
					var email := body.getString("email");
					var password := body.getString("password");
					var password_confirmation := body.getString("password_confirmation");
					var baseURL := body.getString("baseURL");
					
					errorList := checkStringEmpty(username, "Username", errorList);
					
					if(password != password_confirmation) {
						errorList.addError("Passwords are not identical", 400);
					}else{
						errorList.addErrors(User{}.validatePassword(password as Secret), 400);
					}
					
					errorList := checkStringEmpty(password_confirmation, "Password confirmation", errorList);
					errorList.addErrors(User{}.validateEmail(email), 400);
					
					var user := User{};
					
					if(errorList.noErrors()) {
						user.username := username;
						user.email := email;
						user.password := (password as Secret).digest();
				
						errorList.addErrors(user.validateUser(), 400);
					}
					
					if(errorList.noErrors()) {
						user.generateAuthToken();
						user.save();
						user.sendActivationEmail(baseURL);
						result.put("register", true);
						result.put("message", "Please activate your account by clicking the link in the confirmation mail.");	
					}
				
				// Login user	
				// .../api/auth/login (POST)
				}else if(spec == "login") {
					var username := body.getString("username");
					var password := body.getString("password");
					
					errorList := checkStringEmpty(username, "Username", errorList);
					errorList := checkStringEmpty(password, "Password", errorList);
					
					if(errorList.noErrors()) {
						if(findUser(username) == null) {
							errorList.addError("No user found identified by this credentials", 401);	
						}
					}
					
					if(errorList.noErrors()) {
						if(!findUser(username).activated) {
							errorList.addError("Please activate your account", 401);
						}
					}
					
					if(errorList.noErrors()) {
						if(authenticate(username, password)) {
							var user := findUser(username);
							
							if(user.session != null) { 
								user.session.delete();
							}
							
							if(body.getBoolean("remember_me")) {
								user.generateAPIToken(24, true);	
							}else{
								user.generateAPIToken(24, false);
							}
							
							result.put("token", user.session.apiToken);
							result.put("user", user.createJSONObject());
						}else{
							errorList.addError("No user found identified by this credentials", 401);
						}
					}		
				
				// Logout user
				// .../api/auth/logout (POST)		
				}else if(spec == "logout") {
			
					var token := body.getString("token");
					var username := body.getString("username");
					
					errorList := checkStringEmpty(token, "Token", errorList);
					errorList := checkStringEmpty(username, "Username", errorList);
					
					if(errorList.noErrors()) {
						var user := findUser(username);
						
						if(user != null) {
							if(user.session.apiToken == token) {
								var session := user.session;
								user.session := null;
								session.delete();
								user.save();
							
								result.put("logout", true);
					    	}else {
					    		errorList.addError("No user identified by this token", 401);
					    	}
						}		
					}
					
				// Check user session
				// .../api/auth/check (POST)
				}else if(spec == "check") {
			
					var token := body.getString("token");
					var username := body.getString("username");
					var password := body.getString("password");
					
					errorList := checkStringEmpty(token, "Token", errorList);
					errorList := checkStringEmpty(username, "Username", errorList);
					errorList := checkStringEmpty(password, "Password", errorList);
					
					if(errorList.noErrors()) {
						if(User{}.userSession(token, password, username)) {
							result.put("session", true);
							result.put("token", token);
							
							var user := findUser(username);
							
							result.put("user", user.createJSONObject());
						}else{
							result.put("session", false);
							result.put("message", "No current session found");
							
						}
					}
				// No other specifications for POST request known
				// .../api/not(auth) (POST)
				}else{
					errorList.addError("Specification for ~endpoint and ~getHttpMethod() unknown",400);
				}
			
			// Other request methods than POST are not allowed
			// .../api/auth/... (not POST)
			}else{
				errorList.addError("The selected method ~getHttpMethod() is not allowed", 405);
			}
		}else if(endpoint == "portfolio") {
			
			if(getHttpMethod() == "POST") {
				var body := JSONObject(readRequestBody());
				var token := body.getString("token");
				var username := body.getString("username");
				
				errorList := checkAuthorization(token, username, false, errorList);
				
				// Create a portfolio 
				// .../api/portfolio/create (POST)
				if(spec == "create") {
					var portfolioName := body.getString("portfolioName");
					
					errorList := checkStringEmpty(portfolioName, "Portfolio name", errorList);
					
					if(errorList.noErrors()) {
						var users := User{}.findUserByAPI(username,token);
						
						if([x | x in (from Portfolio) where x.user == users[0] && x.name == portfolioName].length == 0) {
							var portfolio := Portfolio{};
							portfolio.name := portfolioName; 
					
							portfolio.user := users[0];
							portfolio.save();
							
							result.put("portfolioID", portfolio.id);	
						}else{
							errorList.addError("A portfolio with the same name already exists", 400);
						}
					}	
					
				// Delete a portfolio
				// .../api/portfolio/delete (POST)
				}else if(spec == "delete") {
					var portfolioID := param1;
										
					errorList := checkValidUUID(portfolioID, "Portfolio id", errorList);
					
					if(errorList.noErrors()) {
						var portfolio := (from Portfolio where user.session.apiToken = ~token and user.username = ~username and id = ~portfolioID.parseUUID());
						
						if(portfolio.length == 0) {
							errorList.addError("Portfolio cannot be found", 400);
						}else{
							portfolio[0].remove();
							result.put("delete", true);
						}
					}
					
				// No other specifications for POST request known
				// .../api/portfolio/not(auth) (POST)
				}else{
					errorList.addError("Specification for ~endpoint and ~getHttpMethod() unknown",400);
				}
			}else if(getHttpMethod() == "GET") {
				
				// .../api/portfolio (GET)
				if(spec.length() == 0 && param1.length() == 0 && param2.length() == 0) {
					errorList.addError("No token, username provided, and portfolio id provided",400);
					
				}else{
					
					var includeData := false;
					
					// Get a portfolio of user, with or without token price data
					// .../api/portfolio/{portfolio_id}/{api_token}/{username}/{?data?} (GET)
					if(spec.length() > 0 && param1.length() > 0 && param2.length() > 0 && spec.parseUUID() != null) {
						var portfolioID := spec;
						var token := param1;
						var username := param2;
						
						if(param3 == "data") {
							includeData := true;
						}
						
						errorList := checkStringEmpty(portfolioID, "Portfolio id", errorList);
						errorList := checkAuthorization(token, username, false, errorList);
						
						if(errorList.noErrors()) {
							var portfolio := (from Portfolio where id = ~portfolioID.parseUUID());
							
							var pObject := JSONObject();
							
							if(portfolio.length == 0) {
								errorList.addError("Portfolio not found", 400);
							}else if(portfolio.length == 1) {
								portfolio := (from Portfolio where id = ~portfolioID.parseUUID() and user.session.apiToken = ~token and user.username = ~username);
								
								if(portfolio.length == 1) {
									pObject := portfolio[0].createJSONObject(true, includeData);
								}else {
									errorList.addError("Unauthorized to view portfolio", 401);
								}
							}
							
							result.put("portfolio", pObject);
						}
					
					// Get all portfolios of user, with or without token price data
					// .../api/portfolio/{api_token}/{username}/{?data?} (GET)
					}else {
						var token := spec;
						var username := param1;
						
						if(param2 == "data") {
							includeData := true;
						}
						
						errorList := checkAuthorization(token, username, false, errorList);
						
						if(errorList.noErrors()) {
							var portfolios := (from Portfolio where user.session.apiToken = ~token and user.username = ~username);
						
							var pArray := JSONArray();
						
							for(portfolio : Portfolio in portfolios) {
								pArray.put(portfolio.createJSONObject(true, includeData));
							}
							
							result.put("portfolios", pArray);	
						}
					}
				}
			
			// Update a portfolio
			// .../api/portfolio (PUT)
			}else if(getHttpMethod() == "PUT") {
				
				var body := JSONObject(readRequestBody());
				var token := body.getString("token");
				var username := body.getString("username");
				var pObject := body.getJSONObject("portfolio");
				
				errorList := checkAuthorization(token, username, false, errorList);
				errorList := checkJSONObjectNull(pObject, "Portfolio", errorList);
				errorList := checkValidUUID(pObject.getString("id"), "Portfolio id", errorList);
				errorList := checkStringEmpty(pObject.getString("name"), "Portfolio name", errorList);
				errorList := checkIfFloat(pObject.getString("cost"), "Portfolio cost", errorList);
				errorList := checkIfNonNegative(pObject.getString("cost").parseFloat(), "Portfolio cost", errorList);
				
				if(errorList.noErrors()) {
					var portfolio := (from Portfolio where user.session.apiToken = ~token and user.username = ~username and id = ~pObject.getString("id").parseUUID());
					
					if(portfolio.length == 0) {
						errorList.addError("Portfolio cannot be found", 400);
					}else{
						portfolio[0].name := pObject.getString("name");
						portfolio[0].cost := pObject.getDouble("cost").floatValue();
						portfolio[0].save();
						
						result.put("portfolio",portfolio[0].createJSONObject(true, true));
					}
				}	
				
			// Other request methods than POST, PUT, and GET are not allowed
			// .../api/portfolio/... (not POST, PUT, GET)
			}else{
				errorList.addError("The selected method ~getHttpMethod() is not allowed", 405);
			}
		}else if(endpoint == "asset") {
			
			if(getHttpMethod() == "POST") {
				var body := JSONObject(readRequestBody());
				var token := body.getString("token");
				var username := body.getString("username");
				
				errorList := checkAuthorization(token, username, false, errorList);
					
				// Create asset for a portfolio 
				// .../api/asset/create (POST)
				if(spec == "create") {
					var assetObject := body.getJSONObject("asset");
					var portfolioID := assetObject.getString("portfolioID");
					var tokenID := assetObject.getString("tokenID");
					var balance := assetObject.getDouble("balance");
					
					errorList := checkJSONObjectNull(assetObject, "Asset", errorList);
					errorList := checkValidUUID(portfolioID, "Portfolio id", errorList);
					errorList := checkValidUUID(tokenID, "Token (asset) id", errorList);
					errorList := checkIfFloat(assetObject.getString("balance"), "Balance", errorList);
					errorList := checkIfNonNegative(balance.floatValue(), "Balance", errorList);
					
					if(errorList.noErrors()) {
						var tokenAsset := (from Token where id = ~tokenID.parseUUID());
						var portfolio := (from Portfolio where id = ~portfolioID.parseUUID() and user.username = ~username and user.session.apiToken = ~token);
					
						if(tokenAsset.length == 0) {
							errorList.addError("Token (asset) cannot be found", 400);
						}
						if(portfolio.length == 0){
							errorList.addError("Portfolio cannot be found", 400);
						}
					}
					
					if(errorList.noErrors()) {
						var tokenAsset := (from Token where id = ~tokenID.parseUUID());
						var portfolio := (from Portfolio where id = ~portfolioID.parseUUID() and user.username = ~username and user.session.apiToken = ~token);
						
						var asset := Asset{
							token := tokenAsset[0]
							portfolio := portfolio[0]
							balance := balance.floatValue()
							order := portfolio[0].assets.length-1
						}.save();
						
						result.put("asset", asset.createJSONObject(false, false));
					}
				
				// Delete asset from a portfolio 
				// .../api/asset/delete (POST)
				}else if(spec == "delete") {
					var assetID := param1;
								
					errorList := checkValidUUID(assetID, "Asset id", errorList);
					
					if(errorList.noErrors()) {
						var asset := (from Asset where portfolio.user.session.apiToken = ~token and portfolio.user.username = ~username and id = ~assetID.parseUUID());
						
						if(asset.length == 0) {
							errorList.addError("Asset cannot be found", 400);
						}else{
							asset[0].portfolio := null;
							asset[0].delete();
							result.put("delete", true);
						}
					}
				
				// No other specifications for POST request known
				// .../api/asset/not(auth) (POST)
				}else{
					errorList.addError("Specification for ~endpoint and ~getHttpMethod() unknown",400);
				}
			}else if(getHttpMethod() == "GET") {
				
				// Not enough parameters provided
				// .../api/asset (GET)
				if(spec.length() == 0 && param1.length() == 0 && param2.length() == 0 && param3.length() == 0) {
					errorList.addError("No token, username, asset id or portfolio id provided", 400);
					
				}else{
					
					// Get asset from a portfolio
					// .../api/asset/{asset_id}/{api_token}/{username} (GET)
					if(spec.length() > 0 && param1.length() > 0 && param2.length() > 0 && param3.length() == 0 && spec.parseUUID() != null) {
						var assetID := spec;
						var token := param1;
						var username := param2;
						
						errorList := checkValidUUID(assetID, "Asset id", errorList);
						errorList := checkAuthorization(token, username, false, errorList);
						
						if(errorList.noErrors()) {
							var asset := (from Asset where id = ~assetID.parseUUID());
							var aObject := JSONObject();
							
							if(asset.length == 0) {
								errorList.addError("Asset not found", 400);
							}else if(asset.length == 1) {
								asset := (from Asset where id = ~assetID.parseUUID() and portfolio.user.session.apiToken = ~token and portfolio.user.username = ~username);
								
								if(asset.length == 1) {
									aObject := asset[0].createJSONObject(true, true);	
								}else {
									errorList.addError("Unauthorized to view asset", 401);
								}
							}
								
							result.put("asset", aObject);
						}
					
					// Get all assets from a portfolio
					// .../api/asset/{portfolio_id}/{api_token}/{username} (GET)
					}else if(spec == "portfolio" && param1.length() > 0 && param1.parseUUID() != null && param2.length() > 0 && param3.length() > 0) {
						var portfolioID := param1;
						var token := param2;
						var username := param3;
						
						errorList := checkAuthorization(token, username, false, errorList);
						
						if(errorList.noErrors()) {
							var assets := (from Asset where portfolio.id = ~portfolioID.parseUUID() and portfolio.user.session.apiToken = ~token and portfolio.user.username = ~username);
						
							var aArray := JSONArray();
						
							for(asset : Asset in assets) {
								aArray.put(asset.createJSONObject(true, false));
							}
							
							result.put("assets", aArray);	
						}
						
					// No valid asset or portfolio id or not all parameters correctly provided
					}else{
						if(spec.parseUUID() != null) {
							errorList.addError("Asset id is not a valid UUID", 400);
						}else {
							errorList.addError("Portfolio GET request not correctly formatted",400);	
						}
					}
				}
				
			// Update asset
			// .../api/asset (PUT)
			}else if(getHttpMethod() == "PUT") {
			
				var body := JSONObject(readRequestBody());
				
				var token := body.getString("token");
				var username := body.getString("username");
				var aObject := body.getJSONObject("asset");
				
				errorList := checkAuthorization(token, username, false, errorList);
				errorList := checkJSONObjectNull(aObject, "Asset", errorList);
				errorList := checkValidUUID(aObject.getString("id"), "Asset id", errorList);
				errorList := checkIfFloat(aObject.getString("balance"), "Balance", errorList);
				errorList := checkIfNonNegative(aObject.getString("balance").parseFloat(), "Balance", errorList);
				errorList := checkIfInteger(aObject.getString("order"), "Order", errorList);
				
				if(errorList.noErrors()) {
					var asset := (from Asset where portfolio.user.session.apiToken = ~token and portfolio.user.username = ~username and id = ~aObject.getString("id").parseUUID());
					
					if(asset.length == 0) {
						errorList.addError("Asset cannot be found", 400);
					}else{
						asset[0].balance := aObject.getDouble("balance").floatValue();
						asset[0].order := aObject.getInt("order");
						asset[0].active := aObject.getBoolean("active");
						asset[0].save();
						
						result.put("asset",asset[0].createJSONObject(true, false));
					}
				}
			
			// Other request methods than POST, PUT, and GET are not allowed
			// .../api/asset/... (not POST, PUT, GET)
			}else{
				errorList.addError("The selected method ~getHttpMethod() is not allowed", 405);
			}
		}else if(endpoint == "token") {
			
			if(getHttpMethod() == "POST") {
				var body := JSONObject(readRequestBody());
				var token := body.getString("token");
				var username := body.getString("username");
				
				errorList := checkAuthorization(token, username, true, errorList);
				
				// Create token
				// .../api/token (POST)
				if(spec == "create" && errorList.noErrors()) {
					var tokenObject := body.getJSONObject("tokenObject");
					errorList := checkJSONObjectNull(tokenObject, "Token", errorList);
					
					var tokenName := tokenObject.getString("name");
					var tokenSymbol := tokenObject.getString("symbol");
				
					errorList := checkStringEmpty(tokenName, "Token name", errorList);
					errorList := checkStringEmpty(tokenSymbol, "Token symbol", errorList);	
					
					if([x | x in (from Token) where x.name == tokenName].length != 0) {
						errorList.addError("A token with this name already exists", 400);
					}
					
					if([x | x in (from Token) where x.symbol == tokenSymbol].length != 0) {
						errorList.addError("A token with this symbol already exists", 400);
					}	
					
					if(errorList.noErrors()) {
						var newToken := Token{
							name := tokenName
							symbol := tokenSymbol
							data := TokenData{}
						}.save();
						
						result.put("token", newToken.createJSONObject(false));
					}	
				
				// Delete token
				// .../api/token (POST)
				}else if(spec == "delete" && errorList.noErrors()) {
					var tokenID := param1;
					
					errorList := checkValidUUID(tokenID, "Token (asset) id", errorList);

					if(errorList.noErrors()) {
						var thisToken := (from Token where id = ~tokenID.parseUUID());
						
						if(thisToken.length == 0) {
							errorList.addError("Token cannot be found", 400);
						}else{
							thisToken[0].removeToken();
							
							result.put("delete", true);
						}
					}
					
				// No other specifications for POST request known
				// .../api/token/not(auth) (POST)
				}else if(errorList.noErrors()) {
					errorList.addError("Specification for ~endpoint and ~getHttpMethod() unknown",400);
				}
			}else if(getHttpMethod() == "GET") {
				if(spec.parseUUID() != null) {
					var tokenID := spec;
						
					errorList := checkValidUUID(tokenID, "Token id", errorList);	
						
					if(errorList.noErrors()) {
						var data := false;
						
						if(param1.length() > 0 && param1 == "data") {
							data := true;
						}
						
						var token := (from Token where id = ~tokenID.parseUUID());
							
						if(token.length > 0) {
							result.put("token", token[0].createJSONObject(data));
						}
					}
				}else {
					var data := false;
					if(spec.length() > 0 && spec == "data") {
						data := true;
					}
					
					var tokenArray := JSONArray();
							
					for(token : Token order by token.name asc) {
						tokenArray.put(token.createJSONObject(data));
					}
							
					result.put("tokens", tokenArray);
				}
				
			}else if(getHttpMethod() == "PUT") {
				
				var body := JSONObject(readRequestBody());
				
				var token := body.getString("token");
				var username := body.getString("username");
				var tObject := body.getJSONObject("tokenObject");
								
				errorList := checkAuthorization(token, username, true, errorList);
				errorList := checkJSONObjectNull(tObject, "Token", errorList);
				errorList := checkValidUUID(tObject.getString("id"), "Token id", errorList);
				
				if(errorList.noErrors()) {
					var tokenID := tObject.getString("id");
					var tokenName := tObject.getString("name");
					var tokenSymbol := tObject.getString("symbol");
						
					errorList := checkStringEmpty(tokenName, "Token name", errorList);
					errorList := checkStringEmpty(tokenSymbol, "Token symbol", errorList);
					
					if([x | x in (from Token) where x.id != tokenID.parseUUID() && x.name == tokenName].length != 0) {
						errorList.addError("A token with this name already exists",400);
					}
						
					if([x | x in (from Token) where x.id != tokenID.parseUUID() && x.symbol == tokenSymbol].length != 0) {
						errorList.addError("A token with this symbol already exists",400);
					}
					
					if(errorList.noErrors()) {
						var thisToken := (from Token where id = ~tObject.getString("id").parseUUID());
						thisToken[0].name := tokenName;
						thisToken[0].symbol := tokenSymbol;
						thisToken[0].save();
						
						result.put("token", thisToken[0].createJSONObject(false));
					}	
				}
				
			// Other request methods than POST, PUT, and GET are not allowed
			// .../api/token/... (not POST, PUT, GET)
			}else{
				errorList.addError("The selected method ~getHttpMethod() is not allowed", 405);
			}
		}else if(endpoint == "user") {
			
			// Get user with username and api_token
			// .../api/user/{api_token}/{username} (GET)
			if(getHttpMethod() == "GET") {
				var token := spec;
				var username := param1;
				
				errorList := checkAuthorization(token, username, false, errorList);
				
				if(errorList.noErrors()) {
					result.put("user", findUser(username).createJSONObject());
				}
			
			}else if(getHttpMethod() == "PUT") {
				var body := JSONObject(readRequestBody());
				var username : String;
				
				if(body.has("username")) {
					username := body.getString("username");	
				}else{
					errorList.addError("Username not provided", 400);
				}
				
				if(errorList.noErrors()) {
					
					// Update user profile
					// .../api/user/profile (PUT)
					if(spec == "profile") {
						var token := body.getString("token");
						errorList := checkAuthorization(token, username, false, errorList);
						var userObject := body.getJSONObject("user");
						errorList := checkJSONObjectNull(userObject, "User", errorList);
						
						var user : User;
						
						if(errorList.noErrors()) {
							user := User{}.findUserByAPI(username, token)[0];
							
							errorList.addErrors(user.validateEmail(userObject.getString("email")), 400);	
						}
						
						if(errorList.noErrors()) {
							user.firstName := userObject.getString("firstName");
							user.lastName := userObject.getString("lastName");
							user.email := userObject.getString("email");
							user.save();
						
							result.put("profile", true);
							result.put("user", user.createJSONObject());	
						}
						
					// Update user password
					// .../api/user/password (PUT)
					}else if(spec == "password") {
						var token : String;
						var type := "update";
						var userObject : JSONObject;
						var user : User;

						if(body.has("token")) {
							token := body.getString("token");
							user := User{}.findUserByAPI(username, token)[0];
						}else{
							type := "reset";
							user := findUser(username);
						}
						
						if(body.has("user")) {
							userObject := body.getJSONObject("user");
							errorList := checkJSONObjectNull(userObject, "User", errorList);
						}
						
						var password: String;
						var password_confirmation: String;
						
						if(type == "update") {
							password := userObject.getString("password");
							password_confirmation := userObject.getString("password_confirmation");
							
						}else if(type == "reset") {
							password := body.getString("password");
							password_confirmation := body.getString("password_confirmation");
						}
						
						errorList := checkStringEmpty(password, "Password", errorList);
						errorList := checkStringEmpty(password_confirmation, "Password confirmation", errorList);
						
						if(password != password_confirmation) {
							errorList.addError("Passwords are not identical", 400);
						}else{
							errorList.addErrors(User{}.validatePassword(password as Secret), 400);
						}
						
						if(errorList.noErrors()) {
							if(type == "reset") {
								user.resetPassword(password as Secret, body.getString("baseURL"));
								result.put("reset", true);
								result.put("message", "A confirmation mail has been sent to activate your account");
							}else{
								user.password := (password as Secret).digest();
								user.save();	
								result.put("password", true);
								result.put("user", user.createJSONObject());
							}
						}
					}
				}
			
			}else if(getHttpMethod() == "POST") {
				var body := JSONObject(readRequestBody());
				
				// Activate user
				// .../api/user/activate (POST)
				if(spec == "activate") {
					if(body.has("authToken")) {
						var authToken := body.getString("authToken");	
						
						if((from User as user where user.authToken = ~authToken).length == 0) {
							
							errorList.addError("The authentication token is invalid", 400);
						}else{
							
							if(User{}.activateAccount(authToken)) {
								result.put("activate", true);
								result.put("message", "Account activated!");
							}else{
								
								errorList.addError("Account could not be activated. Please try again later.", 400);
							}	
						}
					}else {
						errorList.addError("No authentication token provided", 400);	
					}
				}
				
			// Other request methods than POST, PUT, and GET are not allowed
			// .../api/user/... (not POST, PUT, GET)
			}else{
				errorList.addError("The selected method ~getHttpMethod() is not allowed", 405);
			}
		}
	}
	
	if(errorList.noErrors()) {
		getDispatchServlet().getResponse().setStatus(200);
		response := successResponse();
		response.put("result", result);
	}else{
		rollback();
		
		var statusCode := errorList.getStatusCode();
		response := errorResponse(statusCode);
		getDispatchServlet().getResponse().setStatus(statusCode);
		response.put("errors", errorArray(errorList.getMessages()));
	}
	
	return response;	
}