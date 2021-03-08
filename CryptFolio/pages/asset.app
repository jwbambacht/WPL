module pages/asset

// template createNewAsset {
// 	var asset := Asset{}
// 	form {
// 		block {
// 			label("Currency")
// 			input(t.name)[class="form-control"]
// 		}
// 		input(t.symbol)
// 		submit action {
// 			t.save();
// 		}{ "Create new Token" }
// 	}
// }

// page viewAsset(asset: Asset) {
// 	main()
// 	define body() {
// 		output(asset.id)
// 	}
// }
// 
// override page createAsset(p : Portfolio) {
// 	
// 	main()
// 	
// 	define body() {
// 	
// 		pageTitle {
// 			"Create a new asset for ~p.name"
// 		}
// 	
// 		pageSubTitle {
// 			"Select a token that is not yet added to your portfolio and fill in its balance."
// 		}
// 		
// 		var asset := Asset{}
// 		
// 		form[class="mt-4"] {
// 			row[class="align-items-center mb-2"] {
// 				col("col-12 col-lg-2") {
// 					label("Currency")[class="col-form-label text-white fst-italic fw-bold"]
// 				}
// 				col("col-12 col-lg-4") {
// 					input(asset.token)[class="form-select btn-dark"]	
// 				}
// 			}
// 			row[class="mb-2"] {
// 				col("col-12 col-lg-2") {
// 					label("Balance")[class="col-form-label text-white fst-italic fw-bold"]
// 				}
// 				col("col-12 col-lg-4") {
// 					input(asset.balance)[class="form-control btn-dark"] {
// 						validate((asset.balance) >= 0.0, "Balance should be bigger or equal to 0")
// 					}
// 				}
// 			}
// 			row[class="mt-2"] {
// 				col("col-12 col-lg-2 text") {
// 					
// 				}
// 				col("col-12 col-lg-4") {
// 					submit action {
// 						asset.save();
// 					}[class="btn btn-sm btn-success w-100"] { "Create" }
// 				}
// 			}
// 		}
// 		
// 	}
// }
// 
// override page editAsset(asset: Asset) {
// 	main()
// 	
// 	define body() {
// 		
// 		pageTitle {
// 			"Change Balance" 
// 		}
// 		
// 		pageSubTitle {
// 			"Edit your balance or remove the asset from the portfolio."
// 		}
// 		
// 		form[class="mt-4"] {
// 			row[class="align-items-center"] {
// 				col("col-12 col-lg-2") {
// 					label("Currency")[class="col-form-label text-white fst-italic fw-bold"]
// 				}
// 				col("col-12 col-lg-4") {
// 					span[class="text-muted"] {
// 						"~asset.token.name (~asset.token.symbol)"
// 					}	
// 				}
// 			}
// 			row {
// 				col("col-12 col-lg-2") {
// 					label("Balance")[class="col-form-label text-white fst-italic fw-bold"]
// 				}
// 				col("col-12 col-lg-4") {
// 					input(asset.balance)[class="form-control btn-dark"] {
// 						validate((asset.balance) >= 0.0, "Balance should be bigger or equal to 0")
// 					}
// 				}
// 			}
// 			row[class="align-items-center"] {
// 				col("col-12 col-lg-2 text") {
// 					
// 				}
// 				col("col-12 col-lg-4") {
// 					row[class="align-items-center mt-4"] {
// 						col("col-6") {
// 							submit action {
// 								asset.delete();
// 							}[class="btn btn-sm btn-danger w-100"] { "Remove" }
// 						}
// 						col("col-6 text-end") {
// 							submit action {
// 								asset.save();
// 							}[class="btn btn-sm btn-success w-100"] { "Save" }
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}	
// }