import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Enviroment } from "@/shared/utils/env/environment";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface RecentAttempt {
  quiz_id: number;
  score: number;
  time_taken: number;
  completed_at: string;
}

interface UserStatistics {
  total_quizzes: number;
  average_score: number;
  total_time: number;
  best_score: number;
  worst_score: number;
  recent_attempts: RecentAttempt[];
}

interface SubjectProgress {
  average_score: number;
  document_id: number;
  subject_id: number;
  total_attempts: number;
}

export function Statistics() {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataStatistics = async () => {
      try {
        const res = await fetch(
          `${Enviroment.API_URL}/statistics/user_statistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al obtener estadísticas");
        const data = await res.json();
        console.log(data);
        setStatistics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchUserProgressBySubject = async () => {
      try {
        const res = await fetch(
          `${Enviroment.API_URL}/statistics/subject/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al obtener progreso por materia");
        const data = await res.json();
        console.log(data);
        setSubjectProgress(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchUserDataStatistics();
      fetchUserProgressBySubject();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No hay estadísticas disponibles</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Estadísticas de Aprendizaje
          </h1>
          <p className="text-gray-600">
            Tu progreso y desempeño en los quizzes
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Quizzes Completados
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {statistics.total_quizzes}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Average Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio</p>
                <p className="text-3xl font-bold text-gray-800">
                  {statistics.average_score.toFixed(2)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Best Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mejor Puntaje</p>
                <p className="text-3xl font-bold text-gray-800">
                  {statistics.best_score.toFixed(2)}%
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Total Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tiempo Total</p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatTime(statistics.total_time)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Evolution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Evolución de Puntajes
            </h2>
            <Chart
              options={
                {
                  chart: {
                    type: "line",
                    toolbar: { show: false },
                    zoom: { enabled: false },
                  },
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  colors: ["#6D28D9"],
                  xaxis: {
                    categories: statistics.recent_attempts.map(
                      (_, index) => `Intento ${index + 1}`
                    ),
                    labels: {
                      style: {
                        colors: "#6B7280",
                      },
                    },
                  },
                  yaxis: {
                    min: 0,
                    max: 100,
                    labels: {
                      style: {
                        colors: "#6B7280",
                      },
                      formatter: (value) => `${value}%`,
                    },
                  },
                  grid: {
                    borderColor: "#E5E7EB",
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `${value}%`,
                    },
                  },
                  markers: {
                    size: 5,
                    colors: ["#6D28D9"],
                    strokeColors: "#fff",
                    strokeWidth: 2,
                  },
                } as ApexOptions
              }
              series={[
                {
                  name: "Puntaje",
                  data: statistics.recent_attempts.map(
                    (attempt) => attempt.score
                  ),
                },
              ]}
              type="line"
              height={300}
            />
          </motion.div>

          {/* Score Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Distribución de Calificaciones
            </h2>
            <Chart
              options={
                {
                  chart: {
                    type: "donut",
                  },
                  labels: [
                    "Excelente (≥70%)",
                    "Bueno (50-69%)",
                    "Necesita Mejorar (<50%)",
                  ],
                  colors: ["#10B981", "#F59E0B", "#EF4444"],
                  legend: {
                    position: "bottom",
                    labels: {
                      colors: "#6B7280",
                    },
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "70%",
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: "Total",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#374151",
                          },
                        },
                      },
                    },
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${Math.round(Number(val))}%`,
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `${value} quizzes`,
                    },
                  },
                } as ApexOptions
              }
              series={[
                statistics.recent_attempts.filter((a) => a.score >= 70).length,
                statistics.recent_attempts.filter(
                  (a) => a.score >= 50 && a.score < 70
                ).length,
                statistics.recent_attempts.filter((a) => a.score < 50).length,
              ]}
              type="donut"
              height={300}
            />
          </motion.div>

          {/* Time Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tiempo por Quiz
            </h2>
            <Chart
              options={
                {
                  chart: {
                    type: "bar",
                    toolbar: { show: false },
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 8,
                      horizontal: false,
                      columnWidth: "60%",
                    },
                  },
                  colors: ["#8B5CF6"],
                  xaxis: {
                    categories: statistics.recent_attempts.map(
                      (_, index) => `Intento ${index + 1}`
                    ),
                    labels: {
                      style: {
                        colors: "#6B7280",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: "#6B7280",
                      },
                      formatter: (value) => {
                        const minutes = Math.floor(value / 60);
                        const seconds = value % 60;
                        return `${minutes}m ${seconds}s`;
                      },
                    },
                  },
                  grid: {
                    borderColor: "#E5E7EB",
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => {
                        const minutes = Math.floor(value / 60);
                        const seconds = value % 60;
                        return `${minutes}m ${seconds}s`;
                      },
                    },
                  },
                } as ApexOptions
              }
              series={[
                {
                  name: "Tiempo",
                  data: statistics.recent_attempts.map(
                    (attempt) => attempt.time_taken
                  ),
                },
              ]}
              type="bar"
              height={300}
            />
          </motion.div>

          {/* Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Comparación de Rendimiento
            </h2>
            <Chart
              options={
                {
                  chart: {
                    type: "radar",
                    toolbar: { show: false },
                  },
                  xaxis: {
                    categories: [
                      "Mejor Puntaje",
                      "Promedio",
                      "Peor Puntaje",
                      "Consistencia",
                      "Eficiencia",
                    ],
                    labels: {
                      style: {
                        colors: [
                          "#6B7280",
                          "#6B7280",
                          "#6B7280",
                          "#6B7280",
                          "#6B7280",
                        ],
                      },
                    },
                  },
                  yaxis: {
                    show: false,
                    min: 0,
                    max: 100,
                  },
                  fill: {
                    opacity: 0.2,
                  },
                  stroke: {
                    show: true,
                    width: 2,
                    colors: ["#6D28D9"],
                  },
                  markers: {
                    size: 4,
                    colors: ["#6D28D9"],
                  },
                  colors: ["#6D28D9"],
                } as ApexOptions
              }
              series={[
                {
                  name: "Tu Rendimiento",
                  data: [
                    statistics.best_score,
                    statistics.average_score,
                    statistics.worst_score,
                    // Consistencia: qué tan cerca está el promedio del mejor puntaje
                    Math.max(
                      0,
                      100 -
                        Math.abs(
                          statistics.best_score - statistics.average_score
                        )
                    ),
                    // Eficiencia: inverso del tiempo promedio normalizado (asumiendo max 10 minutos)
                    Math.max(
                      0,
                      100 -
                        (statistics.total_time /
                          statistics.total_quizzes /
                          600) *
                          100
                    ),
                  ],
                },
              ]}
              type="radar"
              height={300}
            />
          </motion.div>
        </div>

        {/* Subject Progress Section */}
        {subjectProgress.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-6 mt-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Progreso por Materia
              </h2>
              <p className="text-gray-600">
                Tu desempeño en cada materia y documento
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Subject Progress Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Promedio por Materia
                </h2>
                <Chart
                  options={
                    {
                      chart: {
                        type: "bar",
                        toolbar: { show: false },
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: true,
                          dataLabels: {
                            position: "top",
                          },
                        },
                      },
                      colors: ["#10B981"],
                      xaxis: {
                        categories: subjectProgress.map(
                          (_, index) => `Materia ${index + 1}`
                        ),
                        labels: {
                          style: {
                            colors: "#6B7280",
                          },
                        },
                        min: 0,
                        max: 100,
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#6B7280",
                          },
                        },
                      },
                      grid: {
                        borderColor: "#E5E7EB",
                      },
                      dataLabels: {
                        enabled: true,
                        formatter: (val) => `${val}%`,
                        offsetX: 30,
                        style: {
                          fontSize: "12px",
                          colors: ["#374151"],
                        },
                      },
                      tooltip: {
                        y: {
                          formatter: (value) => `${value}%`,
                        },
                      },
                    } as ApexOptions
                  }
                  series={[
                    {
                      name: "Promedio",
                      data: subjectProgress.map(
                        (progress) => progress.average_score
                      ),
                    },
                  ]}
                  type="bar"
                  height={300}
                />
              </motion.div>

              {/* Attempts per Subject */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Intentos por Materia
                </h2>
                <Chart
                  options={
                    {
                      chart: {
                        type: "bar",
                        toolbar: { show: false },
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                          columnWidth: "60%",
                        },
                      },
                      colors: ["#3B82F6"],
                      xaxis: {
                        categories: subjectProgress.map(
                          (_, index) => `Materia ${index + 1}`
                        ),
                        labels: {
                          style: {
                            colors: "#6B7280",
                          },
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: "#6B7280",
                          },
                        },
                        title: {
                          text: "Número de Intentos",
                          style: {
                            color: "#6B7280",
                          },
                        },
                      },
                      grid: {
                        borderColor: "#E5E7EB",
                      },
                      dataLabels: {
                        enabled: true,
                        style: {
                          fontSize: "12px",
                          colors: ["#374151"],
                        },
                      },
                      tooltip: {
                        y: {
                          formatter: (value) => `${value} intentos`,
                        },
                      },
                    } as ApexOptions
                  }
                  series={[
                    {
                      name: "Intentos",
                      data: subjectProgress.map(
                        (progress) => progress.total_attempts
                      ),
                    },
                  ]}
                  type="bar"
                  height={300}
                />
              </motion.div>
            </div>

            {/* Subject Progress Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Detalle por Materia
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        ID Materia
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        ID Documento
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Promedio
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Total Intentos
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectProgress.map((progress, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Materia #{progress.subject_id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            Doc #{progress.document_id}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-lg ${
                                progress.average_score >= 70
                                  ? "text-green-600"
                                  : progress.average_score >= 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {progress.average_score}%
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  progress.average_score >= 70
                                    ? "bg-green-500"
                                    : progress.average_score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${progress.average_score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {progress.total_attempts}{" "}
                            {progress.total_attempts === 1
                              ? "intento"
                              : "intentos"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {progress.average_score >= 70 ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Excelente
                            </span>
                          ) : progress.average_score >= 50 ? (
                            <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Bueno
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Mejorar
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Recent Attempts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Intentos Recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Intento
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Quiz ID
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Puntaje
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Tiempo
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics.recent_attempts.map((attempt, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Intento #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                        <strong>Quiz ID:</strong> {attempt.quiz_id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span
                          className={`font-bold ${
                            attempt.score >= 70
                              ? "text-green-600"
                              : attempt.score >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {attempt.score.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {formatTime(attempt.time_taken)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(attempt.completed_at).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
