import React, { Component, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export class PortfolioChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: {
                backgroundColor: '#454d55',
                zoomType: 'x',
                margin: 0,
                plotBorderColor: '#606063',
            },
            title: {
                text: '',
            },
            xAxis: {
                type: 'datetime',
                crosshair: {
                    enabled: false,
                },
            },
            legend: {
                enabled: false,
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
            series: [
                {
                    type: 'area',
                    name: 'Value',
                    data: [],
                },
            ],
        };

        this.getData = this.getData.bind(this);
    }

    getData(variables, hasLoaded) {
        var url =
            'https://www.jbambacht.nl/binance/fetchData.php?type=portfolio&symbols=' +
            variables.symbols.toString() +
            '&days=' +
            variables.interval +
            '&balances=' +
            variables.balances.toString();
        $.getJSON(url, (data) => {
            this.setState({
                ...this.state,
                series: [
                    {
                        ...this.state.series,
                        data: data,
                    },
                ],
            });
        }).done(() => {
            hasLoaded(true);
        });
    }

    componentDidMount() {
        this.getData(this.props.variables, this.props.loaded);
    }

    componentDidUpdate(prevProps) {
        if (this.props.variables !== prevProps.variables) {
            this.getData(this.props.variables, this.props.loaded);
        }
    }

    render() {
        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'chart'}
                options={this.state}
                allowChartUpdate={true}
                containerProps={{ className: 'w-100 h-200px' }}
            />
        );
    }
}

export class AssetChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: {
                margin: 0,
                backgroundColor: '#454d55',
            },
            title: {
                text: '',
            },
            xAxis: [
                {
                    labels: {
                        style: {
                            color: '#FFF',
                        },
                    },
                },
            ],
            yAxis: [
                {
                    labels: {
                        align: 'right',
                        x: -3,
                        style: {
                            color: '#FFF',
                        },
                    },
                    title: {
                        text: 'OHLC',
                    },
                    height: '60%',
                    lineWidth: 0,
                    gridLineColor: '#6c757d',
                    resize: {
                        enabled: true,
                    },
                },
                {
                    labels: {
                        align: 'right',
                        x: -3,
                        style: {
                            color: '#FFF',
                        },
                    },
                    title: {
                        text: 'Volume',
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 0,
                    gridLineColor: '#6c757d',
                },
            ],
            plotOptions: {
                candlestick: {
                    color: '#198754',
                    upColor: '#dc3545',
                },
            },
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
                trackBorderRadius: 7,
            },
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
        };

        this.getData = this.getData.bind(this);
    }

    getData(variables, hasLoaded) {
        var url =
            'https://api.binance.com/api/v3/klines?symbol=' +
            variables.symbol +
            'USDT&interval=' +
            variables.interval +
            '&limit=1000';

        $.getJSON(url, (data) => {
            var ohlc = [];
            var volume = [];
            var i = 0;
            var volumeColor = '';

            for (i; i < data.length; i += 1) {
                ohlc.push([
                    data[i][0],
                    parseFloat(data[i][1]),
                    parseFloat(data[i][2]),
                    parseFloat(data[i][3]),
                    parseFloat(data[i][4]),
                ]);

                if (i == 0) {
                    volumeColor = '#198754';
                } else {
                    if (data[i][1] >= data[i - 1][1]) {
                        volumeColor = '#198754';
                    } else {
                        volumeColor = '#dc3545';
                    }
                }

                volume.push({
                    x: data[i][0],
                    y: parseFloat(data[i][5]),
                    color: volumeColor,
                });
            }

            this.setState({
                ...this.state,
                series: [
                    {
                        type: 'candlestick',
                        name: 'Price',
                        data: ohlc,
                        lineColor: '#198754',
                        upLineColor: '#dc3545',
                    },
                    {
                        type: 'column',
                        name: 'Volume',
                        data: volume,
                        yAxis: 1,
                    },
                ],
            });
        }).done(() => {
            hasLoaded(true);
        });
    }

    componentDidMount() {
        if (this.props.variables.symbol != '') {
            this.getData(this.props.variables, this.props.loaded);
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.variables.symbol !== prevProps.variables.symbol ||
            this.props.variables.interval !== prevProps.variables.interval
        ) {
            this.getData(this.props.variables, this.props.loaded);
        }
    }

    render() {
        return (
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={this.state}
                containerProps={{ className: 'w-100 h-400px' }}
            />
        );
    }
}
