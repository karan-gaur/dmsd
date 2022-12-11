import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Layout from './containers/Layout/Layout';
import HomePage from './containers/HomePage/HomePage';

import * as actions from './store/actions/index';
import { useEffect } from 'react';
import { connect } from 'react-redux';

function App(props) {

  useEffect(()=> {
    props.onTryAutoSignup();
  })
  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" exact component={HomePage} />
      <Redirect to="/" />
    </Switch>
  );
  return (
    <div className="App">
      <Layout>
        {routes}
      </Layout>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    manager: state.auth.manager
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};
export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
