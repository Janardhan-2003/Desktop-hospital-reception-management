import { useState } from "react";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

const PatientTable = ({ patients, onViewPatient, onDownloadExcel, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = patients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(patients.length / itemsPerPage);

  // Reset to first page when patients change
  useState(() => {
    setCurrentPage(1);
  }, [patients]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-GB");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  IP No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  S.No
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Age
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Place
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Referral Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Referral Phone
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    {loading ? "Loading patients..." : "No patients found"}
                  </td>
                </tr>
              ) : (
                currentPatients.map((patient, index) => (
                  <tr key={indexOfFirstItem + index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatDate(patient.date)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.ipNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.sNo}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {patient.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.age}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.phone || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.place}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.referralName || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {patient.referralPhone || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewPatient(patient)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Section: Download Button + Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            
            {/* Download Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onDownloadExcel}
                disabled={loading || patients.length === 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors space-x-2"
              >
                <Download size={16} />
                <span>
                  {loading ? 'Exporting...' : `Download Excel (${patients.length} entries)`}
                </span>
              </button>
              
              {/* Results info */}
              {patients.length > 0 && (
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, patients.length)} of {patients.length} entries
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;