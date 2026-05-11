import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const HeroSection = () => {
  const heroRef = useRef(null);
  const Navigate = useNavigate();

  const goToLogin = () => {
    Navigate("/login");
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-purple-100"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center px-15">
        <div className="space-y-8">
          <h1 className="text-2xl lg:text-5xl font-bold leading-tight text-purple-700">
            Tu Compañero de
            <span className="block text-purple-500">Estudio IA Personal</span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
            Transforma tus documentos en resúmenes interactivos, flashcards y
            cuestionarios al instante. Estudia de forma inteligente, no más
            dura.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={goToLogin}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:bg-purple-700 text-white px-1 py-1.5 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Comienza gratis
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative">
            <img
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-2xl shadow-primary/20"
              data-alt="Foto del estudiante usuario Alex Johnson"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC57eFi2BDNEUQQrM7QAOnFO07Iqbu518vHds8dsIw8yznS3CZdTqwa_btZeKLvrkMSughYRf15Arak8ovBOKtST6PKnBZGH0r8TILWmNcCX7OMhV6SKFN87xe3lYF9PNhGUq_Vg2O4RQAvrIx3eHEO0rNKzqep5G_5JbsfWRo-m5YJ12sFMjKNkXui7DwVO73i5oe1iHeY7f0G5PilMPkhFlzFfP7xGnTbgKhKNm-5XuNoMAAzVb2wMUf_AdsrJqtQAxGJbq-OOp2e"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
