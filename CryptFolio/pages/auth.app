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
	
	var loginError : String
	
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
								form_col_input[class="d-flex justify-content-between align-items-center"] {
									div[class="form-check form-check-inline"] {
										input(stayLoggedIn)[class="form-check-input", id="stayLoggedInCheckbox"]
										label("Remember me")[class="form-check-label", for="stayLoggedInCheckbox"]	
									}
									navigate(forgotPassword())[class="fs-7 text-muted"] {
										"Forgot password?"
									}
								}
							}
							
							form_row_validation {
								placeholder ph_login_error {
									errorTemplateAction([loginError])
								}
							}
							
							form_row {
								form_col_label("")
								form_col_input {
									navigate(register())[class="btn btn-sm btn-dark float-start"] {
										"Go to Register"
									}
									div[class="btn btn-sm btn-success float-end", onclick := action {	
										if(findUser(username).activated) {
											if(authenticate(username, password)) {									
												getSessionManager().stayLoggedIn := stayLoggedIn;
										
												return root();
											}else{
												loginError := "The login credentials are not valid";
												replace(ph_login_error);
											}
										}else{
											loginError := "Please activate your account";
											replace(ph_login_error);	
										}
									}] {
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

page forgotPassword {
	
	init {
		if(loggedIn()) {
			return root();
		}
	}
	
	var email : Email
	var password : Secret
	var passwordRepeat : Secret
	var resetRequestSuccess : String
	var resetRequestError : String
	
	main()
	
	define body() {
		
		row[class="mt-4"] {
			col("col-12 col-md-6 offset-md-3") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						div[class="fw-bold"] {
							"Forgot Password"
						}
						div[class="fs-6 text-muted"] {
							"Please fill in your email and choose a new password."
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("Email")
								form_col_input {
									input(email)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("New Password")
								form_col_input {
									input(password)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("Repeat Password")
								form_col_input {
									input(passwordRepeat)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								placeholder ph_reset_feedback {
									validate((email) != "", "Please fill in your email")
									validate((password != "" && passwordRepeat != ""), "Password cannot be empty")
									validate((password == passwordRepeat), "The new passwords don't match")
									errorTemplateAction([resetRequestError])[class="mb-2"]
									templateSuccess([resetRequestSuccess])[class="mb-2"]
								}
							}
							
							form_row {
								form_col_label("")
								form_col_input {
									navigate(login())[class="btn btn-sm btn-dark float-start"] {
										"Back to Login page"
									}
									div[class="btn btn-sm btn-success float-end", onclick := action {	
										
										var users := findUserByEmail(email);
										
										if(users.length == 0) {
											resetRequestError := "Please supply a valid emailadress";
											resetRequestSuccess := "";
										}else{
											users[0].resetPassword(password);
											resetRequestError := "";
											resetRequestSuccess := "A confirmation mail has been sent to activate your account";
										}
										
										replace(ph_reset_feedback);
									}] {
										"Reset Password"
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

page activateAccount(token: String) {
	
	init {
		if(loggedIn()) {
			return root();
		}
	}
	
	var authToken : String
	// var confirmAccountSuccess : String
	var activateAccountError : String
	
	main()
	
	define body() {
		
		row[class="mt-4"] {
			col("col-12 col-md-6 offset-md-3") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						div[class="fw-bold"] {
							"activate Account"
						}
						div[class="fs-6 text-muted"] {
							"Please fill in your authentication token to activate your account."
						}
					}
					card_body[class="rounded-3 pb-2"] {
						if(token != "" && User{}.activateAccount(token)) {
							row {
								col("col-12 text-center") {
									h1 {
										"Success!"
									}
									"Your CryptFolio account has been activated successfully."
									br
									br
									navigate(login())[class="btn btn-success mb-3"] {
										"Go to Login page"
									}
								}
							}
						}else{
							form {
								form_row {
									form_col_label("AuthToken:")
									form_col_input {
										input(authToken)[class="form-control btn-dark w-100"]
									}
								}
								
								form_row_validation {
									placeholder ph_reset_feedback {
										validate((authToken) != "", "Please fill in a valid authToken")
										errorTemplateAction([activateAccountError])[class="mb-2"]
										// templateSuccess([confirmAccountSuccess])[class="mb-2"]
									}
								}
								
								form_row {
									form_col_label("")
									form_col_input {
										navigate(login())[class="btn btn-sm btn-dark float-start"] {
											"Back to Login page"
										}
										// submitlink action {
										// 	if((from User as user where user.authToken = ~authToken).length == 0) {
										// 		confirmAccountError := "The authToken is invalid.";
										// 		replace(ph_reset_feedback);
										// 	}else{
										// 		return activateAccount(authToken);	
										// 	}
										// }[class="btn btn-sm btn-success float-end"] {
										// 	"Activate Account"
										// }
										div[class="btn btn-sm btn-success float-end", onclick := action {	
											if((from User as user where user.authToken = ~authToken).length == 0) {
												activateAccountError := "The authToken is invalid.";
												replace(ph_reset_feedback);
											}else{
												return activateAccount(authToken);
											}
										}] {
											"Activate Account"
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
								validate((findUserByEmail(user.email).length) == 0, "Emailadress already in use")
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
										user.generateAuthToken();
										user.save();
		
		    							return login();
									}[class="btn btn-sm btn-success float-end"] {
										"Register Account"
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