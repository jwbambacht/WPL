import React, { useState } from 'react';
import helper from '../../utils/helper';

export function PageTitle(props) {
    return <h1 className={(props.classes || '') + ' text-white mt-4'}>{props.children}</h1>;
}

export function PageSubTitle(props) {
    return <div className={(props.classes || '') + ' text-muted mb-2'}>{props.children}</div>;
}

export function Row(props) {
    return <div className={(props.classes || '') + ' row'}>{props.children}</div>;
}

export function Col(props) {
    return <div className={props.classes || ''}>{props.children}</div>;
}

export function Card(props) {
    return (
        <div className={(props.classes || '') + ' card bg-lighter rounded-3 text-white p-0 border-0'}>
            {props.children}
        </div>
    );
}

export function CardHeader(props) {
    return <div className={(props.classes || '') + ' card-header bg-lighter fs-3'}>{props.children}</div>;
}

export function CardHeaderTitle(props) {
    return <span className={(props.classes || '') + ' fw-bold'}>{props.children}</span>;
}

export function CardBody(props) {
    return <div className={(props.classes || '') + ' card-body bg-lighter p-3 rounded-3'}>{props.children}</div>;
}

export function FormRow(props) {
    return <div className={(props.classes || '') + ' align-items-center mb-2 row'}>{props.children}</div>;
}

export function FormColLabel(props) {
    return <div className={(props.classes || '') + ' col-12 col-md-4'}>{props.children}</div>;
}

export function FormColInput(props) {
    return <div className={(props.classes || '') + ' col-12 col-md-8'}>{props.children}</div>;
}

export function FormInputGroup(props) {
    return <div className={(props.classes || '') + ' input-group'}>{props.children}</div>;
}

export function FormLabel(props) {
    return (
        <label className={(props.classes || '') + ' col-form-label text-white fst-italic fw-bold'}>
            {props.children}
        </label>
    );
}

export function List(props) {
    return <ul className={props.classes || ''}>{props.children}</ul>;
}

export function ListItem(props) {
    return <li className={(props.classes || '') + ' list-group-item border-0 rounded-3'}>{props.children}</li>;
}

export function NavListItem(props) {
    return <li className={(props.classes || '') + ' nav-item'}>{props.children}</li>;
}

export function Badge(props) {
    return (
        <span className={(props.classes || '') + ' badge'} {...helper.objectWithoutKey(props, 'classes')}>
            {props.children}
        </span>
    );
}

export function Input(props) {
    return (
        <input
            className={(props.classes || '') + ' form-control border-0 text-white ' + (props.size || 'fs-6')}
            {...helper.objectWithoutKey(props, 'classes')}
        />
    );
}

export function Icon(props) {
    return <i className={'bi ' + props.icon + ' ' + (props.classes || '')}></i>;
}

export function IntervalSelector(props) {
    return (
        <span
            data-interval={props.interval}
            className={`badge col btn btn-sm btn-dark me-2 mb-1 change-chart-interval ${
                props.selected === 'selected' ? ' text-white selected-interval' : ' text-muted'
            }`}
            onClick={(event) => {
                props.clickHandler(event, props.interval);
            }}
        >
            {props.interval}
        </span>
    );
}

export function Spinner() {
    return (
        <div role="status" className="spinner-grow text-light">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}
