import { Link } from 'react-router-dom';
import Button from '../UI/Button/Button';
import './Card.css';

const Card = (props) => {
    const { item, cardType } = props;
    const docId = item.Doc_ID
    return (
        <div className="card">
            {cardType === 'bookDetails' && <Link to={`/book/${docId}`}>
                <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                <div className="card-body">
                    <h3>{item.Title}</h3>
                    <p className="cardDes">Publishing Date: {new Date(item.PDate).toDateString()}</p>
                    <h5>Publisher ID: {item.Publisher_ID}</h5>
                </div>
            </Link>}
            {cardType === 'documentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3>Library: {item.Name}, {item.Location} </h3>
                        <p className="cardDes">Available: {item.Available}</p>
                        <h5>Copy Number: {item.Copy_No}</h5>
                        <div className='btn-container'>
                            <Button type="button" btnType="reserve" clicked={() => props.reserveBook(item.UUID)}>Reserve</Button>
                            <Button type="button" btnType="borrow" clicked={() => props.borrowBook(item.UUID)}>Checkout</Button>
                        </div>
                    </div>
                </>
            }
            {cardType === 'returnedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3>Book Name:
                            {/* {item.Title} */}
                        </h3>
                        <h3>Library: {item.Name}, {item.Location} </h3>
                        <p className="cardDetail">Booked Date: {new Date(item.BDTime).toUTCString()}</p>
                        <p className="cardDetail">Returned Date: {new Date(item.RDTime).toUTCString()}</p>
                        <h5 className="cardDetail">Fine: ${item.Fine}</h5>
                    </div>
                </>
            }
            {cardType === 'reservedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3>Book Name:
                            {/* {item.Title} */}
                        </h3>
                        <h3>Library: {item.Name}, {item.Location} </h3>
                        <p className="cardDetail">Current Date: {new Date(item.DTime).toUTCString()}</p>
                        <p className="cardDetail">Fine: ${item.Fine}</p>
                        <div className='btn-container'>
                            <Button type="button" btnType="borrow" clicked={() => props.borrowBook(item.UUID)}>Return</Button>
                        </div>
                    </div>
                </>
            }
            {cardType === 'borrowedDocumentDetails' &&
                <>
                    <img src={`${process.env.PUBLIC_URL + '/icons8-literature-64.png'}`} alt={item.Title} />
                    <div className="card-body">
                        <h3>Book Name:
                            {/* {item.Title} */}
                        </h3>
                        <h3>Library: {item.Name}, {item.Location} </h3>
                        <p className="cardDetail">Booked Date: {new Date(item.BDTime).toUTCString()}</p>
                        <p className="cardDetail">Fine: ${item.Fine}</p>
                        <div className='btn-container'>
                            <Button type="button" btnType="borrow" clicked={() => props.borrowBook(item.UUID)}>Returrn</Button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Card;