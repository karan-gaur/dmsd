import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            uid: 1,
            password: password
        };
        let url = 'http://localhost:3000/login';
        // if (!isSignup) {
        //     url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC6TVSzbdy0Q_EA2FSWZdJ9mesn3N9EZyk';
        // }
        axios.post(url, authData)
            .then(response => {
                const expiresIn = 3600;
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                // localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', 1);
                // dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(authSuccess(response.data.idToken, 1));
                dispatch(checkAuthTimeout(expiresIn));
            })
            .catch(err => {
                console.log(err.response);
                dispatch(authFail(err.response.data.error));
            });

            const expiresIn = 3600;
            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
            // localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('token', 'authToken');
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', 1);
            // dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(authSuccess('authToken', 1));
            dispatch(checkAuthTimeout(expiresIn));
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const setManager = () => {
    return {
        type: actionTypes.SET_MANAGER
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   
        }
    };
};