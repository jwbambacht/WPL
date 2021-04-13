module templates

imports sections

// Basic template of a page
override template main() {
	title { 
		"CryptFolio - The Cryptocurrency Portfolio Tracker" 
	}
	
	metadata
	
	headerSection {
		navbar
	}
	
	mainSection {
		body
	}
	
	footerSection {
		dcontainer [class="text-center"] {
			rawoutput("&copy;") " 2021 CryptFolio. Built for Web Programming Languages using "
			navigate(url("https://www.webdsl.org"))[class="link-dark", target="_blank"] {
				"WebDSL"
			}
		}
	}
	
	footerScrips()
}

// Navbar template
template navbar() {
		
	nav {
		dcontainer {
    		
    		navigate(root())[class="navbar-brand px-2 d-none d-md-block"] {
    			image("/images/cryptfolio.svg")[width="auto", height="27px"]
    		}
    		
    		navigate(root())[class="navbar-brand px-2 d-md-none"] {
    			image("/images/cryptfolio_long.svg")[width="auto", height="27px"]
    		}
    		
    		div[class="navbar-toggler collapsed", data-bs-toggle="collapse", data-bs-target="#navbarCollapse", data-target="#navbarCollapse", aria-controls="navbarCollapse", aria-expanded="false", aria-label="Toggle navigation"]  {
   				span[class="navbar-toggler-icon"]
   			}
    		
    		div[class="collapse navbar-collapse", id="navbarCollapse"] {
    			list[class="navbar-nav me-auto mb-2 mb-lg-0"] {
    				listitem[class="nav-item"] {
    					navigate(root())[class = "nav-link", data-page="root"] {
      						"Dashboard"
      					}
      				}
      				if(loggedIn()) {
    					listitem[class="nav-item"] {
    						navigate(portfolios())[class = "nav-link", data-page="portfolios"] {
      							"Portfolios"
      						}
      					}
      				}
					listitem[class="nav-item"] {
						navigate(watchlist())[class = "nav-link", data-page="watchlist"] {
  							"Watchlist"
  						}
  					}
      				
      				if(isAdmin()) {
      					listitem[class="nav-item"] {
      						navigate(tokens())[class = "nav-link", data-page="tokens"] {
        						"Tokens"
        					}
        				}
        			}
        			
    			}
    			
    			list[class="navbar-nav me-0 mb-2 mb-lg-0 pull-right"] {
    				if(loggedIn()) {
    					listitem[class="nav-item"] {
    						navigate(account())[class = "nav-link", data-page="account"] {
      							"Account"
      						}
      					}
        				listitem[class="nav-item"] {
      						submitlink logoutAction()[class = "nav-link", data-page="logout"] {
        						"Logout"
        					}
        				}
        			}
        			
        			if(!loggedIn()) {
        				listitem[class="nav-item"] {
    						navigate(login())[class = "nav-link", data-page="login"] {
      							"Login"
      						}
      					}
        				listitem[class="nav-item"] {
      						navigate(register(""))[class = "nav-link", data-page="register"] {
      							"Register"
      						}
        				}
        			}
    			}
    			
     		}
    	}
	}
	
	action logoutAction() {
		logout();
		
		return root();
	}
}


// Page parts
template nav {
	<nav class="navbar navbar-dark bg-dark navbar-expand-md">
		elements
	</nav>
}

define pageTitle {
	h1[class="text-white mt-4", all attributes] {
		elements
	}
}

define pageSubTitle {
	div[class="text-muted mb-2", all attributes] {
		elements
	}
}

// UI Elements
template badge {
	span[class="badge", all attributes] {
		elements
	}
}

template badge_interval(selected: Bool, interval: String, datapage: String) {
	if(selected == true) {
		badge[class="col btn btn-sm btn-dark me-2 mb-1 change-chart-interval text-white selected-interval", data-interval=interval, data-page=datapage, all attributes] {
			"~interval"
		}
	}else{
		badge[class="col btn btn-sm btn-dark me-2 mb-1 change-chart-interval text-muted", data-interval=interval, data-page=datapage, all attributes] {
			"~interval"
		}
	}
}

template icon(name: String) {
	<i class="bi "+name all attributes></i>
}

// Cards
template card {
	card("bg-lighter")[all attributes] {
		elements
	}
}

template card(bg: String) {
	div[class="card ~bg rounded-3 text-white p-0", all attributes] {
		elements
	}
}

template card_header {
	card_header("bg-lighter")[all attributes] {
		elements
	}
}

template card_header(bg: String) {
	div[class="card-header ~bg", all attributes] {
		elements
	}
}

template card_body {
	card_body("bg-lighter")[all attributes] {
		elements
	}
}

template card_body(bg: String) {
	div[class="card-body ~bg", all attributes] {
		elements	
	}
}

template figure {
	<figure all attributes>
		elements
	</figure>
}

// Form elements
template form_row {
	row[all attributes, class="align-items-center mb-2"] {
		elements
	}
}

template form_label(text: String) {
	label(text)[class="col-form-label text-white fst-italic fw-bold", all attributes]
}

template form_col_label(text: String) {
	form_col_label(text, "col-12 col-md-4")[all attributes]
}

template form_col_label(text: String, col_width: String) {
	col("~col_width") {
		form_label(text)[all attributes]
	}

}
template form_col_input {
	form_col_input("col-12 col-md-8")[all attributes] {
		elements
	}
}

template form_col_input(col_width: String) {
	col("~col_width")[all attributes] {
		elements
	}
}

template form_row_validation {
	form_row {
		form_col_input("col-12 col-md-8 offset-md-4") {
			elements
		}
	}
}

template form_row_validation(col_width: String) {
	form_row {
		form_col_input("col-12") {
			elements
		}
	}
}


// Grid elements
template dcontainer {
	div [class="container", all attributes] {
		elements
	}
}

override template row {
	div[all attributes, class="row"] {
		elements
	}
}

template col(size: String) {
	div[class=size, all attributes] {
		elements
	}
}

// Error Display
override template errorTemplateInput( messages: [String] ){
	elements
	for(ve in messages){
		div[class="form-text text-danger fs-7 fst-italic"]{
			text(ve)
		}
	}
}

override template errorTemplateForm( messages: [String] ){
	elements
	for(ve in messages){
		div[class="form-text text-danger fs-7 fst-italic"]{
			text(ve)
		}
	}
}

override template errorTemplateAction( messages: [String] ){
	for(ve in messages){
		div[class="form-text text-danger fs-7 fst-italic"]{
			text(ve)
		}
	}
	elements
}

override template templateSuccess( messages: [String] ){
	for(ve in messages){
		div[class="form-text text-success fs-7 fst-italic"]{
			text(ve)
		}
	}
}

// List-item of existing asset
template listitem_asset(asset: Asset) {
	placeholder ph {
		listitem[class="list-group-item bg-darkest border-darkest rounded-3 text-white mb-1 pe-0 ps-2"] {
			div[class="d-flex align-items-center lh-1-25"] {
				span[class="p-0", onclick := action { 
					asset.active := ! asset.active; 
					replace(ph);
				}] {
					if(asset.active == true) {
						span[class="btn btn-sm btn-success px-1 py-0 me-2"] {
							icon("bi-check")
						}	
					}else{
						span[class="btn btn-sm btn-danger px-1 py-0 me-2"] {
							icon("bi-x")
						}
					}
				}
									
				span[class="me-auto fs-7"] {
					"~asset.token.name"	
				}
			
				span[class="input-group w-100px"] {
					input(asset.balance)[class="form-control form-control-sm bg-darker border-0 text-white fs-8", onchange := action {
						asset.save();
						replace(ph);
					}]
					div[class="input-group-text bg-darker border-0 text-white fs-10 px-2"] {
						"~asset.token.symbol"
					}
				}
				
				submit action {
					asset.portfolio := null;
					asset.delete();
				}[class="btn btn-sm btn-danger border-0 ms-2 me-1 fs-7"] {
					icon("bi-trash-fill")
				}
									
				span[class="text-white ms-0 me-2"] {
					icon("bi-three-dots-vertical")
				}
			
				input(asset.order)[class="hidden-input",type="hidden", data-symbol=asset.token.symbol, onchange := action {
					asset.save();
					replace(ph);
				}]
			}
		}
		
		div[class="text-center"] {
			validate((asset.balance) >= 0.0, "Balance should be bigger or equal to 0")
		}
	}
}

// List-item of new asset
template listitem_asset_new(p: Portfolio) {
	
	var asset := Asset{}
	
	var usedTokens := [a.token | a in p.assets]
	var tokens := (from Token as token order by name asc)

	if(usedTokens.length < (from Token).length) {
		
		listitem[class="list-group-item bg-darkest border-darkest rounded-3 text-white mb-1 d-flex align-items-center pe-0 ps-2"] {
			
			if(usedTokens.length > 0) {
				input(asset.token, (from Token as token where token not in ~usedTokens order by name asc))[class="form-select form-select-sm select-asset-new bg-darker border-0 text-white me-auto fs-7", not null]
			}else{
				input(asset.token, tokens)[class="form-select form-select-sm select-asset-new bg-darker border-0 text-white me-auto fs-7", not null]	
			}
								
			span[class="input-group w-100px", id=p.id] {
				input(asset.balance)[class="form-control form-control-sm bg-darker border-0 text-white fs-8"]
			}
				
			submit action {
				asset.portfolio := p;
				asset.order := p.assets.length-1;
				p.save();
			}[class="btn btn-sm btn-success border-0 text-white ms-2 me-2 w-48px fs-7"] { 
				"Add" 
			}
		}
		
		validate((asset.balance) >= 0.0, "Balance should be bigger or equal to 0")
		validate((asset.token) != null, "")
	}else{
		listitem[class="list-group-item bg-darkest border-darkest rounded-3 text-white mb-1 d-flex align-items-center pe-0 ps-2"] {
			"All tokens already included in your portfolio"
		}
	}
}

// Block on root page that links to create a first portfolio
template portfolio_block_new() {
	col("col-12 col-md-6") {
		navigate(portfolios())[class="text-white"] {
			card[class="border-lighter p-0"] {
				card_body[class="p-0 align-middle pt-5 pb-5 text-center"] {
					div[class="fs-1 text-white"] {
						icon("bi-plus-square")
					}
					br
					"Click to add your first portfolio!"
				}
			}
		}
	}
}

// Block on root page that views information of a portfolio
template portfolio_block(p: Portfolio) {
	col("col-12 col-md-6 mb-4") {
		card[class="border-lighter portfolio", portfolio-id="~p.id"] {
			card_header[class="d-flex justify-content-between fs-3"] {
				span[class="fw-bold"] {
					"~p.name"
				}
				div[class="d-flex align-items-center"] {
					span[class="portfolio-value"] {
						"$~nDecimals(p.value,2, true)"
					}
					badge[class="portfolio-change-percentage fs-8 ms-3 ~bgColor(p.changePercentage)"] {
						icon("~arrowIcon(p.changePercentage)")
						"~nDecimals(absolute(p.changePercentage),2, true)%"	
					}
				}
			}
			card_body[class="p-0"] {
				list[class="list-group list-group-flush bg-lighter portfolio-list"] {
					for(asset : Asset in p.assets where asset.active == true && asset.portfolio.user == currentUser() order by asset.order asc limit 3) {
						listitem[class="list-group-item bg-lighter text-white portfolio-row", data-symbol=asset.token.symbol, data-balance=asset.balance, data-price=""] {
							row {
								col("col-12 d-flex justify-content-between") {
									span {
										output(asset.name)
									}
									span {
										badge[class="asset-price bg-success me-1"] {
											"$~nDecimals(asset.token.data.price,2, true)"
										}
										badge[class="asset-balance bg-info me-1"] {
											"~nDecimals(asset.balance,2, true) ~asset.token.symbol"
										}
										navigate(asset(asset))[class="badge bg-light text-dark"] {
											icon("bi-eye")
										}
									}
								}
							}
						}
					}
					
					listitem[class="list-group-item bg-lighter d-flex justify-content-between text-muted fs-7"] {
						navigate(portfolio("edit",p))[class="me-auto text-muted"] {
							icon("bi-pencil-fill")[class="me-2"] 
							"Edit"
						}
						span[class="me-auto"] {
							output([ x | x in p.assets where x.active == true && x.portfolio.user == currentUser()].length) 
							" assets in total"
						}
						navigate(portfolio("view",p))[class="text-muted"] { 
							"Open"
							icon("bi-arrow-right")[class="ms-2"]
						}
					}
				}
			}
		}
	}	
}

// Card block on homepage that shows information on this application
template landingPageBlock() {
	col("col-12 col-md-4 d-flex align-items-stretch mb-2") {
		card[class="border-0 w-100"] {
			card_body[class="p-3 fs-2 text-center"] {
				elements
			}
		}
	}
}

// Activation email template (very basic)
template activateAccountEmail(user: User, baseURL: String) {
	var url := baseURL + "activateAccount/~user.authToken"
	
	row {
		col("col-12") {
			h1 {
				"Please activate your CryptFolio account"
			}
			
			"You can activate your account by clicking " 
			
			navigate(url(url)) {
				"here"
			}
			
			" or by browsing to " 
			br 
			br
			output(url)
		}
	}
}