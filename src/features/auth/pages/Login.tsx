import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PopupEmailPassword,
  PopupPasswordMismatch,
} from "@/shared/components/popups/ErrorPop";
import {
  PopupUserCreated,
  PopupLoginSuccess,
} from "@/shared/components/popups/ConfirmPop";
import { Enviroment } from "@/shared/utils/env/environment";
import type {
  LoginRequest,
  LoginResponse,
} from "@/shared/interfaces/login.interface";
import type { User } from "@/shared/interfaces/user.interface";
import { motion } from "framer-motion";

type Data = {
  name?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Data>({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showEmailPasswordPopup, setShowEmailPasswordPopup] = useState(false);
  const [showPasswordMismatchPopup, setShowPasswordMismatchPopup] = useState(false);
  const [showUserCreatedPopup, setShowUserCreatedPopup] = useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((s) => ({ ...s, [name]: value }));
  };

  const resetForm = () => {
    setData({ name: "", lastName: "", email: "", password: "", confirmPassword: "" });
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${Enviroment.API_URL}/auth/google`,
      "google-login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        return;
      }
      try {
        const popupUrl = popup?.location?.href ?? "";
        if (popupUrl.includes(window.location.origin)) {
          const bodyText = popup?.document?.body?.innerText ?? "";
          if (bodyText) {
            const data = JSON.parse(bodyText);
            if (data.accessToken) {
              login({ accessToken: data.accessToken });
              popup?.close();
              clearInterval(timer);
              navigate("/subject");
            }
          }
        }
      } catch {
        
      }
    }, 500);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!data.email || !data.password) {
      setShowEmailPasswordPopup(true);
      setTimeout(() => setShowEmailPasswordPopup(false), 3000);
      return;
    }

    if (!isLogin && data.password !== data.confirmPassword) {
      setShowPasswordMismatchPopup(true);
      setTimeout(() => setShowPasswordMismatchPopup(false), 3000);
      return;
    }

    setLoading(true);

    try {
      if (!isLogin) {
        // REGISTRO
        const registerData: User = {
          name: data.name!,
          lastName: data.lastName!,
          email: data.email,
          password: data.password,
        };

        const registerRes = await fetch(`${Enviroment.API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(registerData),
        });

        if (!registerRes.ok) {
          const err = await registerRes.json().catch(() => ({}));
          throw new Error(err?.message ?? "Error en el registro");
        }

        const registerResult: LoginResponse = await registerRes.json();
        login(registerResult);

        setShowUserCreatedPopup(true);
        setTimeout(() => setShowUserCreatedPopup(false), 3000);
        setTimeout(() => navigate("/subject"), 3000);

      } else {
        // LOGIN
        const loginData: LoginRequest = {
          email: data.email,
          password: data.password,
        };

        const loginRes = await fetch(`${Enviroment.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(loginData),
        });

        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => ({}));
          throw new Error(err?.message ?? "Credenciales incorrectas");
        }

        const loginResult = await loginRes.json();

        if (loginResult.twoFactorRequired) {
          throw new Error("Se requiere verificación de dos factores");
        }

        const response: LoginResponse = { accessToken: loginResult.accessToken };
        login(response);

        setShowLoginSuccessPopup(true);
        setTimeout(() => setShowLoginSuccessPopup(false), 5000);
        setTimeout(() => navigate("/subject"), 3000);
      }
    } catch (err) {
      setShowEmailPasswordPopup(true);
      setTimeout(() => setShowEmailPasswordPopup(false), 3000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex bg-violet-100 rounded-xl p-1 mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => { resetForm(); setIsLogin(true); }}
            className={
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all " +
              (isLogin ? "bg-white text-violet-700 shadow-sm" : "text-violet-600 hover:text-violet-700")
            }
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { resetForm(); setIsLogin(false); }}
            className={
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all " +
              (!isLogin ? "bg-white text-violet-700 shadow-sm" : "text-violet-600 hover:text-violet-700")
            }
          >
            Registrarse
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/80 backdrop-blur border border-violet-200 shadow-xl rounded-2xl"
        >
          <div className="p-6 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {isLogin ? "Accede con tus credenciales" : "Completa los datos para registrarte"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {!isLogin && (
                <>
                  <InputField label="Nombre completo" name="name" type="text" value={data.name} onChange={handleChange} />
                  <InputField label="Apellido" name="lastName" type="text" value={data.lastName} onChange={handleChange} />
                </>
              )}

              <InputField label="Correo electrónico" name="email" type="email" value={data.email} onChange={handleChange} />
              <InputField label="Contraseña" name="password" type="password" value={data.password} onChange={handleChange} />

              {!isLogin && (
                <InputField label="Confirmar contraseña" name="confirmPassword" type="password" value={data.confirmPassword} onChange={handleChange} />
              )}

              {isLogin && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {showEmailPasswordPopup && <PopupEmailPassword onClose={() => setShowEmailPasswordPopup(false)} />}
              {showPasswordMismatchPopup && <PopupPasswordMismatch onClose={() => setShowPasswordMismatchPopup(false)} />}
              {showUserCreatedPopup && <PopupUserCreated onClose={() => setShowUserCreatedPopup(false)} />}
              {showLoginSuccessPopup && <PopupLoginSuccess onClose={() => setShowLoginSuccessPopup(false)} />}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 px-4 mt-5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </motion.button>

              {isLogin && (
                <>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-violet-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white/80 px-3 text-gray-400">o continúa con</span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-violet-200 bg-white hover:bg-violet-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </motion.button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InputField({ label, name, type, value, onChange }: {
  label: string;
  name: string;
  type: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
      />
    </motion.div>
  );
}