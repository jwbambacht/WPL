module pages/watchlist

page watchlist() {
	
	init {
		fetchData();
	}
	
	var tokens := (from Token as token order by token.name asc)
	
	main()
	
	define body() {
		
		pageTitle {
			"Watchlist"
		}	
		
		pageSubTitle {
			"The lists below includes statistics of all coins available on this platform. The list can be sorted by the biggest gainers, losers, and highest volume."
		}
		
		row[class="mt-4 mb-3"] {
			col("col-12") {
				card[class="border-0"] {
					card_header[class="fs-3 d-flex justify-content-between align-items-center"] {
						span[class="fw-bold me-auto"] {
							"Tokens"
						}
						span {
							badge[class="btn bg-secondary me-2 fs-7 filter-button", onclick := action {
								tokens := (from Token as token order by token.data.change desc);
								replace(ph_tokens);
							}] {
								span[class="d-none d-sm-block"] {
									"Top Gainers"	
								}
								icon("bi-hand-thumbs-up d-sm-none")
							}
							badge[class="btn bg-secondary me-2 fs-7 filter-button", onclick := action {
								tokens := (from Token as token order by token.data.change asc);
								replace(ph_tokens);
							}] {
								span[class="d-none d-sm-block"] {
									"Top Losers"	
								}
								icon("bi-hand-thumbs-down d-sm-none")
							}
							badge[class="btn bg-secondary fs-7 filter-button", onclick := action {
								tokens := (from Token as token order by token.data.volume desc);
								replace(ph_tokens);
							}] {
								span[class="d-none d-sm-block"] {
									"Volume"	
								}
								icon("bi-layers d-sm-none")
							}
						}
						
					}
					card_body[class="rounded-3 py-2"] {
						row[class="mb-1"] {
							col("col") {
								badge[class="text-start bg-darkest"] { "Token" }
							}
							col("col d-none d-lg-block") {
								badge[class="text-start bg-darkest"] { "Symbol" }
							}
							col("col") {
								badge[class="text-start bg-darkest"] { "Price" span[class="d-md-none"] { " / Change" } }
							}
							col("col d-none d-md-block") {
								badge[class="text-start bg-darkest"] { "Change" }
							}
							col("col d-none d-lg-block") {
								badge[class="text-start bg-darkest"] { "High " icon("bi-arrow-up-short")[class="text-white"] }
							}
							col("col d-none d-lg-block") {
								badge[class="text-start bg-darkest"] { "Low " icon("bi-arrow-down-short")[class="text-white"] }
							}
							col("col") {
								badge[class="text-start bg-darkest"] { "Volume" }
							}
						}
						
						placeholder ph_tokens {
							for(token : Token in tokens) {
								row[class="mb-1"] {
									col("col") {
										badge[class="d-flex align-items-center"] {
											span {
												if(token.favorite) {
													icon("bi-star-fill me-2 text-warning")
												}else{
													icon("bi-star me-2")
												}
											}
											span[class="d-none d-lg-block"] {
												"~token.name"	
											} 
											span[class="d-lg-none"] {
												"~token.symbol"	
											}
										}
									}
									col("col d-none d-lg-block") {
										badge {
											 "~token.symbol"
										}
									}
									col("col") {
										badge[class=""] {
											"$~nDecimals(token.data.price,2,true)"
										}
										badge[class="~bgColor(token.data.change) text-white d-md-none"] {
											icon("~arrowIcon(token.data.change)")
											"~nDecimals(absolute(token.data.change),2,true)%"
										}
									}
									col("col d-none d-md-block") {
										badge[class="~bgColor(token.data.change) text-white"] {
											icon("~arrowIcon(token.data.change)")
											"~nDecimals(absolute(token.data.change),2,true)%"
										}
									}
									col("col d-none d-lg-block") {
										badge[class="text-success"] {
											"$~nDecimals(token.data.high,2,true)"
										}
									}
									col("col d-none d-lg-block") {
										badge[class="text-danger"] {
											"$~nDecimals(token.data.low,2,true)"
										}
									}
									col("col") {
										badge[class=""] {
											"~nDecimals(token.data.volume,2,true)M"
										}
									}
								}
							}
						}
						
						row {
							col("col")[class="text-muted fs-8 fst-italic"] {
								icon("bi-star-fill ms-2 me-2 text-warning") " denotes that this token is included in at least one portfolio."
							}
						}
					}
				}
			}
		}
	}
}