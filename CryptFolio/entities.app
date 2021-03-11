module entities

section data model

entity User {
	username 	: String(id,  iderror="Username is already in use", 
							  idemptyerror="Username may not be empty")
	email 		: Email
	password 	: Secret
	firstName 	: String
	lastName	: String
	
	admin 		: Bool (default = false)
	authToken	: String
	activated   : Bool (default = false)
	
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
	function initAdmin() {
		this.username := "admin";
		this.password := ("Administrator123" as Secret).digest();
		this.email := "admin@cryptofolio.com";
		this.admin := true;
		this.activated := true;
		
		this.save();
	}
	function resetPassword(password: Secret) {
		
		this.activated := false;
		this.password := password.digest();
		this.generateAuthToken();
		this.save();
		
		this.sendActivationEmail();
	}
	
	function sendActivationEmail() {
		email confirmationEmail(this);	
	}
	
	function generateAuthToken() {
		var randomString := email+now().format("yyyyMMddHmmss");
		
		this.authToken := (randomString as Secret).digest().split("/").concat().split("+").concat().split("-").concat();
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
	
	
}

entity Token {
	name 		: String (not null)
	symbol 		: String (not null)
	data		: TokenData (inverse = token)
	favorite	: Bool (default = false) := tokenIsFavorite(this)
}

extend entity Token {
	function initToken(name: String, symbol: String) {
		this.name := name;
		this.symbol := symbol;
		this.data := TokenData{};
		this.save();
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

entity Portfolio {
	name 		: String(name)
	assets 		: {Asset} (inverse = portfolio)
	cost		: Float (default = 0.0)
	user 		: User
	
	value		: Float (default = 0.0) := sum([x.value | x in assets])
	value24h	: Float (default = 0.0) := sum([x.value24h | x in assets])
	changePercentage : Float (default = 0.0) := if(value24h != 0.0) (value-value24h)/value24h*100.0 else 0.0
	changeValue : Float (default = 0.0) := value-value24h
	profit		: Float (default = 0.0) := value-cost
}

function tokenIsFavorite(token: Token): Bool {
	return ((from Asset as asset where asset.portfolio.user = ~currentUser() and asset.token = ~token).length != 0);
}

define email confirmationEmail(user: User) {
	to(user.email)
	from("wplcryptfolio@gmail.com")
	subject("CryptFolio: confirm your account")
	
	activateAccountEmail(user)
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
rule page watchlist { loggedIn() }
rule page tokens { isAdmin() }
