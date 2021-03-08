Highcharts.theme = {
	colors: ['#2b908f'],
	chart: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
			stops: [
				[0, '#454d55'],
				[1, '#454d55']
			]
		},
		plotBorderColor: '#606063'
	},
	xAxis: {
		visible: false
	},
	yAxis: {
		visible:false
	},
	tooltip: {
		backgroundColor: '#343a40',
		style: {
			color: '#F0F0F0'
		},
		borderColor: '#343a40',
		formatter: function() {
			var tooltip = Highcharts.dateFormat('%A, %b %e, %Y, %H:%m', new Date(this.x));
			var data = this.series.chart.series[0].data;
			var index = this.point.index;
			tooltip += '<br><span style="font-size: 16px;">$' + (this.y).toFixed(2) + '</span>';
			
			return tooltip;
		} 
	},
	credits: {
		style: {
			color: '#2a3037'
		}
	}
};