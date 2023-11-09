import React, { useState } from 'react';

const Table = ({ response, deleteNoteModal, editNote }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate pagination based on filtered data
  const filteredData = searchTerm !== '' && Array.isArray(response.rows) ? response.rows.filter((item) =>
    item[1].toLowerCase().includes(searchTerm.toLowerCase())
  ) : Array.isArray(response.rows) ? response.rows : [];

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate which page numbers to show
  const pageNumbers = [];
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 0 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleSearch}
        className="my-2 px-3 py-2 text-lg outline-none w-64 focus:ring-2 shadow-md shadow-gray-400 focus:ring-blue-300 rounded-full"
    />
    <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">S.No.</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
            .map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{row[1]}</td>
                <td className="border px-4 py-2">{row[2]}</td>
                <td className="border px-4 py-2 gap-5">
                    <i onClick={() => editNote(row[0])} className="fa-regular fa-pen-to-square text-blue-500 p-2 hover:scale-110 hover:cursor-pointer"></i>
                    <i onClick={() => deleteNoteModal(row[0])} className="fa-solid fa-trash text-red-500 p-2 hover:scale-110 hover:cursor-pointer"></i>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          className={`${
            currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
          } px-4 py-2 rounded-full`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; Prev
        </button>
        <div>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`${
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              } px-4 py-2 mx-2 rounded-full`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className={`${
            currentPage === totalPages
              ? 'bg-gray-300'
              : 'bg-blue-500 text-white'
          } px-4 py-2 rounded-full`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default Table;
