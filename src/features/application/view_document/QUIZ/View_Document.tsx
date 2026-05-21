import Pdf_view from "../PDF/Pdf_view"
import { pdfjs } from "react-pdf"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

import { Chatbot } from "../../view_document/chat/Chat"
import { Quiz } from "../Quiz"
import { SummaryTab } from "./SummaryTab"
import { FlashcardsTab } from "./FlashcardsTab"
import { StudyPlan } from "./StudyPlan"

import { Enviroment } from "../../../../shared/utils/env/environment"
import { useAuth } from "../../../auth/context/AuthContext"
import type { Summary } from "../../../../shared/interfaces/summary.interface"
import type { Flashcard } from "../../../../shared/interfaces/flashcards.interfaces"

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()

type Tab = "summary" | "flashcards" | "quiz" | "chat" | "plan"

const TABS: { id: Tab; label: string; icon: string }[] = [
    {
        id: "summary",
        label: "Resumen",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
        id: "flashcards",
        label: "Tarjetas",
        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
        id: "quiz",
        label: "Quiz",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
        id: "plan",
        label: "Plan",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
        id: "chat",
        label: "Chat",
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    },
]

export function ViewDocument() {
    const documentId = Number(sessionStorage.getItem("documentId"))
    const { token } = useAuth()

    const [activeTab, setActiveTab] = useState<Tab>("summary")

    // Summary state
    const [summary, setSummary] = useState<Summary>({ content: "", document_id: 0, id: 0 })
    const [summaryExists, setSummaryExists] = useState<boolean | null>(null)
    const [isLoadingSummary, setIsLoadingSummary] = useState(false)

    // Flashcards 
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [flashcardsExist, setFlashcardsExist] = useState<boolean | null>(null)
    const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false)
    const [modalFlashcard, setModalFlashcard] = useState<Flashcard | null>(null)

    // Bootstrap de check summary - flashcards
    // Bootstrap de check summary - flashcards
useEffect(() => {
    if (!documentId) return

    const checkSummary = async () => {
        try {
            const res = await fetch(`${Enviroment.API_URL}/summary/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                setSummary(await res.json())
                setSummaryExists(true)
            } else if (res.status === 404) {
                setSummaryExists(false)
            }
        } catch {
            setSummaryExists(false)
        }
    }

    const checkFlashcards = async () => {
        try {
            const res = await fetch(`${Enviroment.API_URL}/flashcards/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setFlashcards(data)
                setFlashcardsExist(true)
            } else if (res.status === 404) {
                setFlashcardsExist(false)
            }
        } catch {
            setFlashcardsExist(false)
        }
    }

    checkSummary()
    checkFlashcards()
}, [documentId])

// Handler crear resumen
const handleCreateSummary = async () => {
    setIsLoadingSummary(true)
    try {
        const res = await fetch(`${Enviroment.API_URL}/summary/${documentId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        setSummary(await res.json())
        setSummaryExists(true)
    } catch {
        console.error("Error creating summary")
    } finally {
        setIsLoadingSummary(false)
    }
}

// Handler crear flashcards
const handleCreateFlashcards = async () => {
    setIsLoadingFlashcards(true)
    setFlashcardsExist(null)
    try {
        const res = await fetch(`${Enviroment.API_URL}/flashcards/generate/${documentId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()

        await new Promise((r) => setTimeout(r, 1500))

        const fetchRes = await fetch(`${Enviroment.API_URL}/flashcards/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (fetchRes.ok) {
            const data = await fetchRes.json()
            if (Array.isArray(data) && data.length > 0) {
                setFlashcards(data)
                setFlashcardsExist(true)
            } else {
                setFlashcardsExist(false)
            }
        } else {
            setFlashcardsExist(false)
        }
    } catch {
        setFlashcardsExist(false)
    } finally {
        setIsLoadingFlashcards(false)
    }
}
    // render
    return (
        <div className="flex h-screen bg-bg-light">
            {/* PDF viewer */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <Pdf_view />
            </main>

            {/* Study tools sidebar */}
            <aside className="w-80 bg-white border-l border-lavender flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 border-b border-lavender flex-shrink-0">
                    <h3 className="text-lg font-medium">Herramientas de Estudio</h3>
                </div>

                {/* Tab bar */}
                <div className="flex border-b border-lavender flex-shrink-0 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-3 py-3 text-xs font-medium transition-all whitespace-nowrap flex flex-col items-center gap-0.5 ${
                                activeTab === tab.id
                                    ? "border-b-2 border-primary text-primary bg-lavender/10"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === "summary" && (
                            <SummaryTab
                                isLoading={isLoadingSummary}
                                summaryExists={summaryExists}
                                summary={summary}
                                onCreateSummary={handleCreateSummary}
                            />
                        )}

                        {activeTab === "flashcards" && (
                            <FlashcardsTab
                                isLoadingFlashcards={isLoadingFlashcards}
                                flashcardsExist={flashcardsExist}
                                flashcards={flashcards}
                                onCreateFlashcards={handleCreateFlashcards}
                                modalFlashcard={modalFlashcard}
                                onOpenModal={setModalFlashcard}
                                onCloseModal={() => setModalFlashcard(null)}
                            />
                        )}

                        {activeTab === "quiz" && (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full overflow-y-auto"
                            >
                                <div className="p-4">
                                    <div
                                        className="bg-white rounded-lg p-4 border border-lavender"
                                        style={{ boxShadow: "0 4px 6px -1px rgba(109, 40, 217, 0.1)" }}
                                    >
                                        <h4 className="font-medium text-text-dark mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Quiz
                                        </h4>
                                        <Quiz />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "plan" && (
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full overflow-y-auto"
                            >
                                <div className="p-4">
                                    <div
                                        className="bg-white rounded-lg p-4 border border-lavender"
                                        style={{ boxShadow: "0 4px 6px -1px rgba(109, 40, 217, 0.1)" }}
                                    >
                                        <h4 className="font-medium text-text-dark mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Plan de Estudio
                                        </h4>
                                        <StudyPlan />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "chat" && (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <Chatbot />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>
        </div>
    )
}