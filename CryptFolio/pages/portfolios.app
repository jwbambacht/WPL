module pages/portfolios

// Page that shows an overview of the users' portfolios
page portfolios() {
	
	var portfolio := Portfolio{}
	
	main()
	
	define body() {
			
		pageTitle {
			"Portfolio Overview"
		}
		
		pageSubTitle {
			"You have added the following portfolios."
		}
		
		row[class="mt-4"] {
			col("col-12 col-md-5 col-lg-4 mb-3") {
				if(myPortfolios().length > 0) {
					card[class="border-0"] {
						card_body[class="p-3 rounded-3"] {
							badge[class="bg-darker w-100 py-2 mb-3 lh-1-25"] {
								span[class="fs-4 text-secondary"] {
									"Total Value"
								}
								div[class="portfolios-value fs-2 text-white"] {
									"$~nDecimals(currentUser().value,2, true)"
								}
							}
							
							badge[class="d-flex align-items-center fs-7 fw-bold"] {
								span[class="me-auto"] {
									"Total Cost:"
								}
								span {
									"$~nDecimals(currentUser().cost,2, true)"
								}
							}
							
							badge[class="d-flex align-items-center fs-7 fw-bold"] {
								span[class="me-auto"] {
									"Total Profit:"
								}
								span {
									"$~nDecimals(currentUser().value-currentUser().cost,2, true)"
								}
							}
						}
					}
				}
					
				form {
					card[class="border-lighter mt-3"] {
						card_header[class="fs-3 fw-bold"] {
							"Create Portfolio"
						}
						card_body {
							row[class="align-items-center mb-2"] {
								col("col-12 col-lg-3") {
									label("Name")[class="col-form-label fst-italic fw-bold"]
								}
								col("col-12 col-lg-9") {
									input(portfolio.name)[class="form-control btn-dark w-100"] {
										validate((portfolio.name) != "", "Please fill in a portfolio name")
										validate([x | x in (from Portfolio) where x.user == currentUser() && x.name == portfolio.name].length == 0, "A portfolio with the same name already exists")
									}	
								}
							}
							row[class="align-items-center"] {
								col("col-12") {
									row[class="align-items-center"] {
										col("col-12 text-end") {
											submit action {
												portfolio.user := currentUser();
												portfolio.save();
												
												return portfolio("edit", portfolio);
											}[class="btn btn-sm btn-success"] {
												"Continue " icon("bi-arrow-right")
											}							 
										}
									}
								}
							}
						}
					}
				}	
			}
			
			if(myPortfolios().length > 0) {	
				col("col-12 col-md-7 col-lg-8") {
					for(p : Portfolio in myPortfolios()) {
						col("col-12")[class="mb-3"] {
							card[class="border-0"] {
								row[class="portfolio"] {
									col("col")[class="mt-auto mb-auto ps-3 py-3 pe-0"] {
										row[class="ps-3 align-items-center py-2"] {
											col("col-12") {
												div[class="fs-4 d-flex"] {
													span[class="fw-bold me-auto d-flex align-items-center"] {
														"~p.name" 
														badge[class="portfolio-change-percentage ms-2 fs-8 ~bgColor(p.changePercentage)"] {
															icon("~arrowIcon(p.changePercentage)")
															"~nDecimals(absolute(p.changePercentage),2, true)%"	
														}
													}	
													div[class="portfolio-value"] {
														"$~nDecimals(p.value,2, true)"
													}
												}
											}
											col("col-12") {
												if(p.assets.length > 0) {
													for(asset : Asset in p.assets) {
														badge[class="bg-darker portfolio-row me-2"] {
															"~asset.token.symbol"
														}
													}
												}else{
													"No assets in portfolio."
												}
											}
										}
									}
									navigate(portfolio("view",p))[class="w-auto ps-2"] {
										div[class="portfolio-asset-view h-100 d-flex align-items-center text-white fs-2 rounded-0 rounded-end"] {
											icon("bi-chevron-right")
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