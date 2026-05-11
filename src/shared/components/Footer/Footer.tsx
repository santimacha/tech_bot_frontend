export default function Footer({ isLanding = false }: { isLanding?: boolean }) {
  const navigation = [
    {
      url: "features",
      name: "Beneficios",
    },
    {
      url: "steps",
      name: "Pasos",
    },
    {
      url: "testimonials",
      name: "Testimonios",
    },
  ];
  return (
    <footer className="bg-white border-t border-lavender flex-shrink-0">
      <div className="max-w-7xl mx-auto px-10 py-5 lg:px-20">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-8">
          {/* Nombre + descripción en una sola línea en pantallas grandes */}
          <div className="flex flex-col md:flex-row items-center justify-center text-center gap-10">
            <h3 className="text-4xl font-bold text-primary">TeachBot</h3>
            <p className="text-gray-600 leading-relaxed max-w-sm text-sm md:text-left">
              Plataforma inteligente para la gestión y análisis de documentos
              académicos. Optimiza tu aprendizaje con IA.
            </p>
          </div>

          {/* Navegación */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-text-dark uppercase tracking-wider">
              Navegación
            </h3>

            <ul className="mt-4 space-y-3">
              {isLanding
                ? navigation.map((link) => (
                    <li key={link.url}>
                      <a
                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                        href={`#${link.url}`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>

        <div className="border-t border-lavender pt-8 mt-8">
          <p className="text-xs text-gray-600 text-center">
            © 2025 Leviatan. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
