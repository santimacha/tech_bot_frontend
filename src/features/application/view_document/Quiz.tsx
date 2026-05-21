import { useState, useEffect } from "react";
import { Enviroment } from "@/shared/utils/env/environment";
import { useAuth } from "@/features/auth/context/AuthContext";

interface QuizOption {
  id: number;
  option_text: string;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  correct_option: string;
  options: QuizOption[];
}

interface QuizData {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

interface AnswerRecord {
  questionId: number;
  selectedOption: string;
}

export function Quiz() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const { token } = useAuth();

  const documentId = Number(sessionStorage.getItem("documentId"));

  useEffect(() => {
    fetchQuiz();
  }, [documentId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${Enviroment.API_URL}/quiz/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: QuizData = await res.json();
        setQuiz(data);
      } else if (res.status === 404) {
        setQuiz(null);
      }
    } catch {
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${Enviroment.API_URL}/quiz/${documentId}/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: QuizData = await res.json();
        setQuiz(data);
      }
    } catch (err) {
      console.error("Error generando quiz:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (optionText: string) => {
    if (selected !== null) return;
    setSelected(optionText);
  };

  const handleNext = async () => {
    if (!quiz || selected === null) return;

    const q = quiz.questions[current];
    const newAnswers = [...answers, { questionId: q.id, selectedOption: selected }];
    setAnswers(newAnswers);

    const isLast = current + 1 >= quiz.questions.length;

    if (!isLast) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setFinished(true);

      try {
        const res = await fetch(`${Enviroment.API_URL}/quiz/${quiz.id}/attempt`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: newAnswers,   
            timeTaken,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        }
      } catch (err) {
        console.error("Error guardando resultado:", err);
      }
    }
  };

  if (loading) return <p className="text-gray-500 text-center py-8">Cargando quiz...</p>;

  if (!quiz) {
    return (
      <div className="text-center py-6">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Generando quiz...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Generar Quiz
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 mt-2">Crea un quiz basado en el documento</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-bold text-violet-700">¡Quiz completado!</h3>
        {result && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-sm space-y-1">
            <p className="font-semibold text-violet-800">Puntuación: {result.score.toFixed(1)}%</p>
            <p className="text-gray-600">{result.correctAnswers} de {result.totalQuestions} correctas</p>
          </div>
        )}
        <button
          onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); setResult(null); }}
          className="mt-2 px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const q = quiz.questions[current];

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 text-right">Pregunta {current + 1} de {quiz.questions.length}</p>
      <p className="font-medium text-gray-800 text-sm leading-relaxed">{q.question_text}</p>
      <div className="space-y-2">
        {q.options.map((opt) => {
          let style = "border-gray-200 bg-gray-50 hover:bg-violet-50 hover:border-violet-300 cursor-pointer";
          if (selected) {
            if (opt.option_text === q.correct_option) style = "border-green-500 bg-green-50";
            else if (opt.option_text === selected) style = "border-red-400 bg-red-50";
            else style = "border-gray-200 bg-gray-50 opacity-50";
          }
          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.option_text)}
              disabled={!!selected}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${style}`}
            >
              {opt.option_text}
            </button>
          );
        })}
      </div>
      {selected && (
        <button
          onClick={handleNext}
          className="w-full mt-2 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition text-sm font-medium"
        >
          {current + 1 >= quiz.questions.length ? "Terminar Quiz ✓" : "Siguiente →"}
        </button>
      )}
    </div>
  );
}