import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import Card from '../../components/Card/Card';
import * as actions from '../../store/actions/index';
import { Link } from 'react-router-dom';

import './Orders.css';

function Orders(props) {
    const { userId } = props;
    const [borrowedDocumentDetails, setBorrowedDocumentDetails] = useState([]);
    const [allDocumentDetails, setAllDocumentDetails] = useState([]);
    const [returnedDocumentDetails, setReturnedDocumentDetails] = useState([]);

    const partition = (array, isValid) => {
        return array.reduce(([pass, fail], elem) => {
            return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
        }, [[], []]);
    }

    useEffect(() => {
        const data = {
            "uid": userId
        }
        axios.post('http://localhost:3000/reader/status/bookings/borrows', data).then(resp => {
            if (resp.status === 200) {
                setAllDocumentDetails(resp.data.result);
            }
        })
    }, [userId]);

    useEffect(() => {
        if(allDocumentDetails?.length) {
            const [returnedDocuments, reservedDocuments] = partition(allDocumentDetails, (item) => item.RDTime !== null);
    
            setReturnedDocumentDetails(returnedDocuments);
            setBorrowedDocumentDetails(reservedDocuments);
        }
    }, [allDocumentDetails])

    return (
        <>
            <h2>User Booked/Returned Documents</h2>

            {allDocumentDetails && allDocumentDetails?.length ?
                <div className='Wrapper'>
                    <div className='Reserved'>
                        <h3>Resered Book Details</h3>
                        <div className='card-wrapper'>
                            {borrowedDocumentDetails?.length && borrowedDocumentDetails.map((item, index) => (
                                <Card key={index} item={item} cardType="borrowedDocumentDetails" />
                            ))}
                        </div>
                    </div>
                    <div className='Returned'>
                        <h3>Returned Book Details</h3>
                        <div className='card-wrapper'>
                            {returnedDocumentDetails?.length && returnedDocumentDetails.map((item, index) => (
                                <Card key={index} item={item} cardType="returnedDocumentDetails" />
                            ))}
                        </div>
                    </div>
                </div> :
                allDocumentDetails?.length === 0 && <><p>User has no Reserved Documents present</p> <p>Go to <Link to="/">Home</Link> Page</p> </>
            }
            {/* <Modal
                show={message}
                modalClosed={errorConfirmedHandler}>
                {message}
            </Modal> */}
        </>
    );
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        orderConfirm: state.order.orderConfirm,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch( actions.fetchOrders(token, userId) ),
        onCancelOrder: (id, token) => dispatch( actions.cancelOrder(id, token) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Orders );