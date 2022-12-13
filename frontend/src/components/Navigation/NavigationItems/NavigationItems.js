import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';
import Dropdown from '../../Dropdown/Dropdown';

const navigationItems = ( props ) => (
    <ul className='NavigationItems'>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {props.isAuthenticated && props.manager ? <Dropdown/> : null}
        {props.isAuthenticated ? <NavigationItem link="/reservation">Reserved</NavigationItem> : null}
        {props.isAuthenticated && props.manager ? <NavigationItem link="/booked">Booked</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">SignIn/SignUp</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;