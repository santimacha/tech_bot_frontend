export const FeaturesSection = () => {
  const benefits = [
    {
      icon: "📑",
      title: "Resumenes de documentos",
      desc: "Obtén las ideas clave de documentos largos en segundos.",
    },
    {
      icon: "📝",
      title: "Flashcards y Cuestionarios",
      desc: "Genera materiales de estudio automáticamente para poner a prueba tus conocimientos.",
    },
    {
      icon: "📚",
      title: "Chatbot de IA",
      desc: "Haz preguntas y obtén respuestas instantáneas sobre tus materiales de estudio.",
    },
    {
      icon: "📚",
      title: "Organizacion por Asignaturas",
      desc: "Mantén todas tus asignaturas y documentos organizados en un solo lugar.",
    },
  ];

  return (
    <section id="features" className="px-6">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-primary">
            Todo lo que necesitas para triunfar
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Nuestras herramientas impulsadas por IA están diseñadas para
            ayudarte a comprender temas complejos y retener la información de
            manera más efectiva.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4 px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="group">
              <div className="h-full bg-white/80 backdrop-blur-xl border-2 border-purple-200 hover:border-purple-300 rounded-2xl  shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="p-6 text-start">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg mb-2 font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
