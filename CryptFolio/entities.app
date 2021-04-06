module entities

section data model

entity User {
	username 	: String(id, iderror="Username is already in use", idemptyerror="Username may not be empty")
	email 		: Email
	password 	: Secret
	firstName 	: String
	lastName	: String
	
	admin 		: Bool (default = false)
	authToken	: String
	activated   : Bool (default = false)
	session		: UserSession
	
	portfolios 	: {Portfolio} (inverse = user)
	value		: Float := sum([x.value | x in portfolios])
	value24h	: Float := sum([x.value24h | x in portfolios])
	cost		: Float := sum([x.cost | x in portfolios])
	profit		: Float := sum([x.profit | x in portfolios])
	
	function isAdmin(): Bool {
		if(admin == null) {
			admin := false;
		}
		return admin;
	}
}

derive CRUD User

extend entity User {
	// Method that sets a new password and invokes the generate auth token function
	function resetPassword(password: Secret, baseURL: String) {
		
		this.activated := false;
		this.password := password.digest();
		this.generateAuthToken();
		this.save();
		
		this.sendActivationEmail(baseURL);
	}
	
	// Method that validates the user: username of at least length 6, unique username, non empty
	function validateUser(): [String] {
		var errors: [String];
		
		if(this.username.length() < 6) {
			errors.add("Username must contain at least 6 characters");
		}else{
			if(findUser(this.username) != null) {
				errors.add("Username already in use");
			}	
		}
		
		var emailErrors := this.validateEmail(this.email); 
		
		if(emailErrors.length > 0) {
			errors.addAll(emailErrors);
		}
		
		return errors;
	}
	
	// Method that determines for some basic checks if the email format is valid: length, already exists, @ and . symbols
	// The regex from the documentation about matching a complete email is not working for some reason 
	function validateEmail(email: String): [String] {
		var errors: [String];
		
		if(email.length() == 0) {
			errors.add("Email cannot be empty");
			
			return errors;
		}
		
		if(findUserByEmail(email).length != 0) {
			if(findUserByEmail(email)[0] != findUser(this.username)) {
				errors.add("Email already in use");
				
				return errors;		
			}	
		}
		
		if(!email.contains("@")) {
			errors.add("Email does not contain '@' symbol");
			
			return errors;	
		}
		
		if(email.length() < 3) {
			errors.add("Email must contain a part before and after the '@' symbol");
			
			return errors;
		}
		
		var emailDomain := email.split("@")[1];
		
		if(!emailDomain.contains(".")) {
			errors.add("Domain must contain a dot symbol");
		}
		
		return errors;
	}
	
	// Method that determines password validation: minumum length of 8, contains a lowercase, uppercase and digit.
	function validatePassword(password: Secret): [String] {
		var errors: [String];
		
		if(password.length() < 8) {
			errors.add("Password must contain at least 8 characters");
		}else{
			if(/[a-z]/.find(password) == false) {
				errors.add("Password must contain a lower-case character");
			}
			if(/[A-Z]/.find(password) == false) {
				errors.add("Password must contain an upper-case character");
			}
			if(/[0-9]/.find(password) == false) {
				errors.add("Password must contain a digit");
			}	
		}
		
		return errors;
	}
	
	// Method that returns if the user session of a user is still valid
	function userSession(token: String, password: String, username: String): Bool {
		var userToken := from User where session.apiToken = ~token;
		var userPassword := from User where password = ~password;
		var userUsername := findUser(username);
		
		if(userToken.length == 0 || userPassword.length == 0 || userUsername == null) {
			return false;
		}
		
		return ((userToken[0] == userPassword[0]) && (userPassword[0] == userUsername));
	}
	
	function sendActivationEmail(baseURL: String) {
		email confirmationEmail(this, baseURL);	
	}
	
	function generateAuthToken() {
		var randomString := email+now().format("yyyyMMddHmmss");
		
		this.authToken := cleanPassword((randomString as Secret).digest());
	}
	
	function generateAPIToken(hours: Int, doesNotExpire: Bool) {
		var randomString := username+now().format("yyyyMMddHmmss");
		
		var token := cleanPassword((randomString as Secret).digest());
		var expiresAt := now().addHours(hours);
		
		if(doesNotExpire) {
			expiresAt := null;
		}
		
		UserSession{
			user := this
			apiToken := token
			expiresAt := expiresAt 
		}.save();
	}
	
	function activateAccount(token: String): Bool {
		var users := (from User as user where authToken = ~token);
		
		if(users.length == 0 || users.length > 1) {
			return false;
		}else{
			users[0].authToken := "";
			users[0].activated := true;
			users[0].save();
			
			return true;
		}
	}
	
	function findUserByAPI(username: String, token: String): [User] {
		return (from User where username = ~username and session.apiToken = ~token);
	}
	
	function createJSONObject(): JSONObject {
		var obj := JSONObject();
		obj.put("username", this.username);
		obj.put("firstName", this.firstName);
		obj.put("lastName", this.lastName);
		obj.put("password", this.password);
		obj.put("email", this.email);
		obj.put("admin", this.admin);
		
		return obj;
	}
}

entity UserSession {
	user 		: User (inverse = session)
	apiToken	: String
	expiresAt	: DateTime
}

extend entity UserSession {
	function cleanSessions() {
		for (s : UserSession where s.expiresAt != null && s.expiresAt.before(now())) {
			s.delete();
		}		
	}	
}

invoke UserSession{}.cleanSessions() every 1 minutes

entity Token {
	name 		: String (not null)
	symbol 		: String (not null)
	data		: TokenData (inverse = token)
	favorite	: Bool (default = false) := isFavorite()
}

extend entity Token {
	function initToken(name: String, symbol: String) {
		this.name := name;
		this.symbol := symbol;
		this.data := TokenData{};
		this.save();
	}
	
	function isFavorite(): Bool {
		return ((from Asset as asset where asset.portfolio.user = ~currentUser() and asset.token = ~this).length != 0);
	}
	
	function createJSONObject(includeData: Bool): JSONObject {
		var obj := JSONObject();
		obj.put("id",this.id);
		obj.put("name", this.name);
		obj.put("symbol", this.symbol);
		if(includeData) {
			obj.put("data", this.data.createJSONObject());
		}
		obj.put("favorite", this.favorite);
		
		return obj;
	}
	
	function removeToken() {
		for(asset : Asset) {
			if(asset.token.name == this.name) {
				asset.portfolio := null;
				asset.token := null;
				asset.delete();
			}
		}
		
		var tokenData := this.data;
		tokenData.token := null;
		this.data := null;
		tokenData.delete();
		this.delete();
	}
}

entity TokenData {
	token		: Token (not null)
	price		: Float (default = 0.0)
	prevDay		: Float (default = 0.0)
	change		: Float (default = 0.0)
	high		: Float (default = 0.0)
	low			: Float (default = 0.0)
	volume		: Float (default = 0.0)
}

extend entity TokenData {
	function createJSONObject(): JSONObject {
		var obj := JSONObject();
		obj.put("price",this.price);
		obj.put("prevDay",this.prevDay);
		obj.put("change",this.change);
		obj.put("high",this.high);
		obj.put("low",this.low);
		obj.put("volume",this.volume);
		
		return obj;
	}
}

entity Asset {
	token 		: Token (not null)
	name 		: String := token.name
	balance 	: Float (default = 0.0)
	order 		: Int
	portfolio 	: Portfolio (not null)
	active 		: Bool (default = true)
	value 		: Float (default = 0.0) := balance*token.data.price
	value24h	: Float (default = 0.0) := balance*token.data.prevDay
}

extend entity Asset {
	function createJSONObject(includePortfolio: Bool, includeData: Bool): JSONObject {
		var obj := JSONObject();
		obj.put("id", this.id);
		obj.put("token", this.token.createJSONObject(includeData));
		obj.put("balance", this.balance);
		obj.put("active",this.active);
		obj.put("order", this.order);
		obj.put("value",this.value);
		obj.put("value24h",this.value24h);
		if(includePortfolio) {
			obj.put("portfolio",this.portfolio.createJSONObject(false, false));
		}	
								
		return obj;
	}
}

entity Portfolio {
	name 		: String(name)
	assets 		: {Asset} (inverse = portfolio)
	cost		: Float (default = 0.0)
	user 		: User
	
	value		: Float (default = 0.0) := sum([x.value | x in assets where x.active == true])
	value24h	: Float (default = 0.0) := sum([x.value24h | x in assets where x.active == true])
	changePercentage : Float (default = 0.0) := if(value24h != 0.0) (value-value24h)/value24h*100.0 else 0.0
	changeValue : Float (default = 0.0) := value-value24h
	profit		: Float (default = 0.0) := value-cost
}

extend entity Portfolio {
	function remove(): Bool {
		var pid := this.id;
		
		for(asset : Asset in this.assets) {
			asset.portfolio := null;
			asset.delete();
		}
		this.delete();
		
		if((from Portfolio where id = ~pid).length == 0) {
			return true;
		}
		
		return false;
	}
	
	function addAsset(asset: Asset) {
		this.assets.add(asset);
	}
	
	function createJSONObject(includeAssets: Bool, includeData: Bool): JSONObject {
		var obj := JSONObject();
		obj.put("id", this.id);
		obj.put("name", this.name);
		obj.put("cost", this.cost);
		obj.put("value", this.value);
		obj.put("value24h", this.value24h);
		obj.put("changePercentage", this.changePercentage);
		obj.put("changeValue", this.changeValue);
		obj.put("profit", this.profit);
		
		if(includeAssets == true) {
			var assetsArray := JSONArray();
		
			for(asset : Asset in this.assets) {
				assetsArray.put(asset.createJSONObject(false, includeData));
			}
			
			obj.put("assets", assetsArray);
		}
								
		return obj;
	}
}


define email confirmationEmail(user: User, baseURL: String) {
	to(user.email)
	from("wplcryptfolio@gmail.com")
	subject("CryptFolio: confirm your account")
	
	activateAccountEmail(user, baseURL)
}

section access control

principal is User with credentials username, password

access control rules 

predicate isAdmin() { 
	loggedIn() && currentUser().admin
}

rule page root { true }
rule page login { true }
rule page forgotPassword { true }
rule page activateAccount(*) { true }
rule page register(*) { true }
rule page account { loggedIn() }
rule page portfolios { loggedIn() }
rule page portfolio(*) { loggedIn() }
rule page asset(*) { loggedIn() }
rule page watchlist { true }
rule page tokens { isAdmin() }

rule page api(*) { true } 