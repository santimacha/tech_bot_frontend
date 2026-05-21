import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Enviroment } from "../../../../shared/utils/env/environment"
import { useAuth } from "../../../auth/context/AuthContext"

interface StudyPlanContent {
    objectives: string[]
    recommended_resources: string[]
    schedule: Record<string, string>
}

interface StudyPlanData {
    id: number
    title: string
    level: string
    content: StudyPlanContent
}

export function StudyPlan() {
    const [plan, setPlan] = useState<StudyPlanData | null>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [level, setLevel] = useState("intermedio")
    const { token } = useAuth()

    const documentId = Number(sessionStorage.getItem("documentId"))

    useEffect(() => {
        fetchPlan()
    }, [documentId])

    const fetchPlan = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${Enviroment.API_URL}/plan/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) setPlan(await res.json())
            else setPlan(null)
        } catch {
            setPlan(null)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            const res = await fetch(`${Enviroment.API_URL}/plan/${documentId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ level }),
            })
            if (res.ok) setPlan(await res.json())
        } catch (err) {
            console.error("Error generando plan:", err)
        } finally {
            setGenerating(false)
        }
    }

    const handleDelete = async () => {
        if (!plan) return
        try {
            await fetch(`${Enviroment.API_URL}/plan/${plan.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            setPlan(null)
        } catch (err) {
            console.error("Error eliminando plan:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        )
    }

    // Sin plan  de trabajo
    if (!plan) {
        return (
            <div className="space-y-3">
                <p className="text-xs text-gray-500">Genera un plan de estudio personalizado según tu nivel.</p>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nivel</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                    {generating ? (
                        <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Generando plan...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Generar Plan de Estudio
                        </>
                    )}
                </button>
            </div>
        )
    }

    // plan de trabajo
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Header del plan */}
            <div className="flex justify-between items-start gap-2">
                <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{plan.title}</p>
                    <span className="inline-block mt-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full capitalize">
                        {plan.level}
                    </span>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                >
                    Eliminar
                </button>
            </div>

            {/* Objetivos */}
            {plan.content.objectives?.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <span>📌</span> Objetivos
                    </p>
                    <ul className="space-y-1.5">
                        {plan.content.objectives.map((obj, i) => (
                            <li key={i} className="text-xs text-gray-600 flex gap-2">
                                <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
                                <span>{obj}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Cronograma */}
            {Object.keys(plan.content.schedule || {}).length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <span>📅</span> Cronograma
                    </p>
                    <div className="space-y-2">
                        {Object.entries(plan.content.schedule).map(([week, activity]) => (
                            <div key={week} className="bg-violet-50 border border-violet-100 rounded-lg p-2.5">
                                <p className="text-xs font-semibold text-violet-700 capitalize mb-0.5">
                                    {week.replace(/_/g, " ")}
                                </p>
                                <p className="text-xs text-gray-600">{activity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recursos */}
            {plan.content.recommended_resources?.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <span>📚</span> Recursos recomendados
                    </p>
                    <ul className="space-y-1.5">
                        {plan.content.recommended_resources.map((r, i) => (
                            <li key={i} className="text-xs text-gray-600 flex gap-2">
                                <span className="text-violet-400 flex-shrink-0 mt-0.5">→</span>
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Regenerar */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
                <p className="text-xs text-gray-500">¿Quieres un plan diferente?</p>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                </select>
                <button
                    onClick={async () => { await handleDelete(); await handleGenerate() }}
                    disabled={generating}
                    className="w-full py-1.5 border border-violet-300 text-violet-700 rounded-lg hover:bg-violet-50 transition text-xs font-medium disabled:opacity-50"
                >
                    {generating ? "Generando..." : "Regenerar Plan"}
                </button>
            </div>
        </motion.div>
    )
}