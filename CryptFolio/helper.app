module helper

section native java

native class request.Request as Request {
	constructor()
	static doGet(String) : String 
}

section data fetching

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

invoke fetchData() every 30 seconds

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

function currentUser(): User {
	return securityContext.principal;
}

function myPortfolios() : [Portfolio] {
	return (from Portfolio as p where p.user = ~currentUser());
}

function myAssets(): [Asset] {
	return (from Asset as a where a.portfolio.user = ~currentUser());
}

function getToken(symbol: String): Token {
	return (from Token as token where token.symbol = ~symbol)[0];
}

function isToken(symbol: String): Bool {
	return (from Token as token where token.symbol = ~symbol).length == 1;
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