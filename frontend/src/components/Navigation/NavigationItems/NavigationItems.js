import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';

const navigationItems = ( props ) => (
    <ul className='NavigationItems'>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/reservation">Reservation</NavigationItem> : null}
        {props.isAuthenticated && props.manager ? <NavigationItem link="/manager">Manager</NavigationItem> : null}
        {props.isAuthenticated && !props.manager ? <NavigationItem link="/orders">Orders</NavigationItem> : null}
        {props.isAuthenticated && !props.manager ? <NavigationItem link="/bookings">Bookings</NavigationItem> : null}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">SignIn/SignUp</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;