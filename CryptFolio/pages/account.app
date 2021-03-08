module pages/account

page account() {

	var oldEmail : String
	var newPassword : Secret
	var newPasswordRepeat : Secret
	var profileSuccess : String := ""
	var passwordSuccess : String := ""
	
	init {
		if(currentUser() != null) {
			// user := currentUser();
			oldEmail := currentUser().email;
		}
	}
	
	main()
	
	define body() {
		
		pageTitle {
			"Account"
		}
		
		pageSubTitle {
			"Edit your account details"
		}
		
		row[class="mt-4"] {
			col("col-12 col-md-6") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						span[class="fw-bold"] {
							"Profile"
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("Username")
								form_col_input {
									output(currentUser().username)
								}
							}
							
							form_row {
								form_col_label("First Name")
								form_col_input {
									input(currentUser().firstName)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("Last Name")
								form_col_input {
									input(currentUser().lastName)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("Email")
								form_col_input {
									input(currentUser().email)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("Account Type")
								form_col_input {
									if(isAdmin()) {
										"Administrator"
									}else{
										"User"
									}
								}
							}
							
							placeholder ph_profile {
								form_row_validation {
									validate((currentUser().email) != "", "Please fill in your email")
									templateSuccess([profileSuccess])
								}	
							}
							
							form_row {
								form_col_label("")
								form_col_input[class="text-end"] {
									div[class="btn btn-sm btn-success", onclick := action {										
										currentUser().save();
										
										profileSuccess := "Profile successfully changed";
										replace(ph_profile);
									}] {
										"Save"
									}
								}
							}
						}
					}
				}
			}	
			
			col("col-12 col-md-6") {
				card[class="border-0"] {
					card_header[class="fs-3"] {
						span[class="fw-bold"] {
							"Change Password"
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("New Password")
								form_col_input {
									input(newPassword)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row {
								form_col_label("Repeat Password")
								form_col_input {
									input(newPasswordRepeat)[class="form-control btn-dark w-100"]
								}
							}
							
							placeholder ph_password {
								form_row_validation {
									validate((newPassword != "" && newPasswordRepeat != ""), "Password cannot be empty")
									validate((newPassword == newPasswordRepeat), "The new passwords don't match")
									templateSuccess([passwordSuccess])
								}
							}
							
							form_row {
								form_col_label("")
								form_col_input[class="text-end"] {
									div[class="btn btn-sm btn-success", onclick := action {
										currentUser().password := newPassword;
										currentUser().password := currentUser().password.digest();
										currentUser().save();
										
										passwordSuccess := "Password successfully changed";
										replace(ph_password);	
									}] {
										"Save"
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