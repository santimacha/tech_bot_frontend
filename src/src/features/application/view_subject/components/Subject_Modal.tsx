import { motion, AnimatePresence } from "framer-motion";

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  newSubject: { name: string; description: string };
  setNewSubject: (subject: { name: string; description: string }) => void;
}

export function SubjectModal({
  isOpen,
  onClose,
  onSave,
  loading,
  newSubject,
  setNewSubject,
}: SubjectModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
          >
            <h2 className="text-2xl font-bold text-purple-primary mb-4">
              Agregar materia
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  placeholder="Ej: Matemáticas"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción de la materia"
                  className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px] focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
