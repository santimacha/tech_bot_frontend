export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-lavender">
      <div className="p-6">
        <h2 className="text-lg font-medium text-primary mb-4">Materias</h2>
        
        <div className="space-y-3">
          {/* Materia 1 */}
          <div
            className="group bg-white border border-lavender rounded-lg p-4 hover:shadow-lg transition-all duration-200"
            style={{boxShadow: '0 4px 6px -1px rgba(109, 40, 217, 0.1)'}}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-dark">Matemáticas</span>
              <div
                className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button className="text-gray-400 hover:text-primary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">3 documentos</p>
          </div>

          {/* Materia 2 */}
          <div
            className="group bg-white border border-lavender rounded-lg p-4 hover:shadow-lg transition-all duration-200"
            style={{boxShadow: '0 4px 6px -1px rgba(109, 40, 217, 0.1)'}}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-dark">Física</span>
              <div
                className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button className="text-gray-400 hover:text-primary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">1 documento</p>
          </div>

          {/* Agregar nueva materia */}
          <button
            className="w-full border-2 border-dashed border-lavender rounded-lg p-4 text-gray-500 hover:border-primary-light hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span>Agregar materia</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}