module pages/root

page root(){ 
	
	init {
		fetchData();
	}
	
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
					for(p : Portfolio in myPortfolios()) {
						portfolio_block(p)
					}
				}
			}
		}else{
			row[class="mt-4 mb-2"] {
				col("col-12 col-md-4 d-flex align-items-stretch mb-2") {
					card[class="p-0 border-0 w-100"] {
						card_body[class="rounded-3 p-3 fs-2 text-center"] {
							icon("bi bi-archive")[class="fs-50pt"]
							br
							"Easily track and manage your crypto portfolio(s)"
						}
					}
				}
				
				col("col-12 col-md-4 d-flex align-items-stretch mb-2") {
					card[class="p-0 border-0 w-100"] {
						card_body[class="rounded-3 p-3 fs-2 text-center"] {
							icon("bi bi-archive")[class="fs-50pt"]
							br
							"Get insights in the market data of your assets"
						}
					}
				}
				
				col("col-12 col-md-4 d-flex align-items-stretch mb-2") {
					card[class="p-0 border-0 w-100"] {
						card_body[class="rounded-3 p-3 fs-2 text-center"] {
							icon("bi bi-archive")[class="fs-50pt"]
							br
							"Don't wait any longer and start tracking!"
							row[class="mt-4"] {
								div[class="d-flex align-items-center"] {
									navigate(login())[class="btn btn-dark p-2 me-1 w-100"] {
										"Login"
									}
									
									navigate(register())[class="btn btn-dark p-2 ms-1 w-100"] {
										"Register"
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

// native class nativejava.BinanceAPI as BinanceAPI {
//   static read(String):String
// }

// native class request.Request as Request {
// 	constructor()
// 	
// 	static doGet(String) : String
// }

// native class nativejava.BinanceAPI as BinanceAPI {
// 	static doGet(String) : String
// }

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

// page loggedInPage {
// 	"you are logged in (page)"
// }
// 
// template loggedInTemplate {
// 	div{ "you are logged in (template)" }
// }
// 
// page accessControl {
// 	authentication
// 	if(loggedIn()) {
// 		"Logged in as ~securityContext.principal.username"
// 	}
// 	
// 	loggedInTemplate
// 	h3{ 
// 		"Register" 
// 	}
// 	var newuser := User{}
//   	
//   	form {
//     	input( newuser.username )
//     	input( newuser.password )
//     	
//     	input(newuser.email)
//     	
//     	submit action{
//     		newuser.password := newuser.password.digest();
//     		newuser.save();
//     	}{ "save" }
//   	}
//   	
//   	navigate loggedInPage() { 
//   		"go to logged in page" 
//   	}
// }
// 
// 
// section access control customization
// 
// override template authentication {
// 	if(loggedIn()) {
// 		logout()
// 	}else{
// 		login()
// 	}
// }
// 
// override template logout {
// 	if(securityContext.principal != null) {
// 		"Logged in as: " output(securityContext.principal.name)
// 	}
// 	
// 	form {
// 		submitlink signoffAction() {
// 			"Logout"
// 		}
// 	}
// 	action signoffAction() {
// 		logout();
// 	}
// }
// 
// override template login() {
// 	var username : String
// 	var password : Secret
// 	var stayLoggedIn := false
// 	
// 	form {
// 		<fieldset>
// 			<legend>
// 				output( "Login" )
// 			</legend>
// 			<table>
// 				<tr>
// 					labelcolumns("Username:"){ 
// 						input( username ) 
// 					}
// 				</tr>
// 				<tr>
// 					labelcolumns("Password:"){ 
// 						input( password ) 
// 					}
// 				</tr>
//       			<tr>
//       				labelcolumns("Stay logged in:"){ 
//       					input( stayLoggedIn ) 
//       				}
//       			</tr>
//     		</table>
//     
//     		submit signinAction() { "Login" }
//     	</fieldset>
//     }
//     
//     action signinAction {
//     	getSessionManager().stayLoggedIn := stayLoggedIn;
//     	
//     	validate( 
//     		authenticate( username, password ), 
//     		"The login credentials are not valid."
//     	);
//     	
//     	message( "You are now logged in." );
//     	
//     	return root();
//     }
// 	
// }