module entities

section data model

entity User {
	username 	: String(id,  iderror="Username is already in use", 
							  idemptyerror="Username may not be empty")
	email 		: Email
	password 	: Secret
	firstName 	: String
	lastName	: String
	authToken	: String
	admin 		: Bool (default = false)
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

function currentUser(): User {
	return securityContext.principal;
}

// extend entity User {
	 
	// password(validate(password.length() >= 8, "Password needs to be at least 8 characters"),
	// 	validate(/[a-z]/.find(password), "Password must contain a lower-case character"),
 //   		validate(/[A-Z]/.find(password), "Password must contain an upper-case character"),
 //   		validate(/[0-9]/.find(password), "Password must contain a digit")
 //   	)
// } 
	
// 	function accountLinkName() : String {
// 		if(!loggedIn() || securityContext.principal.firstName != "") {
// 			var firstNameSplit := securityContext.principal.firstName.split();
// 			return ""+nameSplit[0];
// 		}else{
// 			return "Account";
// 		}
// 	}
// }

derive CRUD User

entity Token {
	name 		: String (not null)
	symbol 		: String (not null)
	data		: TokenData (inverse = token)
}

entity TokenData {
	token		: Token (not null)
	price		: Float (default = 0.0)
	prevDay		: Float (default = 0.0)
	change		: Float (default = 0.0)
	high		: Float (default = 0.0)
	low			: Float (default = 0.0)
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

function getPortfolios() : [Portfolio] {
	return (from Portfolio as p where p.user = ~currentUser());
}

function changePercentage(old: Float, new: Float): Float {
	if(old == 0.0) {
		return 0.0;
	}
	return (new-old)/old*100.0;
}

function sum(list: [Float]): Float {
	var total := 0.0;
	
	for(item in list) {
		total := total + item;
	}
	
	return total;
}

principal is User with credentials username, password

access control rules 

predicate isAdmin() { 
	loggedIn() && currentUser().admin
}

rule page root { true }
rule page login { true }
rule page register { true }
rule page account { loggedIn() }
rule page portfolios { loggedIn() }
rule page portfolio(*) { loggedIn() }
rule page tokens { isAdmin() }
