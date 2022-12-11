import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import axios from 'axios';
import * as actions from '../../store/actions/index';
import Card from '../../components/Card/Card';
import './Reservation.css';

function Reservation(props) {
    const { userId } = props;
    const [reservedDocumentDetails, setReservedDocumentDetails] = useState([]);

    useEffect(() => {
        const data = {
            "uid": userId
        }
        axios.post('http://localhost:3000/reader/status/bookings/reserves', data).then(resp => {
            if (resp.status === 200) {
                setReservedDocumentDetails(resp.data.result);
            }
        })
    }, [userId]);

    return (
        <>
            <h2>User Reserved/Returned Documents</h2>

            {reservedDocumentDetails && reservedDocumentDetails?.length ?
                <div className='dataList'>
                    {reservedDocumentDetails?.length && reservedDocumentDetails.map((item, index) => (
                        <Card key={index} item={item} cardType="reservedDocumentDetails" />
                    ))}
                </div>
                // <div className='Wrapper'>
                //     <div className='Reserved'>
                //         <h3>Resered Book Details</h3>
                //         <div className='card-wrapper'>
                //             {reservedDocumentDetails?.length && reservedDocumentDetails.map((item, index) => (
                //                 <Card key={index} item={item} cardType="reservedDocumentDetails" />
                //             ))}
                //         </div>
                //     </div>
                //     <div className='Returned'>
                //         <h3>Returned Book Details</h3>
                //         <div className='card-wrapper'>
                //             {returnedDocumentDetails?.length && returnedDocumentDetails.map((item, index) => (
                //                 <Card key={index} item={item} cardType="returnedDocumentDetails" />
                //             ))}
                //         </div>
                //     </div>
                // </div> 
                :
                reservedDocumentDetails?.length === 0 && <><p>User has no Reserved Documents present</p> <p>Go to <Link to="/">Home</Link> Page</p> </>
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
        tables: state.reservation.tables,
        capacity: state.reservation.capacity,
        slots: state.reservation.slots,
        loading: state.reservation.loading,
        purchased: state.reservation.purchased,
        userId: state.auth.userId,
        token: state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderTable: (orderData, token, tables) => dispatch(actions.bookTable(orderData, token, tables)),
        onOrderTableInit: () => dispatch(actions.bookTableInit()),
        onFetchTables: () => dispatch(actions.fetchTables()),
        onFetchSlots: (capacity, tables) => dispatch(actions.fetchSlots(capacity, tables))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reservation);