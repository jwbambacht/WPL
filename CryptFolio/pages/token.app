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
			"Manage Tokens"
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
										"Add Token"	
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
					card_body[class="p-3"] {
						form {
							list[class="p-0 m-0"] {
								for(token : Token order by token.name asc) {
									listitem[class="list-group-item border-0 rounded-3 bg-darkest mb-1 py-2 px-2"] {
										span[class="d-flex align-items-center"] {
											div[class="input-group"] {
												input(token.name)[class="form-control form-control-sm bg-darker border-0 text-white me-1 fs-8"]
												input(token.symbol)[class="form-control form-control-sm bg-darker border-0 text-white me-1 fs-8"]
						
												submit action {
													for(asset : Asset) {
														if(asset.token.name == token.name) {
															asset.portfolio := null;
															asset.token := null;
															asset.delete();
														}
													}
													token.delete();
												}[class="btn btn-sm bg-danger text-white me-1 button fs-8"] {
													"Delete"
												}
												
												submit action {
													token.save();
												}[class="btn btn-sm bg-success text-white button fs-8"] {
													"Save"
												}
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