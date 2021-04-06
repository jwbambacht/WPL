application CryptFolio

description {
	A portfolio manager for crypto currencies
}

section imports

imports helper
imports templates
imports entities

imports services
imports serviceFunctions

imports errorPages

section application init

init {
	// ADMIN credentials: 	username: admin, password: Administrator123, email is a dummy
	User{
		username := "admin", 
		password := ("Administrator123" as Secret).digest(), 
		email := "dummy@dummy.com",
		admin := true, 
		activated := true
	}.save();
	
	// USER credentials: 	username: wpluser, password: Wpl2021pw, email is a dummy								
	User{
		username := "wpluser", 
		password := ("Wpl2021pw" as Secret).digest(), 
		email := "dummy@dummy.com", 
		activated := true
	}.save();
	
	// Some of the high listed tokens are added to the system
	Token{}.initToken("Aave", "AAVE");
	Token{}.initToken("Algorand", "ALGO");
	Token{}.initToken("Avalanche", "AVAX");
	Token{}.initToken("Binance Coin", "BNB");
	Token{}.initToken("Bitcoin", "BTC");
	Token{}.initToken("Bitcoin Cash", "BCH");
	Token{}.initToken("Cardano", "ADA");
	Token{}.initToken("Chainlink", "LINK");
	Token{}.initToken("Compound", "COMP");
	Token{}.initToken("Cosmos", "ATOM");
	Token{}.initToken("Dai", "DAI");
	Token{}.initToken("Dash", "DASH");
	Token{}.initToken("Decred", "DCR");
	Token{}.initToken("Dogecoin", "DOGE");
	Token{}.initToken("Elrond", "EGLD");
	Token{}.initToken("EOS", "EOS");
	Token{}.initToken("Ethereum", "ETH");
	Token{}.initToken("Filecoin", "FIL");
	Token{}.initToken("FTX Token", "FTT");
	Token{}.initToken("Holo", "HOT");
	Token{}.initToken("Icon", "ICX");
	Token{}.initToken("Kusama", "KSM");
	Token{}.initToken("Litecoin", "LTC");
	Token{}.initToken("Maker", "MKR");
	Token{}.initToken("Monero", "XMR");
	Token{}.initToken("NEM", "XEM");
	Token{}.initToken("Neo", "NEO");
	Token{}.initToken("PancakeSwap", "CAKE");
	Token{}.initToken("Polkadot", "DOT");
	Token{}.initToken("Ripple", "XRP");
	Token{}.initToken("Solana", "SOL");
	Token{}.initToken("Stellar", "XLM");
	Token{}.initToken("SushiSwap", "SUSHI");
	Token{}.initToken("Synthetix", "SNX");
	Token{}.initToken("Terra", "LUNA");
	Token{}.initToken("Tezos", "XTZ");
	Token{}.initToken("The Graph", "GRT");
	Token{}.initToken("THETA", "THETA");
	Token{}.initToken("Tron", "TRX");
	Token{}.initToken("Uniswap", "UNI");
	Token{}.initToken("USD Coin", "USDC");
	Token{}.initToken("VeChain", "VET");
	Token{}.initToken("yearn.finance", "YFI");
	Token{}.initToken("Zcash", "ZEC");
	
	// Add dummy portfolio's to both users
	var adminPortfolio := Portfolio{name := "My Wallet", user := findUser("admin"), cost := 1200.0};
	adminPortfolio.addAsset(Asset{token := getToken("BTC"), balance := 0.33, order := 0});
	adminPortfolio.addAsset(Asset{token := getToken("ETH"), balance := 2.5, order := 1});
	adminPortfolio.addAsset(Asset{token := getToken("XRP"), balance := 10000.0, order := 2});
	adminPortfolio.save();
	
	var userPortfolio := Portfolio{name := "Binance", user := findUser("wpl"), cost := 375.0};
	userPortfolio.addAsset(Asset{token := getToken("DOGE"), balance := 10000.0, order := 0});
	userPortfolio.addAsset(Asset{token := getToken("ADA"), balance := 100.0, order := 1});
	userPortfolio.addAsset(Asset{token := getToken("EOS"), balance := 12.0, order := 2});
	userPortfolio.addAsset(Asset{token := getToken("XRP"), balance := 1200.0, order := 3});
	userPortfolio.save();
	
}

section pages

imports pages/root				// public / authenticated
imports pages/auth				// public
imports pages/account 			// authenticated

imports pages/portfolio			// authenticated
imports pages/asset				// authenticated
imports pages/watchlist			// authenticated
imports pages/token				// admin