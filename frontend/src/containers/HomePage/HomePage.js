import { useEffect, useState } from "react";
import { connect } from "react-redux";
import './HomePage.css';
import Search from "../../components/Search/Search";
import * as actions from '../../store/actions/index';

const HomePage = (props) => {
    const [showSearch, setShowSearch] = useState(false);

    useEffect(()=>{
        if (props.isAuthenticated) {
            setShowSearch(prevState => !prevState)
        }
    },[props.isAuthenticated])
    
    return (
        <div className="HomeContainer" style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL + '/book-background.png'})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 75%'
        }}>
            <h2>Books Library</h2>

        {showSearch && <Search/>}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onSetManger: () => dispatch(actions.setManager())
    };
};
export default connect( mapStateToProps, mapDispatchToProps )( HomePage );