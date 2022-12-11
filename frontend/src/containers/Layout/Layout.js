import React, { useState } from 'react';
import { connect } from 'react-redux';

import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
    const initState = {
        showSideDrawer: false
    }
    const [state, setState] = useState(initState);

    const sideDrawerClosedHandler = () => {
        setState(initState);
    }

    const sideDrawerToggleHandler = () => {
        setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }

    return (
        <div>
            <Toolbar
                isAuth={props.isAuthenticated}
                manager={props.manager}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                manager={props.manager}
                open={state.showSideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className='Content'>
                <div className="HomeContainer" style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + '/book-background.png'})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50% 75%'
                }}>
                    {props.children}
                </div>
            </main>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        manager: state.auth.manager
    };
};

export default connect(mapStateToProps)(Layout);
