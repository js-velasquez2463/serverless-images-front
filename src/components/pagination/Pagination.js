import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const Pagination = ({ currentPage, onPageChange, totalPages }) => {

    return (
        <div className="container mt-5">
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(Math.max(1, currentPage - 1))}>Previous</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>Next</button>
                    </li>
                </ul>
            </nav>
            <div className="text-center mt-4">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};

export default Pagination;
