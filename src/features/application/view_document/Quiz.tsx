import { useState, useEffect } from "react";
import type { Quiz as QuizType } from "@/shared/interfaces/quiz.interface";
import { Enviroment } from "@/shared/utils/env/environment";

export function Quiz() {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const documentId = Number(sessionStorage.getItem("documentId"));

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const res = await fetch(`${Enviroment.API_URL}/quiz/${documentId}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!res.ok) throw new Error("No quiz found");
        const data: QuizType = await res.json();
        setQuiz(data);
      } catch {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [documentId]);

  if (loading) return <p className="text-gray-500 text-center py-8">Cargando quiz...</p>;
  if (!quiz || !quiz.questions?.length)
    return <p className="text-gray-500 text-center py-8">No hay quiz disponible para este documento.</p>;

  if (finished) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-violet-700 mb-2">¡Quiz completado!</h3>
        <p className="text-gray-600">Puntuación: {score} / {quiz.questions.length}</p>
        <button
          onClick={() => { setCurrent(0); setScore(0); setSelected(null); setFinished(false); }}
          className="mt-4 px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const q = quiz.questions[current];

  const handleAnswer = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === q.correct_option) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= quiz.questions.length) setFinished(true);
    else { setCurrent((c) => c + 1); setSelected(null); }
  };

  return (
    <div className="space-y-4 p-4">
      <p className="text-sm text-gray-400">Pregunta {current + 1} / {quiz.questions.length}</p>
      <p className="text-lg font-semibold text-gray-800">{q.question_text}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let cls = "w-full text-left px-4 py-2 rounded-lg border transition ";
          if (selected === null) cls += "border-gray-200 hover:border-violet-400 hover:bg-violet-50";
          else if (opt === q.correct_option) cls += "border-green-500 bg-green-50 text-green-700";
          else if (opt === selected) cls += "border-red-400 bg-red-50 text-red-600";
          else cls += "border-gray-200 opacity-60";
          return <button key={idx} className={cls} onClick={() => handleAnswer(opt)}>{opt}</button>;
        })}
      </div>
      {selected !== null && (
        <button onClick={handleNext} className="mt-2 px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition">
          {current + 1 >= quiz.questions.length ? "Ver resultado" : "Siguiente"}
        </button>
      )}
    </div>
  );
}
