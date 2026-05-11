import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useEffect, useState } from "react";
import { Enviroment } from "@/shared/utils/env/environment";

interface UserData {
  id: number;
  name: string;
  last_name: string;
  email: string;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [userDataResponse, setUserDataResponse] = useState<UserData | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await fetch(`${Enviroment.API_URL}/user/data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: UserData = await response.json();
        setUserDataResponse(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDataResponse(null);
      } finally {
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-light border-b border-lavender flex-shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-white">Teach bot</h1>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                to="#"
                className={`transition-colors ${
                  location.pathname === "/" ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/subject"
                className={`transition-colors ${
                  location.pathname === "/subject" ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                Mis Materias
              </Link>
              <Link
                to="/documents"
                className={`transition-colors ${
                  location.pathname === "/documents" ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                Ver Documentos
              </Link>
              <Link
                to="/statistics"
                className={`transition-colors ${
                  location.pathname === "/statistics" ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                Estadísticas
              </Link>
            </div>
          </div>          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3 relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{userDataResponse?.name} {userDataResponse?.last_name}</p>
                    <p className="text-white/70 text-xs">{userDataResponse?.email}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Menú desplegable */}
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{userDataResponse?.name} {userDataResponse?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{userDataResponse?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/profile/edit');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span>Editar perfil</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/profile/change-password');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                        </svg>
                        <span>Cambiar contraseña</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Cerrar Sesión"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span className="hidden sm:block text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

