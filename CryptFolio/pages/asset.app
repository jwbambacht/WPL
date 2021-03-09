module pages/asset

page asset(asset: Asset) {
	
	init {
		if(asset == null) {
			return portfolios();	
		}
		
		if(asset.portfolio.user != currentUser()) {
			return portfolios();
		}
	}
	
	main()
	
	define body() {
		
		pageTitle[class="d-flex align-items-center justify-content-between"] {
			div[class="me-auto"] {
				span[class="fw-bold fs-1 me-2"] {
					"Asset: "
				}
				span[class="fs-3"] {
					"~asset.name"	
				}
			}
			badge[class="bg-secondary"] {
				"Portfolio: ~asset.portfolio.name"
			}
		}
		
		pageSubTitle {
			"Your asset has the following characteristics"
		}
		
		row {
			col("col-12 col-md-3 mb-3") {
				card[class="border-0"] {
					card_body[class="p-3 rounded-3"] {
						badge[class="bg-darker w-100 py-2 mb-3 lh-1-25"] {
							span[class="fs-4 text-secondary"] {
								"Total Asset Value"
							}
							div[class="asset-value fs-2 text-white"] {
								"$~nDecimals(asset.value,2, true)"
							}
						}
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"Balance:"
							}
							span {
								"~nDecimals(asset.balance,2,true)"
								" ~asset.token.symbol"
							}
						}
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"Current Price:"
							}
							span[class=""] {
								"$~nDecimals(asset.token.data.price,2,true)"
							}
							
						}
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"Price 24h:"
							}
							span {
								"$~nDecimals(asset.token.data.prevDay,2,true)"
							}
						}
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"Change:"
							}
							badge[class="~bgColor(asset.value-asset.value24h) me-2"] {
								icon("~arrowIcon(asset.value-asset.value24h)")
								"$~nDecimals(asset.value-asset.value24h,2,true)"
							}
							badge[class="~bgColor(asset.token.data.change)"] {
								icon("~arrowIcon(asset.token.data.change)")
								"~nDecimals(asset.token.data.change,2,true)%"
							}
						}
						
						br
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"High price:"
							}
							span[class="text-success"] {
								"$~nDecimals(asset.token.data.high,2,true)"
								icon("bi-arrow-up-short")[class="text-white"]
							}
						}
						
						badge[class="d-flex align-items-center fs-7 text-white fw-bold"] {
							span[class="me-auto"] {
								"Low price:"
							}
							span[class="text-danger"] {
								"$~nDecimals(asset.token.data.low,2,true)"
								icon("bi-arrow-down-short")[class="text-white"]
							}
						}
					}
				}
			}
			
			col("col-12 col-md-6") {
				
			}
			
			col("col-12 col-md-3") {
				
			}
		}
		
	}
}