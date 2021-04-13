module pages/root

page root(){
	
	main()
	
	define body() {
		
		pageTitle {
			"Welcome to Cryptfolio, the portfolio tracker for cryptocurrencies!"
		}
		
		if(loggedIn()) {
			pageSubTitle {
				"An overview of your portfolio's is given below."
			}
		}
		 
		if(loggedIn()) {
			if(myPortfolios().length == 0) {
				row[class="mt-4 mb-2"] {
					portfolio_block_new()
				}
			}else{
				row[class="mt-4 mb-2"] {
					for(p : Portfolio in myPortfolios() order by p.value desc) {
						portfolio_block(p)
					}
				}
			}
		}else{
			row[class="mt-4 mb-2"] {
				landingPageBlock {
					icon("bi bi-archive")[class="fs-50pt"]
					br
					"Easily track and manage your crypto portfolio(s)"
				}
				
				landingPageBlock {
					icon("bi bi-lightbulb")[class="fs-50pt"]
					br
					"Get insights in the market data of your assets"
				}
				
				landingPageBlock {
					icon("bi bi-play-btn")[class="fs-50pt"]
					br
					"Don't wait any longer and start tracking!"
					row[class="mt-4"] {
						div[class="d-flex align-items-center"] {
							navigate(login())[class="btn btn-dark p-2 me-1 w-100"] {
								"Login"
							}
							
							navigate(register(""))[class="btn btn-dark p-2 ms-1 w-100"] {
								"Register"
							}
						}
					}
				}
			}
		}
	}
}