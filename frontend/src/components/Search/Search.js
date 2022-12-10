import './Serch.css';
import { useState } from 'react';
import axios from 'axios';

const Search = (props) => {
    const [books, setBooks] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('title');

    const submitForm = (e) => {
        e.preventDefault();
        const data = {
            "searchBy": currentFilter,
            "search": searchKeyword
        }
        axios.post('http://localhost:3000/reader/search', data).then(resp=>{
            console.log(resp);
            if(resp.status === 200) {
                setBooks(resp.data.result);
            }
        })
    }

    return (
        <div className="filter">
            <div className="search-outer">
                <button className='FilterButton' onClick={() => setShowFilter(prevState => !prevState)}><img src="https://img.icons8.com/material-sharp/24/null/sorting-options.png" alt="Filters"/></button>
                <form
                    role="search"
                    method="get"
                    id="searchform"
                    className="searchform">
                    {/* input field activates onKeyUp function on state change */}
                    <input
                        type="search"
                        onChange={(e)=>setSearchKeyword(e.target.value)}
                        name="search"
                        id="s"
                        placeholder="Search"
                        value={searchKeyword}
                    />
                    <button type="submit" id="searchsubmit" onClick={submitForm}>
                        <img src="https://img.icons8.com/ios-glyphs/30/null/search--v1.png" alt="SEARCH iCON" />
                    </button>
                </form>
                {showFilter && <div className='showFilter'>
                    <div className='radioFilter'>
                        <div>
                            <input checked type='radio' value='title' id='title' name='filterResults' onChange={(event) => setCurrentFilter(event.target.value)} />
                            <label htmlFor='title'>Title</label>
                        </div>
                        <div>
                            <input type='radio' value='author' id='author' name='filterResults' onChange={(event) => this.setCurrentFilter(event.target.value)} />
                            <label htmlFor='author'>Author</label>
                        </div>
                        <div>
                            <input type='radio' value='vote' id='vote' name='filterResults' onChange={(event) => this.setCurrentFilter(event.target.value)} />
                            <label htmlFor='vote'>Vote</label>
                        </div>
                    </div>
                </div>}
            </div>
            <ul className="data-list">
                {/* post items mapped in a list linked to onKeyUp function */}
                {books && books?.length && books.map((item, index) => (
                    <li key={item.id} className=''>
                        <a className="title" href={item.link}>
                            <h3>{item.Title}</h3>
                        </a>
                        <a className="link" href={item.link}>
                            Read more
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;

