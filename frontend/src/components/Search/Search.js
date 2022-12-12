import './Search.css';
import { useState } from 'react';
import axios from 'axios';
import Card from '../Card/Card';

const Search = (props) => {
    const [books, setBooks] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentFilter, setCurrentFilter] = useState('Title');
    const filterList = [
        {name:'Title', filterValue:'title'},
        {name:'Publisher', filterValue:'PUBLISHER'},
        {name:'Document ID', filterValue:'Doc_ID'},
    ]

    const getSearchParam = () => {
        if(currentFilter === 'Doc_ID') {
            return (Number(searchKeyword))
        }
        return searchKeyword;
    }

    const submitForm = (e) => {
        e.preventDefault();
        const searchParam = getSearchParam();
        const data = {
            "searchBy": currentFilter,
            "search": searchParam
        }
        console.log(data);
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
                <div className='showFilter'>
                    <div className='radioFilter'>
                        Filter By:
                        {filterList.map((filter, index) => (
                            <div key={index}>
                                <input checked={filter.filterValue === currentFilter} type='radio' value={filter.filterValue} id={filter.name} name='filterResults' onChange={(event) => setCurrentFilter(event.target.value)} />
                                <label htmlFor={filter.name}>{filter.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {books && books?.length ? 
                <div className="data-list">
                    {books.map((item, index) => (
                        <Card key={index} item={item} cardType="bookDetails"/>
                    ))}
                </div> : 
                books?.length === 0 && <p>No Results Found</p> 
            }
        </div>
    );
};

export default Search;

