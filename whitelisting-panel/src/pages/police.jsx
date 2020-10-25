import React, {useEffect} from 'react';
import { Link } from "react-router-dom"
import ReactPaginate from 'react-paginate';
import { debounce } from "lodash";

import { getPolice, searchPolice } from "../services/PoliceService";

const Police = () => {
    const [police, setPolice] = React.useState({
        count: 0,
        result: []
    })

    const [pageLength, setPageLength] = React.useState(10);
    const [page, setPage] = React.useState(1);

    const [query, setQuery] = React.useState("");
    
    useEffect(() => {
        if(query !== "") return
        const fetchPolice = async () => {
            const police = await getPolice(page, pageLength);

            setPolice(police)
        }
        fetchPolice()
    }, [page, pageLength, query]) // Any time the page, pageLength or query changes, this will run.

    useEffect(() => {
        if(!query) return
        const search = async (query) => {
            setPage(1)
            const result = await searchPolice(query, page, pageLength);
            if(result === []) return setPolice({
                count: 0,
                result: []
            })
            
            setPolice(result)
        }
        search(query)
    }, [query, page, pageLength]) //Will Run the code inside any time 'query' changes
    
    const debouncedSearch = debounce((searchTerm) => {
        setQuery(searchTerm);
    }, 1000); //Only search after 1s of no typing in search box

    return (
        <>
            <h1>Police</h1>
            Search for Police

            <div className="page-count">
                Page Length: 
                <select value={pageLength} onChange={(e) => setPageLength(parseInt(e.target.value))}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </div>

            <div className="search-input">
                <input type="text" placeholder="Search by Name" onChange={(e) => debouncedSearch(e.target.value)}/>
            </div>

            <div className="table">
                <div className="table-head">
                    <div>UID</div>
                    <div>Name</div>
                    <div>Cop Level</div>
                    <div>Department</div>
                </div>
                {
                    police.result.length > 0 ?
                    police.result.map(({uid, name, pid, coplevel, copdept}, idx) => (
                        <Link to={`/user/${pid}`} key={idx} className="table-row">
                            <div>{uid}</div>
                            <div>{name}</div>
                            <div>{coplevel}</div>
                            <div>{copdept}</div>
                        </Link>
                    )) :
                    <div className="table-row">
                        <div>No results found</div>
                    </div>
                }

                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(police.count / pageLength)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(e) => {setPage(e.selected + 1)}}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        </>
    )
}

export default Police;