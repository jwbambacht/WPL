module pages/auth

override page login {
	
	init {
		if(loggedIn()) {
			return root();
		}
	}
	
	var username : String
	var password : Secret
	var stayLoggedIn := false
	
	main()
	
	define body() {
		
		row[class="mt-4"] {
			col("col-12 col-md-6 offset-md-3") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						div[class="fw-bold"] {
							"Login"
						}
						div[class="fs-6 text-muted"] {
							"Please fill in your credentials below to login."
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("Username")
								form_col_input {
									input(username)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								validate((username) != "", "Please fill in your username")
							}
							
							form_row {
								form_col_label("Password")
								form_col_input {
									input(password)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								validate((password) != "", "Please fill in your password")
							}
							
							form_row {
								form_col_label("")
								form_col_input {
									input(stayLoggedIn)
									" Stay logged in"
								}
							}
							
							form_row {
								form_col_label("")
								form_col_input {
									navigate(register())[class="btn btn-sm btn-dark float-start"] {
										"Go to Register"
									}
									submit action {										
										getSessionManager().stayLoggedIn := stayLoggedIn;
										
										validate(authenticate(username, password),"The login credentials are not valid.");
										
										return root();
									}[class="btn btn-sm btn-success float-end"] {
										"Login"
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

page register {
	
	init {
		if(loggedIn()) {
			return root();
		}
	}
	
	var user := User{}
	
	main()
	
	define body() {
		
		row[class="mt-4"] {
			col("col-12 col-md-6 offset-md-3") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						div[class="fw-bold"] {
							"Register"
						}
						div[class="fs-6 text-muted"] {
							"Please fill in the details below to create your account."
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("Username")
								form_col_input {
									input(user.username)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								validate((user.username) != "", "Please fill in your username")
							}
							
							form_row {
								form_col_label("Password")
								form_col_input {
									input(user.password)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								// Validate password requirements: length, special characters, .etc
								validate((user.password) != "", "Please fill in a password")
							}
							
							form_row {
								form_col_label("Email")
								form_col_input {
									input(user.email)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								// Validate password requirements: length, special characters, .etc
								validate((user.email) != "", "Please fill in your email")
							}
							
							form_row {
								form_col_label("")
								form_col_input {
									navigate(login())[class="btn btn-sm btn-dark float-start"] {
										"Go to Login"
									}
									submit action {										
										// validate if username or email is not yet in used
										user.password := user.password.digest();
										user.save();
		
		    							return login();
									}[class="btn btn-sm btn-success float-end"] {
										"Register Account"
									}
								}
							}
						
						// form {
						// 	row[class="align-items-center mb-2"] {
						// 		col("col-12 col-md-3") {
						// 			label("Username")[class="col-form-label text-white fst-italic fw-bold"]
						// 		}
						// 		col("col-12 col-md-9") {
						// 			input(user.username)[class="form-control btn-dark w-100", not null] {
						// 				// Validate username usage
						// 				validate((user.username) != "", "Please fill in your username")
						// 			}	
						// 		}
						// 	}
							// row[class="align-items-center mb-2"] {
							// 	col("col-12 col-md-3") {
							// 		label("Password")[class="col-form-label text-white fst-italic fw-bold"]
							// 	}
							// 	col("col-12 col-md-9") {
							// 		input(user.password)[class="form-control btn-dark w-100", not null] {
							// 			// Validate password requirements: length, special characters, .etc
							// 			validate((user.password) != "", "Please fill in a password")
							// 		}	
							// 	}
							// }
							// row[class="align-items-center mb-2"] {
							// 	col("col-12 col-md-3") {
							// 		label("Email")[class="col-form-label text-white fst-italic fw-bold"]
							// 	}
							// 	col("col-12 col-md-9") {
							// 		input(user.email)[class="form-control btn-dark w-100", not null] {
							// 			validate((user.email) != "", "Please fill in your email")
							// 		}	
							// 	}
							// }
		// 					row[class="align-items-center"] {
		// 						col("col-12") {
		// 							row[class="align-items-center"] {
		// 								col("col-12 text-end") {
		// 									submit action {
		// 										// validate if username or email is not yet in used
		// 										user.password := user.password.digest();
		// 										user.save();
		// 
		//     									return root();
		// 									}[class="btn btn-sm btn-success"] { 
		// 										"Register" 
		// 									}
		// 								}
		// 							}
		// 						}
		// 					}
						}
					}
				}
			}
		}
	}
}