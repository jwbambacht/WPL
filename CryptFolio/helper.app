module helper

section native java

// Definition of a request java class that takes a (string) url and returns a JSON string with the response.
native class request.Request as Request {
	constructor()
	static doGet(String) : String 
}

// Java class extensions that enables to change the status code of the response to the external API
native class utils.AbstractDispatchServletHelper as DispatchServlet {
  getResponse(): HttpServletResponse
}
native class javax.servlet.http.HttpServletResponse as HttpServletResponse {
  setStatus(Int)
}

// Definition of a Java error class that includes the code and message of error
native class errors.Error as Error {
	constructor(String, Int)
	getCode() : Int
	getMessage() : String
}

// Definition of Java class that collects all errors during a request
native class errors.ErrorList as ErrorList {
	constructor()
	addError(String, Int)
	addErrors([String], Int)
	getMessages() : [String]
	getStatusCode() : Int
	noErrors() : Bool
}

section data fetching

// Method that fetches the tokens price data from the Binance API, processes it and inserts/updates the TokenData entities
function fetchData() {
	var response := Request.doGet("https://api.binance.com/api/v3/ticker/24hr");

	if(response == "FAILED") {
		log("API Fetch failed");
		return;
	}
	
	var json := JSONArray(response);
	
	for(index: Int from 0 to json.length()) {
		var obj := json.getJSONObject(index);
		
		if(obj.getString("symbol").contains("USDT")) {
			var symbol := obj.getString("symbol").split("USDT")[0];
			if(isToken(symbol)) {
				updateTokenData(symbol, obj);
			}
		}
	}
	
	log("API Fetch success");
}

// The tokens price data is fetched every 30 seconds
invoke fetchData() every 30 seconds

// Method that contains the logic of inserting/updating token data
function updateTokenData(symbol: String, obj: JSONObject) {
	var token := getToken(symbol);
	
	if(token.data == null) {
		token.data := TokenData{};
		token.data.save();
	}
	
	token.data.price := obj.getString("lastPrice").parseFloat();
	token.data.prevDay := obj.getString("prevClosePrice").parseFloat();
	token.data.change := obj.getString("priceChangePercent").parseFloat();
	token.data.high := obj.getString("highPrice").parseFloat();
	token.data.low := obj.getString("lowPrice").parseFloat();
	token.data.volume := obj.getString("quoteVolume").parseFloat()/1000000.0;
	token.data.save();
}

section helper functions

// Method that returns the current user
function currentUser(): User {
	return securityContext.principal;
}

// Method that returns the portfolios of the loggedin user
function myPortfolios() : [Portfolio] {
	return (from Portfolio as p where p.user = ~currentUser());
}

// Method that returns the assets of the loggedin user
function myAssets(): [Asset] {
	return (from Asset as a where a.portfolio.user = ~currentUser());
}

// Method that returns the token given a symbol
function getToken(symbol: String): Token {
	return (from Token as token where token.symbol = ~symbol)[0];
}

// Method that checks whether a token exists, given a symbol
function isToken(symbol: String): Bool {
	return (from Token as token where token.symbol = ~symbol).length == 1;
}

// Method that calculates the percential change
function changePercentage(old: Float, new: Float): Float {
	if(old == 0.0) {
		return 0.0;
	}
	return (new-old)/old*100.0;
}

// Method that sums a list of float numbers
function sum(list: [Float]): Float {
	var total := 0.0;
	
	for(item in list) {
		total := total + item;
	}
	
	return total;
}

// Method that determines the text color given a value
function textColor(value: Float): String {
	if(value > 0.0) {
		return "text-success";
	}else if(value < 0.0) {
		return "text-danger";
	}
	return "text-white";
}

// Method that determines the background color given a value
function bgColor(value: Float): String {
	if(value > 0.0) {
		return "bg-success";
	}else if(value < 0.0) {
		return "bg-danger";
	}
	return "bg-secondary";
}

// Method that determines the direction of an arrow icon given a value
function arrowIcon(value: Float): String  {
	if(value > 0.0) {
		return "bi-caret-up-fill";
	}else if(value < 0.0) {
		return "bi-caret-down-fill";
	}else{
		return "bi-caret-right-fill";
	}
}

// Method that returns the absolute value
function absolute(value: Float): Float {
	if(value < 0.0) {
		return value*-1.0;
	}
	
	return value;
}

// Method that determines the number of decimal places of value to enable the significance of decimals
function nDecimals(value: Float, n: Int, initial: Bool) : Float {
	
	if(value == 0.0 && initial == true) {
		return 0.00;
	}
	
	var decimals := n;
	
	if(value < 0.001) {
		decimals := n+4;
	}else if(value < 0.01) {
		decimals := n+3;
	}else if(value < 0.1) {
		decimals := n+2;
	}else if(value < 1.0) {
		decimals := n+1;
	}
	
	var power := 1.0;
	for(i: Int from 0 to decimals) {
		power := power*10.0+(i-i).floatValue();
	}
	
	var val := ((value*power).round()).floatValue()/power;
	
	if(val == 0.0) {
		return nDecimals(value, decimals+1, false);
	}
	
	return val;
}

// Method that removes unwanted tokens "/", "+", and "-" from a token such that is usable to be used in an API GET request as url parameter
function cleanPassword(password: Secret): Secret {
	return password.split("/").concat().split("+").concat().split("-").concat();
}