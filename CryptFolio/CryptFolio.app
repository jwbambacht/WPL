application CryptFolio

description {
	A portfolio manager for crypto currencies
}

imports templates
imports entities

section pages

imports pages/root				// public
imports pages/auth				// public
imports pages/account 			// authenticated

imports pages/portfolio			// authenticated
imports pages/asset				// authenticated
imports pages/token				// admin

section native java

native class request.Request as Request {
	constructor()
	static doGet(String) : String 
}

section data fetching

function fetchData() {
	var response := Request.doGet("https://api.binance.com/api/v3/ticker/24hr");
		
	if(response == "FAILED") {
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
}

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
	token.data.volume := obj.getString("volume").parseFloat();
	token.data.save();
}

// function apiGET() {
// 	for(token : Token) {
// 		var response := Request.doGet("https://api.binance.com/api/v3/ticker/24hr?symbol="+token.symbol+"USDT");
// 		// log(response);
// 		
// 		if(response == "FAILED") {
// 			return;
// 		}
// 		
// 		var json := JSONObject(response);
// 		
// 		if(token.data == null) {
// 			token.data := TokenData{};
// 			token.data.save();
// 		}
// 		
// 		token.data.price := json.getString("lastPrice").parseFloat();
// 		token.data.prevDay := json.getString("prevClosePrice").parseFloat();
// 		token.data.change := json.getString("priceChangePercent").parseFloat();
// 		token.data.high := json.getString("highPrice").parseFloat();
// 		token.data.low := json.getString("lowPrice").parseFloat();
// 		token.data.save();
// 	}
// }

section helper functions

function textColor(value: Float): String {
	if(value > 0.0) {
		return "text-success";
	}else if(value < 0.0) {
		return "text-danger";
	}
	return "text-white";
}

function bgColor(value: Float): String {
	if(value > 0.0) {
		return "bg-success";
	}else if(value < 0.0) {
		return "bg-danger";
	}
	return "bg-secondary";
}
function arrowIcon(value: Float): String  {
	if(value > 0.0) {
		return "bi-caret-up-fill";
	}else if(value < 0.0) {
		return "bi-caret-down-fill";
	}else{
		return "bi-caret-right-fill";
	}
}
function absolute(value: Float): Float {
	if(value < 0.0) {
		return value*-1.0;
	}
	
	return value;
}

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