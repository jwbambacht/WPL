application CryptFolio

description {
	A portfolio manager for crypto currencies
}

section imports

imports helper
imports templates
imports entities

// imports services

section application init.

init {
	// ADMIN credentials: 	username: admin, password: Administrator123, email is a dummy
	User{}.initAdmin();
	
	// USER credentials: 	username: wpl, password: Wpl2021pw, email is a dummy								
	User{username := "wpl", password := ("Wpl2021pw" as Secret).digest(), email := "dummy@dummy.com", activated := true}.save();
	
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
}

section pages

imports pages/root				// public
imports pages/auth				// public
imports pages/account 			// authenticated

imports pages/portfolio			// authenticated
imports pages/asset				// authenticated
imports pages/watchlist			// authenticated
imports pages/token				// admin

override page accessDenied {
	init {
		return root();
	}
}

define ignore-access-control override page pagenotfound() {
	main()
	
	define body() {
		pageTitle[class="text-center fs-100pt"] {
			"404"
  		}
  	
  		pageSubTitle[class="text-center"] {
  			"The page you are looking for was not found."
	  		br
  			br
  			navigate(root())[class="text-muted"] {
  				"Return the the Dashboard"
  			}
  		}
  	}
}