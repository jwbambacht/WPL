module errorPages

// Access denied page
override page accessDenied {
	main()
	
	define body() {
		pageTitle[class="text-center fs-100pt"] {
			"401"
  		}
  	
  		pageSubTitle[class="text-center"] {
  			"Unauthorized to view the page"
	  		br
  			br
  			navigate(root())[class="text-muted"] {
  				"Return the the Dashboard"
  			}
  		}
  	}
}

// Page not found page 
define ignore-access-control override page pagenotfound() {
	main()
	
	define body() {
		pageTitle[class="text-center fs-100pt"] {
			"404"
  		}
  	
  		pageSubTitle[class="text-center"] {
  			"The page you are looking for was not found"
	  		br
  			br
  			navigate(root())[class="text-muted"] {
  				"Return the the Dashboard"
  			}
  		}
  	}
}