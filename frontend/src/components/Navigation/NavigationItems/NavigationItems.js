import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';
import Dropdown from '../../Dropdown/Dropdown';

const addOptions = [
    { name: 'Add Document', link: '/add/document' },
    { name: 'Add Document Copy', link: '/add/documentCopy' },
    { name: 'Add Reader', link: '/add/reader' },
    { name: 'Add Publisher', link: '/add/publisher' },
];
const listOptions = [
    { name: 'List Branches', link: '/list/branches' },
    { name: 'List Publishers', link: '/list/publisher' },
];

const navigationItems = ( props ) => (
    <ul className='NavigationItems'>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {props.isAuthenticated && props.manager ? <Dropdown name="Add" options={addOptions}/> : null}
        {props.isAuthenticated && props.manager ? <Dropdown name="list" options={listOptions}/> : null}
        {props.isAuthenticated && !props.manager ? <NavigationItem link="/reservation">Reserved</NavigationItem> : null}
        {props.isAuthenticated && !props.manager ? <NavigationItem link="/booked">Booked</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">SignIn/SignUp</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;