import { useEffect, useState } from "react";
import axios from 'axios';
import Card from "../Card/Card";
import { connect } from "react-redux";
import Modal from "../UI/Modal/Modal";
import { Link } from "react-router-dom";

const BookDetails = (props) => {
    const { match } = props;
    const [documentDetails, setDocumentDetails] = useState([]);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (match.params.docId) {
            const data = {
                "doc_id": match.params.docId
            }
            axios.post('http://localhost:3000/reader/document/check', data).then(resp => {
                if (resp.status === 200) {
                    setDocumentDetails(resp.data.result);
                }
            })
        }
    }, [match.params.docId])

    const reserveBook = (doc_uuid) => {
        const data = {
            doc_uuid: doc_uuid,
            uid: props.userId

        }
        axios.post('http://localhost:3000/reader/document/reserve', data).then(resp => {
            if (resp.status === 200) {
                console.log('resp',resp);
                setMessage(resp.data.result);

            }
        }).catch(err => {
            console.log(err.response);
            setMessage(err.response.data.error)
        })
    }

    const borrowBook = (doc_uuid) => {
        console.log('working', doc_uuid);
        const data = {
            doc_uuid: doc_uuid,
            uid: props.userId
        }
        axios.post('http://localhost:3000/reader/document/checkout', data).then(resp => {
            if (resp.status === 200) {
                console.log(resp);
                setMessage(resp.data.result)
            }
        }).catch(err => {
            console.log(err.response);
            setMessage(err.response.data.error)
        })
    }

    const errorConfirmedHandler = () => {
        setMessage(null);
    }
    return (
        <>
            <h2>Books Details</h2>
            {documentDetails && documentDetails?.length ?
                <div className="dataList">
                    {documentDetails.map((item, index) => (
                        <Card key={index} item={item} cardType="documentDetails" reserveBook={reserveBook} borrowBook={borrowBook} />
                    ))}
                </div> :
                documentDetails?.length === 0 && <><p>All Documents are reserved or already booked</p> <p>Please comeback Later. Go to <Link to="/">Home</Link> Page</p> </>
            }
            <Modal
                show={message}
                modalClosed={errorConfirmedHandler}>
                {message}
            </Modal>
        </>
    )
};
const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId
    }
}
export default connect(mapStateToProps)(BookDetails);