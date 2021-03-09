module pages/asset

page asset(asset: Asset) {
	
	init {
		if(asset == null) {
			return portfolios();	
		}
		
		if(asset.portfolio.user != currentUser()) {
			return portfolios();
		}
		
		fetchData();
	}
	
	var intervals := ["1m","3m","5m","15m","30m","1h","2h","4h","8h","12h","1d","3d","1w","1M"]
	var interval_selected := 7
	
	main()
	
	define body() {
		
		pageTitle {
			span[class="fw-bold fs-1 me-2"] {
				"Asset: "
			}
			span[class="fs-3"] {
				"~asset.name"	
			}
		}
		
		row {
			col("col-12 col-lg-4 col-xl-3 mb-3") {
				card[class="border-0"] {
					card_body[class="p-3 rounded-3"] {
						row {
							col("col-12 col-md-6 col-lg-12 mb-3") {
								badge[class="bg-darker w-100 py-2 mb-1 lh-1-25"] {
									span[class="fs-4 text-muted"] {
										"Total Asset Value"
									}
									div[class="asset-value fs-2 text-white"] {
										placeholder ph_asset_value {
											"$~nDecimals(asset.value,2, true)"	
										}
									}
								}

								badge[class="bg-dark d-flex justify-content-between align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"Balance:"
									}
									form {
										span[class="input-group w-125px"] {
											input(asset.balance)[class="form-control form-control-sm bg-darker border-0 text-white fs-8", onchange := action {
												asset.save();
												replace(ph_asset_value);
											}]
											div[class="input-group-text bg-darker border-0 text-white fs-10 px-2"] {
												"~asset.token.symbol"
											}
										}
									}
								}
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-3"] {
									span[class="me-auto"] {
										"Portfolio:"
									}
									span[class="d-flex align-items-center"] {
										"~asset.portfolio.name "
										navigate(portfolio("view",asset.portfolio))[class="badge bg-light text-dark ms-2"] {
											icon("bi-eye")
										}
									}
									
								}
								   
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"Price:"
									}
									span[class=""] {
										"$~nDecimals(asset.token.data.price,2,true)"
									}
									
								}
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"Price 24h:"
									}
									span {
										"$~nDecimals(asset.token.data.prevDay,2,true)"
									}
								}
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
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
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"High price:"
									}
									span[class="text-success"] {
										icon("bi-arrow-up-short")[class="text-white"]
										"$~nDecimals(asset.token.data.high,2,true)"
									}
								}
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"Low price:"
									}
									span[class="text-danger"] {
										icon("bi-arrow-down-short")[class="text-white"]
										"$~nDecimals(asset.token.data.low,2,true)"
									}
								}
								
								badge[class="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1"] {
									span[class="me-auto"] {
										"Volume:"
									}
									span {
										"$~nDecimals(asset.token.data.volume,2,true)"
									}
								}
							}
						
							col("col-12 col-md-6 col-lg-12") {
							
								badge[class="bg-darker w-100 px-2 py-2 mb-1 lh-1-25 text-center fs-4 text-muted"] {
									"Other portfolios:"
								}
							
								if((from Asset as a where a.portfolio.user = ~currentUser() and a.token = ~asset.token and a != ~asset).length == 0) {
									badge[class="text-muted text-center"] {
										"No other portfolios containing this token"
									}
								}else{
									for(a : Asset in myAssets() where a.token == asset.token && a != asset) {
										badge[class="bg-dark border-dark rounded-3 text-white d-flex align-items-center mb-1 py-2"] {
											span[class="me-auto"] {
												"~a.portfolio.name"
											}
											span {
												 badge[class="bg-secondary me-2"] {
												 	"~a.balance ~a.token.symbol"	
												 }
												 navigate(asset(a))[class="badge bg-light text-dark"] {
													icon("bi-eye")
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
			
			col("col-12 col-lg-8 col-xl-9 mb-3") {
				card[class="border-0"] {
					card_body[class="p-3 rounded-3"] {
						
						badge[class="bg-darker w-100 py-2 lh-1-25 fs-4 text-secondary"] {
							"Price/Volume Chart"
						}
						
						div[id="asset-chart", data-symbol=asset.token.symbol] {
							figure[class="highcharts-figure mb-0"] {
								div[class="w-100 chart-spinner-container"]	{
									div[class="spinner-grow text-light", role="status"] {
										span[class="visually-hidden"] {
											"Loading..."
										}
									}
								}
		
								div[id="asset-chart-container", class="w-100 h-400px"]
							}
							col("col-12 mt-2") {
								row[class="mx-1 text-center fs-9"] {
									for(index: Int from 0 to intervals.length) {
										badge_interval(index==interval_selected, intervals.get(index), "asset")
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