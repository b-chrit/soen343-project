import { Eye, UserX } from "lucide-react";

export default function AccountsTable({
  accounts = [],
  columns = [],
  onAccountClick,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const hasAccounts = accounts.length > 0;

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden w-full">
        {hasAccounts ? (
          <table className="w-full text-left table-fixed">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3 px-4 ${col.width || "w-auto"}`}>
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 w-1/12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {accounts.map((account, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-200 transition duration-200"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-3 px-4">
                      {col.render
                        ? col.render(account[col.accessor], account)
                        : account[col.accessor]}
                    </td>
                  ))}
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => onAccountClick(account)}
                      className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => console.log("Delete", account.id)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-800 transition"
                    >
                      <UserX className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center w-full">
            <UserX className="w-20 h-20 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Accounts Found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mb-4">
              We couldn’t find any accounts matching your search or filters.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-5 py-2 rounded-lg text-sm transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 border border-black"
            >
              Clear Filters & Refresh
            </button>
          </div>
        )}
      </div>

      {hasAccounts && (
        <div className="flex justify-start items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`py-2 px-4 rounded-lg transition-all duration-300 border
              ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
              }
            `}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`py-2 px-4 rounded-lg transition-all duration-300 border
                  ${
                    num === currentPage
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`py-2 px-4 rounded-lg transition-all duration-300 border
              ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
              }
            `}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
