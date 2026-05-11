export const HowWordsSection = () => {
  const steps = [
    {
      number: "1",
      title: "Sube tu Documento",
      desc: "Simplemente sube tus apuntes de clase, capítulos de libros de texto o cualquier material de estudio..",
    },
    {
      number: "2",
      title: "Elige tu Herramienta",
      desc: "Selecciona entre resúmenes, flashcards, cuestionarios o chatea con nuestra IA",
    },
    {
      number: "3",
      title: "Comienza a Estudiar",
      desc: "Obtén instantáneamente tus materiales generados y comienza tu sesión de estudio enfocada.",
    },
  ];

  return (
    <section
      id="steps"
      className="px-6 bg-gradient-to-r from-purple-50 to-purple-100"
    >
      <div className="max-w-7xl mx-auto py-28">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 text-primary">
            Cómo Funciona en 3 Sencillos Pasos
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 px-8">
          {steps.map((step) => (
            <div key={step.title} className="group">
              <div className="text-center flex flex-col items-center">
                <div className="text-4xl mb-4 bg-primary-light rounded-full size-16 flex items-center justify-center">
                  {step.number}
                </div>
                <h3 className="text-lg mb-2 font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
