$(document).ready(function() {

	var page = $("body").attr('id');
	
	$(".nav-link[data-page^='"+page+"']").addClass("active");

	plotChart();
	plotCandles();
	
	$(".change-chart-interval").on("click", function() {
	
		var page = $(this).data("page");
		
		if(page == "portfolio") {	
			var element = $(this).parents(".portfolio");
		}else if(page == "asset") {
			var element = $(this).parents(".card");
		}
			
		$(".chart-spinner-container").removeClass("d-none");
	
		if($(this).hasClass("selected-interval")) {
			return;
		}
		
		$(".change-chart-interval.selected-interval", element).removeClass("selected-interval text-white").addClass("text-muted");
		$(this).removeClass("text-muted").addClass("selected-interval text-white");
		
		if(page == "portfolio") {	
			plotChart(element);
		}else if(page == "asset") {
			plotCandles(element);
		}
	});
	
	$(document).on("click", ".filter-button", function() {
		$(this).addClass("bg-darkest");
		$(this).removeClass("bg-lighter");
		
		$(".filter-button").not(this).removeClass("bg-darkest");
		$(".filter-button").not(this).addClass("bg-lighter");
	});
	
	$(".list-sortable").sortable({
		disableSelection: true,
		stop: function(event, ui) {
			$(".list-group-item", this).each(function(index) {
				var element = $(this).find(".hidden-input");
				
				element.val(index);
				element.trigger('change');
			});
		}
	});

	function listSymbolsBalances(element, type) {
		var list = [];
		$('.portfolio-row', element).each(function(i,item){
			list.push($(item).data(type));
		});
		
		return list;
	}

	function plotCandles() {
		if($("#asset-chart").length == 0) {
			return;
		}
		
		var symbol = $("#asset-chart").data("symbol");
		var interval = $(".change-chart-interval.selected-interval").data("interval");
		var url = "https://api.binance.com/api/v3/klines?symbol="+symbol+"USDT&interval="+interval+"&limit=1000";
		
		Highcharts.getJSON(url, function (data) {
			var ohlc = [];
			var volume = [];
			var i = 0;
			
			for (i; i < data.length; i += 1) {
				ohlc.push([
					data[i][0],
					parseFloat(data[i][1]),
					parseFloat(data[i][2]),
					parseFloat(data[i][3]),
					parseFloat(data[i][4])
				]);
				
				if(i == 0) {
					volumeColor = '#198754';
				}else{         
					if (data[i][1] >= data[i-1][1]) {
						volumeColor = '#198754';
					}else{
						volumeColor = '#dc3545';
					}
				}

				volume.push({
					x: data[i][0],
					y: parseFloat(data[i][5]),
					color: volumeColor
				});
			}
		
    		Highcharts.stockChart('asset-chart-container', {
	    		chart: {
	    			margin: 0,
	    			backgroundColor: '#454d55',
					events: {
	                	load: function(event) {
                    		$(".chart-spinner-container").addClass("d-none");
    	        	    }
        		    }     
    			},
    			plotOptions: {
					candlestick: {
						color: '#198754',
						upColor: '#dc3545'
					}
				},
				rangeSelector: {
					inputEnabled: false,
					buttons: [{
							type: 'day',
							count: 1,
							text: '1d'
						}, {
							type: 'day',
							count: 3,
							text: '3d'
						}, {
							type: 'week',
							count: 1,
							text: '1w'
						}, {
							type: 'month',
							count: 1,
							text: '1m'
						}, {
							type: 'year',
							count: 1,
							text: '1y'
						}, {
							type: 'all',
							text: 'All'
					}],
					selected: 2,
					labelStyle: {
						visibility: 'hidden'
					}
				},

				title: {
					text: ''
				},
				xAxis: [{
					labels: {
						style: {
							color: '#FFF'
						}
					}
				}],
				yAxis: [{
					labels: {
						align: 'right',
						x: -3,
						style: {
							color: '#FFF'
						}
					},
					title: {
						text: 'OHLC'
					},
					height: '60%',
					lineWidth: 0,
					gridLineColor: '#6c757d',
					resize: {
						enabled: true
					}
				}, {
					labels: {
						align: 'right',
						x: -3,
						style: {
							color: '#FFF'
						}
					},
					title: {
						text: 'Volume'
					},
					top: '65%',
					height: '35%',
					offset: 0,
					lineWidth: 0,
					gridLineColor: '#6c757d',
				}],
				tooltip: {
					style: {
						color: '#F0F0F0',
					},
					backgroundColor: '#2a3037',
					borderColor: '#2a3037',
				},
				credits: {
					enabled: false,
				},
				series: [{
					type: 'candlestick',
					name: 'Price',
					data: ohlc,
					lineColor: '#198754',
					upLineColor: '#dc3545'
				}, {
					type: 'column',
					name: 'Volume',
					data: volume,
					yAxis: 1,
				}],
				scrollbar: {
					barBackgroundColor: '#6c757d',
					barBorderRadius: 0,
					barBorderWidth: 0,
					buttonBackgroundColor: '#6c757d',
					buttonBorderWidth: 0,
					buttonArrowColor: '#FFF',
					buttonBorderRadius: 0,
					rifleColor: '#FFF',
					trackBackgroundColor: '#6c757d',
					trackBorderWidth: 1,
					trackBorderColor: '#6c757d',
					trackBorderRadius: 7
				},
			});
		});
	}
	
	function plotChart() {
		if($("#portfolio-chart").length == 0) {
			return;
		}

		var symbols = listSymbolsBalances($(".portfolio-list"),'symbol');
		var balances = listSymbolsBalances($(".portfolio-list"),'balance');
		
		if(symbols.length == 0 || balances.length == 0 || $(".change-chart-interval").length == 0) {
			return;
		}
		
		var days = $(".change-chart-interval.selected-interval").data("interval");
		var url = 'https://www.jbambacht.nl/binance/fetchData.php?type=portfolio&symbols='+symbols.toString()+'&days='+days+'&balances='+balances.toString();
		
		$("#portfolio-chart").removeClass("d-none");

		Highcharts.getJSON(url, function (data) {
			Highcharts.chart('portfolio-chart-container', {
				chart: {
					backgroundColor: '#454d55',
        	        zoomType: 'x',
    	            margin: 0,
	                plotBorderColor: '#606063',
					events: {
	                	load: function(event) {
                    		$(".chart-spinner-container").addClass("d-none");
    	        	    }
        		    }      
				},
				title: {
					text: ''
				},
				xAxis: {
					type: 'datetime',
					crosshair: false
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series: {
						fillColor: {
							linearGradient: [0, 0, 0, 1],
							stops: [
								[0, Highcharts.getOptions().colors[0]],
								[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
							],
						},
						threshold: null,
					},
				},
				credits: {
					enabled: false,
				},
				colors: ['#2b908f'],
				xAxis: {
					visible: false,
				},
				yAxis: {
					visible: false,
				},
				tooltip: {
					style: {
						color: '#F0F0F0',
					},
					backgroundColor: '#2a3037',
					borderColor: '#2a3037',
					formatter: function () {
						var tooltip = Highcharts.dateFormat('%A, %b %e, %Y, %H:%m', new Date(this.x));
						var data = this.series.chart.series[0].data;
						var index = this.point.index;
						tooltip += '<br><span style="font-size: 16px;">$' + this.y.toFixed(2) + '</span>';

						return tooltip;
					},
				},
				series: [{
					type: 'area',
					name: 'Value',
					data: data
				}]
			});
		});		
	}
});