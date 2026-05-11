import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { PublicRoute } from "@/app/routes/PublicRoute";
import { RootRedirect } from "@/app/routes/RootRedirect";
import Layout from "@/shared/layout/Layout";
import Landing from "@/features/landing/pages/Landing";
import Login from "@/features/auth/pages/Login";

import UploadDocument from "@/features/application/upload_document/Upload_Document";
import { Statistics } from "@/features/application/statistics_user/statistics_user";
import  {ViewDocument}  from "@/features/application/view_document/QUIZ/View_Document";
import { ViewSubject } from "@/features/application/view_subject/View_Subject";
import ProfileEdit from "@/features/application/profile/profileEdit";
import ProfileChangePass from "@/features/application/profile/profileChangePass";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/landing"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          {/* Ruta para el login - PÚBLICA */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout showSidebar={false} showNavbar={false}>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />

          <Route
            path="/subject"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <ViewSubject />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta para subir documentos (con sidebar) - PROTEGIDA */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <UploadDocument />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta para visualizar los documentos - PROTEGIDA */}
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <ViewDocument />
                </Layout>
              </ProtectedRoute>
            }
          />          {/* Ruta para las estadísticas - PROTEGIDA */}
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <Statistics />
                </Layout>
              </ProtectedRoute>
            }
          
          />

          {/* Ruta para editar perfil - PROTEGIDA */}
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <ProfileEdit />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta para cambiar contraseña - PROTEGIDA */}
          <Route
            path="/profile/change-password"
            element={
              <ProtectedRoute>
                <Layout showSidebar={false}>
                  <ProfileChangePass />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto - redirige según autenticación */}
          <Route path="/" element={<RootRedirect />} />

          {/* Ruta 404 - página no encontrada */}
          <Route
            path="*"
            element={
              <Layout showSidebar={false} showNavbar={false}>
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-600">404</h1>
                  <p>Página no encontrada</p>
                </div>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
