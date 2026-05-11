export const PopupUserCreated = ({ onClose }: { onClose?: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50" style={{ backdropFilter: 'blur(8px)' }}>
    <div className="bg-white border border-green-200 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            ¡Cuenta creada!
          </h2>
        </div>
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
        Tu cuenta ha sido creada exitosamente. Ya puedes <span className="font-semibold text-green-700">iniciar sesión</span>.
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Continuar
        </button>
      )}
    </div>
  </div>
);

export const PopupLoginSuccess = ({ onClose, userName }: { onClose?: () => void; userName?: string }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50" style={{ backdropFilter: 'blur(8px)' }}>
    <div className="bg-white border border-violet-200 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            ¡Bienvenido!
          </h2>
        </div>
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
        {userName ? `Hola ${userName}, ` : 'Has iniciado sesión '}
        <span className="font-semibold text-violet-700">correctamente</span>. Redirigiendo...
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        >
          Continuar
        </button>
      )}
    </div>
  </div>
);