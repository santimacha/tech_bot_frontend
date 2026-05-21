import { motion, AnimatePresence } from "motion/react"
import type { Flashcard } from "../../../../shared/interfaces/flashcards.interfaces"

interface FlashcardsTabProps {
    isLoadingFlashcards: boolean
    flashcardsExist: boolean | null
    flashcards: Flashcard[]
    onCreateFlashcards: () => void
    modalFlashcard: Flashcard | null
    onOpenModal: (flashcard: Flashcard) => void
    onCloseModal: () => void
}

export function FlashcardsTab({
    isLoadingFlashcards,
    flashcardsExist,
    flashcards,
    onCreateFlashcards,
    modalFlashcard,
    onOpenModal,
    onCloseModal,
}: FlashcardsTabProps) {
    return (
        <>
            <motion.div
                key="flashcards"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto"
            >
                <div className="p-4 space-y-4">
                    <div
                        className="bg-white rounded-lg p-4 border border-lavender"
                        style={{ boxShadow: "0 4px 6px -1px rgba(109, 40, 217, 0.1)" }}
                    >
                        <h4 className="font-medium text-text-dark mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Flashcards
                        </h4>

                        <div className="space-y-3">
                            {isLoadingFlashcards ? (
                                <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    {[0, 0.1, 0.2].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-16 bg-gradient-to-r from-lavender via-primary-light/30 to-lavender rounded"
                                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
                                            style={{ backgroundSize: "200% 100%" }}
                                        />
                                    ))}
                                    <motion.div
                                        className="flex items-center justify-center mt-4"
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <p className="text-primary text-sm font-medium">Generando flashcards...</p>
                                    </motion.div>
                                </motion.div>
                            ) : flashcardsExist === true && flashcards.length > 0 ? (
                                flashcards.map((flashcard, index) => (
                                    <motion.div
                                        key={index}
                                        className="p-3 border border-lavender rounded-lg bg-gray-50 hover:bg-lavender cursor-pointer transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        onClick={() => onOpenModal(flashcard)}
                                    >
                                        <p className="text-sm font-medium text-text-dark">{flashcard.question}</p>
                                        <p className="text-xs text-gray-500 mt-1 italic">(Haz clic para ver la respuesta)</p>
                                    </motion.div>
                                ))
                            ) : flashcardsExist === false ? (
                                <motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    <button
                                        onClick={onCreateFlashcards}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Generar Flashcards</span>
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Haz clic para crear flashcards del documento</p>
                                </motion.div>
                            ) : (
                                <motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                                    <p className="text-xs text-gray-500 mt-2">Verificando disponibilidad de flashcards...</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Flashcard Modal — renderizado fuera del aside en View_Document, se pasa por props */}
            <AnimatePresence>
                {modalFlashcard && (
                    <motion.div
                        key="flashcard-modal"
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/40"
                            onClick={onCloseModal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-lg p-6 z-10"
                            initial={{ y: 20, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 10, opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                        >
                            <button onClick={onCloseModal} className="absolute right-4 top-3 text-gray-500 hover:text-gray-700" aria-label="Cerrar">
                                ✕
                            </button>
                            <motion.h3
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                                className="text-2xl font-bold text-primary mb-3.5 text-center"
                            >
                                {modalFlashcard.question}
                            </motion.h3>
                            <hr className="bg-gray-300 border-0 h-0.5 mb-3.5 rounded-lg" />
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.2 }}
                                className="text-sm text-gray-700 leading-relaxed"
                            >
                                {modalFlashcard.answer}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}