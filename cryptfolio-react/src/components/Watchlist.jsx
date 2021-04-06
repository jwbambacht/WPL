import React, { Component, useEffect } from 'react';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import userservice from '../services/userservice';
import tokenservice from '../services/tokenservice';
import * as UI from './elements/UIElements';

export default class Watchlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            sort_by: '',
            loggedIn: false,
            isLoading: true,
            search: '',
        };

        this.getTokenData = this.getTokenData.bind(this);
        this.sortList = this.sortList.bind(this);
        this.filterList = this.filterList.bind(this);
        this.searchToken = this.searchToken.bind(this);
    }

    searchToken(e) {
        this.setState({
            ...this.state,
            sort_by: 'search',
            [e.target.name]: e.target.value,
        });
    }

    sortList(a, b) {
        switch (this.state.sort_by) {
            case 'gainers':
                return a.data.change < b.data.change;
            case 'losers':
                return a.data.change > b.data.change;
            case 'volume':
                return a.data.volume < b.data.volume;
            default:
                return a.name > b.name;
        }
    }

    filterList(item) {
        switch (this.state.sort_by) {
            case 'gainers':
                return item.data.change > 0;
            case 'losers':
                return item.data.change < 0;
            case 'favorite':
                return item.favorite;
            case 'search':
                return (
                    item.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.symbol.toLowerCase().includes(this.state.search.toLowerCase())
                );
            default:
                return true;
        }
    }

    handleSortFilter(event, filter) {
        this.setState(
            {
                sort_by: filter,
            },
            () => {
                const filter_buttons = document.getElementsByClassName('filter-button');

                Object.keys(filter_buttons).map((key) => {
                    filter_buttons[key].classList.remove('bg-darker');
                    // filter_buttons[key].childNodes[0].classList.remove('bg-darker');
                    filter_buttons[key].classList.add('bg-lighter');
                    // filter_buttons[key].childNodes[0].classList.add('bg-lighter');
                });
                event.target.classList.add('bg-darker');
                event.target.classList.remove('bg-lighter');
            },
        );
    }

    getTokenData() {
        var data = '/data';
        tokenservice.getTokens(data).then((data) => {
            this.setState({
                tokens: data.tokens,
                isLoading: false,
            });
        });
    }

    componentDidMount() {
        this.getTokenData();

        if (authservice.checkingPage(this.props)) {
            this.setState({
                ...this.state,
                login: true,
            });
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle classes="d-flex justify-content-between align-items-center">
                    Watchlist
                    <div className="d-flex justify-content-between ms-3 align-items-end">
                        <div className="d-none d-md-block">
                            <UI.FormInputGroup classes="input-group-sm fs-8">
                                <span className="input-group-text bg-lighter border-lighter">
                                    <UI.Icon icon="bi-search text-white" />
                                </span>
                                <UI.Input
                                    type="text"
                                    name="search"
                                    value={this.state.search}
                                    classes="form-control-sm bg-lighter searchbar search text-muted"
                                    size="fs-7"
                                    onChange={(event) => this.searchToken(event)}
                                    placeholder="Search name or symbol..."
                                />
                            </UI.FormInputGroup>
                        </div>

                        <div>
                            <span className="d-none d-sm-block d-flex align-items-center">
                                <UI.Badge
                                    classes="btn bg-lighter ms-2 fs-7 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'gainers')}
                                >
                                    Gainers
                                </UI.Badge>
                                <UI.Badge
                                    classes="btn bg-lighter ms-2 fs-7 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'losers')}
                                >
                                    Losers
                                </UI.Badge>
                                <UI.Badge
                                    classes="btn bg-lighter ms-2 fs-7 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'volume')}
                                >
                                    Volume
                                </UI.Badge>
                                {this.state.login && (
                                    <UI.Badge
                                        classes="bi bi-star-fill text-warning btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                        onClick={(event) => this.handleSortFilter(event, 'favorite')}
                                    >
                                        &nbsp;
                                    </UI.Badge>
                                )}
                                {this.state.sort_by != '' && (
                                    <UI.Badge
                                        classes="badge bi bi-arrow-clockwise text-white btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                        onClick={(event) => this.handleSortFilter(event, '')}
                                    >
                                        &nbsp;
                                    </UI.Badge>
                                )}
                            </span>
                            <span className="d-sm-none d-flex align-items-center">
                                <UI.Badge
                                    classes="bi bi-hand-thumbs-up btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'gainers')}
                                >
                                    &nbsp;
                                </UI.Badge>
                                <UI.Badge
                                    classes="bi bi-hand-thumbs-down btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'losers')}
                                >
                                    &nbsp;
                                </UI.Badge>
                                <UI.Badge
                                    classes="bi bi-layers btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                    onClick={(event) => this.handleSortFilter(event, 'volume')}
                                >
                                    &nbsp;
                                </UI.Badge>
                                {this.state.login && (
                                    <UI.Badge
                                        classes="bi bi-star-fill text-warning btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                        onClick={(event) => this.handleSortFilter(event, 'favorite')}
                                    >
                                        &nbsp;
                                    </UI.Badge>
                                )}
                                {this.state.sort_by != '' && (
                                    <UI.Badge
                                        classes="badge bi bi-arrow-clockwise text-white btn bg-lighter ms-2 fs-8 pe-1 py-2 filter-button"
                                        onClick={(event) => this.handleSortFilter(event, '')}
                                    >
                                        &nbsp;
                                    </UI.Badge>
                                )}
                            </span>
                        </div>
                    </div>
                </UI.PageTitle>
                <UI.PageSubTitle>
                    The list below includes statistics of all coins available on this platform. You can search for a
                    coin or sort the list by the coin with the highest gain, loss, or volume.
                </UI.PageSubTitle>
                <UI.Row classes="mt-4">
                    <UI.Col classes="col-12 d-md-none mb-2">
                        <UI.FormInputGroup classes="input-group-sm fs-8 d-md-none">
                            <span className="input-group-text bg-lighter border-0">
                                <UI.Icon icon="bi-search text-white" />
                            </span>
                            <UI.Input
                                type="text"
                                name="search"
                                value={this.state.search}
                                classes="form-control-sm bg-lighter search text-muted"
                                size="fs-8"
                                onChange={(event) => this.searchToken(event)}
                                placeholder="Search name or symbol..."
                            />
                        </UI.FormInputGroup>
                    </UI.Col>
                    <UI.Col classes="col-12">
                        <UI.Card>
                            {this.state.isLoading && (
                                <UI.Col classes="col-12 text-center py-4">
                                    <UI.Spinner />
                                </UI.Col>
                            )}

                            {!this.state.isLoading && (
                                <UI.CardBody classes="py-2">
                                    <UI.Row classes="mb-1">
                                        <UI.Col classes="col">
                                            <UI.Badge classes="text-start bg-darkest">Token</UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col d-none d-lg-block">
                                            <UI.Badge classes="text-start bg-darkest">Symbol</UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col">
                                            <UI.Badge classes="text-start bg-darkest">
                                                Price<span className="d-md-none"> / Change</span>
                                            </UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col d-none d-md-block">
                                            <UI.Badge classes="text-start bg-darkest">Change</UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col d-none d-lg-block">
                                            <UI.Badge classes="text-start bg-darkest">
                                                High <UI.Icon icon="bi-arrow-up-short" classes="text-white"></UI.Icon>
                                            </UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col d-none d-lg-block">
                                            <UI.Badge classes="text-start bg-darkest">
                                                Low <UI.Icon icon="bi-arrow-down-short" classes="text-white"></UI.Icon>
                                            </UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col">
                                            <UI.Badge classes="text-start bg-darkest">Volume</UI.Badge>
                                        </UI.Col>
                                    </UI.Row>

                                    {this.state.tokens
                                        .filter((item) => this.filterList(item))
                                        .sort(this.sortList)
                                        .map((item, index) => (
                                            <UI.Row classes="mb-1" key={item.id}>
                                                <UI.Col classes="col">
                                                    <UI.Badge classes="d-flex align-items-center">
                                                        {this.state.login && (
                                                            <span>
                                                                {item.favorite && (
                                                                    <UI.Icon
                                                                        icon="bi-star-fill"
                                                                        classes="me-2 text-warning"
                                                                    ></UI.Icon>
                                                                )}
                                                                {!item.favorite && (
                                                                    <UI.Icon icon="bi-star" classes="me-2"></UI.Icon>
                                                                )}
                                                            </span>
                                                        )}
                                                        <span className="d-none d-lg-block">{item.name}</span>
                                                        <span className="d-lg-none">{item.symbol}</span>
                                                    </UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-lg-block">
                                                    <span className="badge">{item.symbol}</span>
                                                </UI.Col>
                                                <UI.Col classes="col text-white">
                                                    <UI.Badge>
                                                        ${helper.nDecimals(parseFloat(item.data.price), 2, true)}
                                                    </UI.Badge>
                                                    {item.data.change > 0 && (
                                                        <UI.Badge classes="d-md-none bg-success">
                                                            <UI.Icon icon="bi-caret-up-fill"></UI.Icon>
                                                            {item.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                    {item.data.change < 0 && (
                                                        <UI.Badge classes="d-md-none bg-danger">
                                                            <UI.Icon icon="bi-caret-down-fill"></UI.Icon>
                                                            {Math.abs(item.data.change).toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                    {item.data.change == 0 && (
                                                        <UI.Badge classes="d-md-none bg-secondary">
                                                            <UI.Icon icon="bi-caret-right-fill"></UI.Icon>
                                                            {item.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-md-block text-white">
                                                    {item.data.change > 0 && (
                                                        <UI.Badge classes="bg-success">
                                                            <UI.Icon icon="bi-caret-up-fill"></UI.Icon>
                                                            {item.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                    {item.data.change < 0 && (
                                                        <UI.Badge classes="bg-danger">
                                                            <UI.Icon icon="bi-caret-down-fill"></UI.Icon>
                                                            {Math.abs(item.data.change).toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                    {item.data.change == 0 && (
                                                        <UI.Badge classes="bg-secondary">
                                                            <UI.Icon icon="bi-caret-right-fill"></UI.Icon>
                                                            {item.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    )}
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-lg-block">
                                                    <UI.Badge classes="text-success">
                                                        ${helper.nDecimals(parseFloat(item.data.high), 2, true)}
                                                    </UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-lg-block">
                                                    <UI.Badge classes="text-danger">
                                                        ${helper.nDecimals(parseFloat(item.data.low), 2, true)}
                                                    </UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col">
                                                    <UI.Badge>
                                                        {helper.nDecimals(parseFloat(item.data.volume), 2, true)}M
                                                    </UI.Badge>
                                                </UI.Col>
                                            </UI.Row>
                                        ))}
                                    {this.state.login && (
                                        <UI.Row>
                                            <UI.Col classes="col text-muted fs-8 fst-italic">
                                                <UI.Icon icon="bi-star-fill" classes="ms-2 me-2 text-warning"></UI.Icon>
                                                denotes that this token is included in at least one portfolio
                                            </UI.Col>
                                        </UI.Row>
                                    )}
                                </UI.CardBody>
                            )}
                        </UI.Card>
                    </UI.Col>
                </UI.Row>
            </>
        );
    }
}
