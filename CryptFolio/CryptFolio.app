application CryptFolio

description {
	A portfolio manager for crypto currencies
}

section imports

imports helper
imports templates
imports entities

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