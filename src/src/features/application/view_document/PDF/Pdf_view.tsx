import { Document, Page, pdfjs } from "react-pdf"
import { Enviroment } from "@/shared/utils/env/environment"
import { useEffect, useState, useCallback } from "react"
import { motion } from "motion/react"
// @ts-ignore
import "react-pdf/dist/Page/AnnotationLayer.css"
// @ts-ignore
import "react-pdf/dist/Page/TextLayer.css"
import { useAuth } from "../../../auth/context/AuthContext"


pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()

export default function Pdf_view() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(0.75)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = useAuth()

  const documentId = Number(sessionStorage.getItem("documentId"))

  useEffect(() => {
    let isMounted = true
    let objectUrl: string | null = null

    const fetchDocument = async () => {
      if (!documentId || !token) {
        setError("Faltan datos de autenticación o documento")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${Enviroment.API_URL}/documents/view/${documentId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error al obtener documento: ${response.status}`)
        }

        const blob = await response.blob()

        if (!isMounted) {
          return
        }

        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching document:", err)
        if (isMounted) {
          setError("Error al cargar el documento")
          setIsLoading(false)
        }
      }
    }

    fetchDocument()

    return () => {
      isMounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [documentId, token])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setCurrentPage(1)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error)
    setError("Error al cargar el PDF")
  }, [])

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= numPages) {
        setCurrentPage(pageNumber)
      }
    },
    [numPages],
  )

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages))
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3.0))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1.0)
  }, [])

  const width = Math.min(1200 * scale, window.innerWidth - 80)

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar el documento</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <svg
            className="animate-spin h-12 w-12 text-primary mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-600">Cargando documento...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center transition-all duration-200 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: currentPage <= 1 ? 0 : -2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </motion.svg>
            Anterior
          </motion.button>

          <motion.div
            className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-700 font-medium">Página</span>
            <motion.input
              type="number"
              min="1"
              max={numPages}
              value={currentPage}
              onChange={(e) => goToPage(Number.parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              whileFocus={{ scale: 1.05 }}
            />
            <span className="text-gray-700 font-medium">de {numPages}</span>
          </motion.div>

          <motion.button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center transition-all duration-200 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Siguiente
            <motion.svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: currentPage >= numPages ? 0 : 2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>

        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.button
            onClick={zoomOut}
            className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all duration-200"
            title="Alejar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </motion.button>

          <motion.button
            onClick={resetZoom}
            className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {Math.round(scale * 100)}%
          </motion.button>

          <motion.button
            onClick={zoomIn}
            className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all duration-200"
            title="Acercar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-2">
        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                }
                error={<div className="text-center p-8 text-red-500">Error al cargar el documento</div>}
              >
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="shadow-2xl rounded-lg overflow-hidden"
                >
                  <Page
                    pageNumber={currentPage}
                    width={width}
                    className="bg-white"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div
                        className="flex items-center justify-center p-8 bg-white"
                        style={{ width, height: width * 1.414 }}
                      >
                        <svg
                          className="animate-spin h-8 w-8 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    }
                  />
                </motion.div>
              </Document>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 flex justify-center items-center shadow-sm flex-shrink-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.span
          key={`${currentPage}-${numPages}-${scale}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          Mostrando página {currentPage} de {numPages} • Zoom: {Math.round(scale * 100)}%
        </motion.span>
      </motion.div>
    </motion.div>
  )
}