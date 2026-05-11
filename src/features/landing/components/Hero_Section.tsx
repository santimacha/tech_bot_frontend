import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import robotHero from "../../../assets/imagenes/imagen1.png"; 

export const HeroSection = () => {
  const heroRef = useRef(null);
  const Navigate = useNavigate();

  const goToLogin = () => {
    Navigate("/login");
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#FDF9FF] overflow-hidden pt-28 pb-16"
    >
      <div className="max-w-[1440px] w-full mx-auto px-10 md:px-20 lg:px-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          
          {/* --- COLUMNA IZQUIERDA: TEXTO --- */}
          <div className="space-y-10 text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl lg:text-[56px] font-black leading-tight text-purple-700 tracking-tight max-w-[600px]">
              Tu Compañero de
              <span className="block text-purple-500">Estudio IA Personal</span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed font-normal max-w-[500px]">
              Transforma tus documentos en resúmenes interactivos, 
              flashcards y cuestionarios al instante. Estudia de forma 
              inteligente, no más dura.
            </p>

            <div className="w-full flex justify-center md:justify-start">
              <Button
                onClick={goToLogin}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white 
                           px-10 py-5 text-xl font-bold rounded-xl 
                           shadow-2xl shadow-purple-500/10 
                           transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Comienza gratis
              </Button>
            </div>
          </div>
          
          {/* --- COLUMNA DERECHA: IMAGEN (ROBOT) --- */}
          <div className="flex justify-center items-center bg-transparent"> 
            {/* He eliminado el div absoluto de "luz de fondo" y el relative innecesario.
               Si la imagen sigue teniendo el cuadro blanco, es probable que el archivo
               imagen1.png no sea realmente transparente. 
            */}
            <img
              className="w-full max-w-[500px] h-auto object-contain animate-float"
              alt="Robot Asistente IA Personal"
              src={robotHero}
            />
          </div>

        </div>
      </div>
    </section>
  );
};