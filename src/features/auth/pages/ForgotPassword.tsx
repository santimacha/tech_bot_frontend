import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Enviroment } from "@/shared/utils/env/environment";

type Step = "email" | "otp" | "newPassword" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendEmail = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${Enviroment.API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Error al enviar el correo");
      setStep("otp");
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${Enviroment.API_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw new Error("OTP inválido o expirado");
      const data = await res.json();
      setResetToken(data.resetToken); // el backend devuelve un resetToken
      setStep("newPassword");
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${Enviroment.API_URL}/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cambiar la contraseña");
      setStep("done");
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-purple-700">Recuperar contraseña</h2>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">{error}</p>}

        {step === "email" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Ingresa tu email y te enviaremos un código.</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none" />
            <button onClick={handleSendEmail} disabled={loading || !email}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Revisa tu correo e ingresa el código.</p>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="Código OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-center tracking-widest text-lg" />
            <button onClick={handleVerifyOtp} disabled={loading || !otp}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </div>
        )}

        {step === "newPassword" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Ingresa tu nueva contraseña.</p>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none" />
            <button onClick={handleResetPassword} disabled={loading || newPassword.length < 8}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <p className="text-gray-700">Contraseña cambiada exitosamente.</p>
            <button onClick={() => navigate("/login")}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
              Ir al login
            </button>
          </div>
        )}

        {step !== "done" && (
          <button onClick={() => navigate("/login")} className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">
            ← Volver al login
          </button>
        )}
      </div>
    </div>
  );
}