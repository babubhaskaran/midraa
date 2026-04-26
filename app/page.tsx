"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/react";
import { Novel, QuizSession } from "@/app/types";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"landing" | "select" | "summary" | "quiz" | "result">("landing");
  const [novel, setNovel] = useState<Novel | null>(null);
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);

  const generateSummary = api.ai.summarizeNovel;
  const generateQuiz = api.ai.generateQuiz;
  const evaluateAnswers = api.ai.evaluateAnswers;
  const saveSession = api.progress.saveSession;

  const handleNovelSelect = async (selectedNovel: Novel) => {
    setNovel(selectedNovel);
    setStep("summary");
    const result = await generateSummary({ novel: selectedNovel.title });
    setSummary(result.summary);
  };

  const handleStartQuiz = async () => {
    if (!novel) return;
    setStep("quiz");
    const result = await generateQuiz({ novel: novel.title, summary });
    setQuestions(result.questions);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!novel) return;
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const result = await evaluateAnswers({
      answers: formattedAnswers,
      questions,
    });
    setScore(result.evaluation.score);
    setFeedback(result.evaluation);
    await saveSession({
      userId: "demo-user",
      novel: novel.title,
      score: result.evaluation.score,
      answers: formattedAnswers,
    });
    setStep("result");
  };

  const novels: Novel[] = [
    { id: "1", title: "The Giver", author: "Lois Lowry", genre: "Dystopian", difficulty: 2 },
    { id: "2", title: "Holes", author: "Louis Sachar", genre: "Adventure", difficulty: 2 },
    { id: "3", title: "Wonder", author: "R.J. Palacio", genre: "Young Adult", difficulty: 2 },
    { id: "4", title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", difficulty: 3 },
    { id: "5", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", difficulty: 3 },
  ];

  if (step === "landing") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">📚 Midra'a English Tutor</h1>
          <p className="text-xl text-gray-600 mb-8">
            Pick a novel, read an AI summary, take a quiz, and get personalized feedback.
          </p>
          <button>
            onClick={() => setStep("select")}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>
      </main>
    );
  }

  if (step === "select") {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Choose a Novel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {novels.map((n) => (
            <div>
              key={n.id}
              onClick={() => handleNovelSelect(n)}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-indigo-400 transition"
            >
              <h3 className="text-xl font-bold mb-2">{n.title}</h3>
              <p className="text-gray-600">{n.author}</p>
              <p className="text-sm text-gray-400">{n.genre}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (step === "summary" && novel) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{novel.title} — AI Summary</h2>
          <div className="prose max-w-none mb-8 p-6 bg-gray-50 rounded-xl">
            {summary || "Generating summary..."}
          </div>
          <button>
            onClick={handleStartQuiz}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Start Quiz (20 Questions)
          </button>
        </div>
      </main>
    );
  }

  if (step === "quiz") {
    const currentQuestion = questions[Object.keys(answers).length];
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 text-sm text-gray-500">
            Question {Object.keys(answers).length + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div>
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            />
          </div>
          {currentQuestion && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              {currentQuestion.type === "mcq" ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((opt: string, i: number) => (
                    <button>
                      key={i}
                      onClick={() => handleAnswer(currentQuestion.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition ${
                        answers[currentQuestion.id] === opt`
                          ? "border-indigo-600 bg-indigo-50"`
                          : "border-gray-200 hover:border-indigo-300"`
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea>
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
              ))}
              <button>
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < questions.length}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {Object.keys(answers).length === questions.length ? "Submit Quiz" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (step === "result" && feedback) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">🎉 Quiz Complete!</h2>
          <div className="text-6xl font-extrabold text-indigo-600 mb-4">{score}%</div>
          <div className="bg-white p-6 rounded-2xl shadow text-left mb-8">
            <h3 className="text-xl font-semibold mb-4">Feedback</h3>
            <p className="text-gray-700 mb-4">{feedback.overallFeedback}</p>
            <div className="mb-2">
              <strong>Strengths:</strong> {feedback.strengths}
            </div>
            <div>
              <strong>Areas to Improve:</strong> {feedback.weaknesses}
            </div>
          </div>
          <button>
            onClick={() => {
              setStep("select");
              setNovel(null);
              setSummary("");
              setQuestions([]);
              setAnswers({});
              setScore(null);
              setFeedback(null);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Try Another Novel
          </button>
        </div>
      </main>
    );
  }

  return null;
}
