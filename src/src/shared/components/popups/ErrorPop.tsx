
export const PopupEmailPassword = ({ onClose }: { onClose?: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50" style={{ backdropFilter: 'blur(8px)' }}>
    <div className="bg-white border border-violet-200 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex-1">
          ¡Completa todos los campos!
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-6">
        Debes escribir el <span className="font-semibold text-violet-700">email</span> y la <span className="font-semibold text-violet-700">contraseña</span>.
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          Entendido
        </button>
      )}
    </div>
  </div>
);

export const PopupPasswordMismatch = ({ onClose }: { onClose?: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50" style={{ backdropFilter: 'blur(8px)' }}>
    <div className="bg-white border border-violet-200 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex-1">
          ¡Las contraseñas no coinciden!
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-6">
        Deben coincidir las <span className="font-semibold text-violet-700">contraseñas</span>.
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          Entendido
        </button>
      )}
    </div>
  </div>
);
  