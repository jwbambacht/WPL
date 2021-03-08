module pages/token

page tokens {
	
	init {
		if(!isAdmin()) {
			return root();
		}
	}
	
	main()
	
	define body() { 
		
		var newToken := Token{}
		
		pageTitle {
			"Manage tokens"
		}
		
		pageSubTitle {
			"The following tokens will be available for all users."
		}
		
		row[class="mt-4"] {
			col("col-12 col-md-6 mb-4") {
				card[class="border-lighter"] {
					card_header[class="fs-3"] {
						span[class="fw-bold"] {
							"Add New Token"
						}
					}
					card_body[class="rounded-3 pb-2"] {
						form {
							form_row {
								form_col_label("Name")
								form_col_input {
									input(newToken.name)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								validate((newToken.name) != "", "Please fill in a token name")
							}
							
							form_row {
								form_col_label("Symbol")
								form_col_input {
									input(newToken.symbol)[class="form-control btn-dark w-100"]
								}
							}
							
							form_row_validation {
								validate((newToken.symbol) != "", "Please fill in a symbol")
							}
							
							form_row_validation {
								validate(([x | x in (from Token) where x.name == newToken.name].length == 0) && ([x | x in (from Token) where x.symbol == newToken.symbol].length == 0), "A token with the same name or symbol already exists")
							}
							
							form_row {
								form_col_label("")
								form_col_input[class="text-end"] {
									submit action {
										newToken.save();
									}[class="btn btn-sm btn-success"] {
										"Add"	
									}
								}
							}
						}
					}
				}
			}
			
			col("col-12 col-md-6 mb-4") {
				card[class="border-lighter"] {
					card_header[class="fs-3"] {
						span[class="fw-bold"] {
							"Existing Tokens"
						}
					}
					card_body[class="p-0 mb-1"] {
						form {
							list[class="ps-0 mb-0 pt-2 pb-1"] {
								for(token : Token order by token.name asc) {
									listitem[class="list-group-item bg-lighter border-lighter mb-0 py-1"] {
										div[class="input-group"] {
											input(token.name)[class="form-control form-control-sm bg-darkest border-darkest text-white me-1"]
											input(token.symbol)[class="form-control form-control-sm bg-darkest border-darkest text-white me-1"]
					
											submit action {
												for(asset : Asset) {
													if(asset.token.name == token.name) {
														asset.portfolio := null;
														asset.token := null;
														asset.delete();
													}
												}
												token.delete();
											}[class="btn btn-sm bg-danger text-white p-1 me-1"] {
												icon("bi-trash-fill")
											}
											
											submit action {
												token.save();
											}[class="btn btn-sm bg-success text-white p-1"] {
												icon("bi-check")
											}
										}
										validate((token.name != ""), "Please give a name to the token")
										validate((token.symbol != ""), "Please give the symbol for the token")
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