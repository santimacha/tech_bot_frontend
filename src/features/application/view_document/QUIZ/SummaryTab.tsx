import { motion } from "motion/react"
import type { Summary } from "../../../../shared/interfaces/summary.interface"

interface SummaryTabProps {
    isLoading: boolean
    summaryExists: boolean | null
    summary: Summary
    onCreateSummary: () => void
}

export function SummaryTab({ isLoading, summaryExists, summary, onCreateSummary }: SummaryTabProps) {
    return (
        <motion.div
            key="summary"
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Resumen
                    </h4>

                    <div className="text-sm text-gray-700 space-y-2">
                        {isLoading ? (
                            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                {[null, "w-4/5", "w-3/4"].map((w, i) => (
                                    <motion.div
                                        key={i}
                                        className={`h-4 bg-gradient-to-r from-lavender via-primary-light/30 to-lavender rounded ${w ?? ""}`}
                                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
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
                                    <p className="text-primary text-sm font-medium">Generando resumen...</p>
                                </motion.div>
                            </motion.div>
                        ) : summaryExists === true ? (
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="leading-relaxed">
                                {summary.content || "No hay resumen disponible"}
                            </motion.p>
                        ) : summaryExists === false ? (
                            <motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                <button
                                    onClick={onCreateSummary}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Generar Resumen</span>
                                </button>
                                <p className="text-xs text-gray-500 mt-2">Haz clic para crear un resumen del documento</p>
                            </motion.div>
                        ) : (
                            <motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                                <p className="text-xs text-gray-500 mt-2">Verificando disponibilidad del resumen...</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}