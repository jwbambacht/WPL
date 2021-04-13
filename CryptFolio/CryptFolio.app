application CryptFolio

description {
	A portfolio tracker for crypto currencies
}


section imports

imports helper				// helper functions
imports templates			// html templates
imports entities			// entities and properties

imports services			// api external frontend
imports serviceFunctions	// api helper functions

imports errorPages			// error pages content


section application init

// The following users, tokens, portfolios are inserted in the database on the first launch of the application
init {
	// ADMIN credentials:
	// username: admin, password: Administrator123, email is a dummy
	User{
		username := "admin", 
		password := ("Administrator123" as Secret).digest(), 
		email := "dummy@dummy.com",
		admin := true, 
		activated := true
	}.save();
	
	// USER credentials:
	// username: wpluser, password: Wpl2021pw, email is a dummy								
	User{
		username := "wpluser", 
		password := ("Wpl2021pw" as Secret).digest(), 
		email := "dummy@dummy.com", 
		activated := true
	}.save();
	
	// Some high listed tokens are added to the system
	Token{}.addToken("Aave", "AAVE");
	Token{}.addToken("Algorand", "ALGO");
	Token{}.addToken("Avalanche", "AVAX");
	Token{}.addToken("Binance Coin", "BNB");
	Token{}.addToken("Bitcoin", "BTC");
	Token{}.addToken("Bitcoin Cash", "BCH");
	Token{}.addToken("Cardano", "ADA");
	Token{}.addToken("Chainlink", "LINK");
	Token{}.addToken("Compound", "COMP");
	Token{}.addToken("Cosmos", "ATOM");
	Token{}.addToken("Dai", "DAI");
	Token{}.addToken("Dash", "DASH");
	Token{}.addToken("Decred", "DCR");
	Token{}.addToken("Dogecoin", "DOGE");
	Token{}.addToken("Elrond", "EGLD");
	Token{}.addToken("EOS", "EOS");
	Token{}.addToken("Ethereum", "ETH");
	Token{}.addToken("Filecoin", "FIL");
	Token{}.addToken("FTX Token", "FTT");
	Token{}.addToken("Holo", "HOT");
	Token{}.addToken("Icon", "ICX");
	Token{}.addToken("Kusama", "KSM");
	Token{}.addToken("Litecoin", "LTC");
	Token{}.addToken("Maker", "MKR");
	Token{}.addToken("Monero", "XMR");
	Token{}.addToken("NEM", "XEM");
	Token{}.addToken("Neo", "NEO");
	Token{}.addToken("PancakeSwap", "CAKE");
	Token{}.addToken("Polkadot", "DOT");
	Token{}.addToken("Ripple", "XRP");
	Token{}.addToken("Solana", "SOL");
	Token{}.addToken("Stellar", "XLM");
	Token{}.addToken("SushiSwap", "SUSHI");
	Token{}.addToken("Synthetix", "SNX");
	Token{}.addToken("Terra", "LUNA");
	Token{}.addToken("Tezos", "XTZ");
	Token{}.addToken("The Graph", "GRT");
	Token{}.addToken("THETA", "THETA");
	Token{}.addToken("Tron", "TRX");
	Token{}.addToken("Uniswap", "UNI");
	Token{}.addToken("USD Coin", "USDC");
	Token{}.addToken("VeChain", "VET");
	Token{}.addToken("yearn.finance", "YFI");
	Token{}.addToken("Zcash", "ZEC");
	
	// Add dummy portfolio's to both users
	var adminPortfolio := Portfolio{name := "My Wallet", user := findUser("admin"), cost := 1200.0};
	adminPortfolio.addAsset(Asset{token := getToken("BTC"), balance := 0.33, order := 0});
	adminPortfolio.addAsset(Asset{token := getToken("ETH"), balance := 2.5, order := 1});
	adminPortfolio.addAsset(Asset{token := getToken("XRP"), balance := 10000.0, order := 2});
	adminPortfolio.save();
	
	var userPortfolio := Portfolio{name := "Binance", user := findUser("wpluser"), cost := 375.0};
	userPortfolio.addAsset(Asset{token := getToken("DOGE"), balance := 10000.0, order := 0});
	userPortfolio.addAsset(Asset{token := getToken("ADA"), balance := 100.0, order := 1});
	userPortfolio.addAsset(Asset{token := getToken("EOS"), balance := 12.0, order := 2});
	userPortfolio.addAsset(Asset{token := getToken("XRP"), balance := 1200.0, order := 3});
	userPortfolio.save();
	
}


section pages

imports pages/root				// public & authenticated
imports pages/auth				// not authenticated
imports pages/account 			// authenticated

imports pages/portfolios		// authenticated
imports pages/portfolio			// authenticated
imports pages/asset				// authenticated
imports pages/watchlist			// authenticated
imports pages/token				// authenticated & administrator