module pages/watchlist

// Page that gives a broad overview of all tokens and their data. Enables to sort and filter by top gainers, top losers, highest volume, and favorite tokens.
page watchlist() {
	
	var tokens := (from Token as token order by token.name asc)
	var filteredTokens := tokens
	
	main()
	
	define body() {
		
		pageTitle[class="d-flex justify-content-between align-items-center"] {
			"Watchlist"
			
		div {
        	span[class="d-none d-sm-block d-flex align-items-center"] {
        		badge[class="btn bg-lighter fs-7 py-2 ms-2 filter-button", onclick := action {
					filteredTokens := [ token | token in tokens where token.data.change > 0.0 order by token.data.change desc];
					replace(ph_tokens);
				}] {
					span[class="d-none d-sm-block"] {
						"Gainers"	
					}
					icon("bi-hand-thumbs-up d-sm-none")
				}
				badge[class="btn bg-lighter fs-7 py-2 ms-2 filter-button", onclick := action {
					filteredTokens := [ token | token in tokens where token.data.change < 0.0 order by token.data.change asc];
					replace(ph_tokens);
				}] {
					span[class="d-none d-sm-block"] {
						"Losers"	
					}
					icon("bi-hand-thumbs-down d-sm-none")
				}
				badge[class="btn bg-lighter fs-7 py-2 filter-button ms-2", onclick := action {
					filteredTokens := [ token | token in tokens order by token.data.volume desc];
					replace(ph_tokens);
				}] {
					span[class="d-none d-sm-block"] {
						"Volume"	
					}
					icon("bi-layers d-sm-none")
				}
				if(loggedIn()) {
					badge[class="btn bg-lighter text-warning fs-8 py-2 ms-2 filter-button", onclick := action {
						filteredTokens := [ token | token in tokens where token.favorite order by token.name asc];
						replace(ph_tokens);
					}] {
						icon("bi-star-fill")
					}
				}	
				badge[class="btn bg-lighter fs-8 py-2 ms-2 filter-button", onclick := action {
					filteredTokens := tokens;
					replace(ph_tokens);
				}] {
					icon("bi-arrow-clockwise")
				}	
        	}
		}	
		}
		
		pageSubTitle {
			"The list below includes statistics of all coins available on this platform. You can search for a coin or sort the list by the coin with the highest gain, loss, or volume."
		}
		
		row[class="mt-4 mb-3"] {
			col("col-12") {
				card[class="border-0"] {
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
							for(token : Token in filteredTokens) {
								row[class="mb-1"] {
									col("col") {
										badge[class="d-flex align-items-center"] {
											if(loggedIn()) {
												span {
													if(token.favorite) {
														icon("bi-star-fill me-2 text-warning")
													}else{
														icon("bi-star me-2")
													}
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