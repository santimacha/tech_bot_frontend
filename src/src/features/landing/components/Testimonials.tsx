export const TestimonialsSection = () => {
  return (
    <section className="py-28 pt-20 bg-white" id="testimonials">
      <h2 className="text-4xl font-bold text-center text-purple-700 mb-12">
        Amado por Estudiantes
      </h2>
      <div className="grid max-w-6xl mx-auto px-10 text-center">
        <div className="bg-purple-50 shadow-lg rounded-2xl p-6">
          <p className="text-gray-700 italic mb-6">
            "Teach Bot ha cambiado las reglas del juego para mi preparación de
            exámenes. Los resúmenes de IA me ahorran horas, y los cuestionarios
            son perfectos para probar mis conocimientos. ¡No puedo imaginar
            estudiar sin él!"
          </p>
          <div className="flex items-center justify-center gap-4">
            <img
              src={`https://i.pravatar.cc/150?img=1`}
              alt="user"
              className="w-12 h-12 rounded-full"
            />
            <span className="font-semibold text-purple-700 text-lg">Alex</span>
          </div>
        </div>
      </div>
    </section>
  );
};
