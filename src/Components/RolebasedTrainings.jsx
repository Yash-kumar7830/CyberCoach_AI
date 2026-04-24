import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import questionData from "../data/quizQuestions.json";

/* ── Config ── */
const TRAINING_META = {
  finance:           { title: "Financial Fraud & Scam Awareness", color: "amber" },
  "it-security":     { title: "IT Security & Network Defence",    color: "blue"  },
  phishing:          { title: "Phishing & Social Engineering",    color: "green" },
  "data-privacy":    { title: "Data Privacy & GDPR Compliance",  color: "purple"},
  "remote-work":     { title: "Secure Remote Work Practices",    color: "teal"  },
  "incident-response":{ title: "Incident Response & Reporting",  color: "red"   },
  general:           { title: "General Security Awareness",      color: "green" },
};

const COLOR_MAP = {
  amber:  { border:"border-amber-400/30",  bg:"bg-amber-400/8",   text:"text-amber-400",  badge:"text-amber-400 bg-amber-400/10 border-amber-400/20"  },
  blue:   { border:"border-blue-400/30",   bg:"bg-blue-400/8",    text:"text-blue-400",   badge:"text-blue-400 bg-blue-400/10 border-blue-400/20"    },
  green:  { border:"border-green-400/30",  bg:"bg-green-400/8",   text:"text-green-400",  badge:"text-green-400 bg-green-400/10 border-green-400/20"  },
  purple: { border:"border-purple-400/30", bg:"bg-purple-400/8",  text:"text-purple-400", badge:"text-purple-400 bg-purple-400/10 border-purple-400/20"},
  teal:   { border:"border-teal-400/30",   bg:"bg-teal-400/8",    text:"text-teal-400",   badge:"text-teal-400 bg-teal-400/10 border-teal-400/20"    },
  red:    { border:"border-red-400/30",    bg:"bg-red-400/8",     text:"text-red-400",    badge:"text-red-400 bg-red-400/10 border-red-400/20"       },
};

const ROLES = [
  { id: "employee",     label: "Employee",      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",         desc: "Day-to-day security awareness" },
  { id: "manager",      label: "Manager",       icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", desc: "Team & policy responsibilities" },
  { id: "it-admin",     label: "IT Admin",      icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18", desc: "Infrastructure & access control" },
  { id: "finance-team", label: "Finance Team",  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", desc: "Payments, audits & compliance" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const QUESTIONS = questionData.questions;
const FALLBACK_QUESTIONS = questionData.fallbackQuestions;

function getQuestions(slug, roleId) {
  const key = `${slug}-${roleId}`;
  return QUESTIONS[key] || FALLBACK_QUESTIONS;
}

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ── Sub-components ── */

function StepIndicator({ step }) {
  const steps = ["Select Role", "Training", "Results"];
  return (
    <div className="flex items-center gap-2 justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-200 ${
            i < step ? "text-green-400" : i === step ? "text-white" : "text-gray-600"
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 ${
              i < step  ? "bg-green-400 border-green-400 text-gray-900" :
              i === step ? "border-green-400/60 text-green-400" :
                           "border-gray-700 text-gray-600"
            }`}>{i < step ? "✓" : i + 1}</span>
            <span className="hidden sm:block">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px transition-colors duration-300 ${i < step ? "bg-green-400/60" : "bg-gray-800"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ current, total, color }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Question {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color === "green" ? "#4ade80" : color === "amber" ? "#fbbf24" : color === "blue" ? "#60a5fa" : "#4ade80" }}
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function RolebasedTrainings() {
  const { slug = "general" } = useParams();
  const meta  = TRAINING_META[slug] || TRAINING_META.general;
  const clr   = COLOR_MAP[meta.color] || COLOR_MAP.green;

  const [step,        setStep]        = useState(0); // 0=role select, 1=training, 2=results
  const [selectedRole, setSelectedRole] = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [current,     setCurrent]     = useState(0);
  const [chosen,      setChosen]      = useState(null);
  const [answered,    setAnswered]    = useState(false);
  const [score,       setScore]       = useState(0);
  const [answers,     setAnswers]     = useState([]);

  const startTraining = () => {
    const qs = getQuestions(slug, selectedRole);
    setQuestions(qs);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
    setChosen(null);
    setAnswered(false);
    setStep(1);
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setChosen(idx);
    setAnswered(true);
    const correct = idx === questions[current].correct;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { chosen: idx, correct, q: questions[current] }]);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) { setStep(2); return; }
    setCurrent((c) => c + 1);
    setChosen(null);
    setAnswered(false);
  };

  const restart = () => {
    setStep(0);
    setSelectedRole(null);
  };

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade = pct >= 80 ? { label: "Expert",   color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30"  } :
                pct >= 50 ? { label: "Competent", color: "text-amber-400",  bg: "bg-amber-400/10 border-amber-400/30"  } :
                            { label: "Needs Work", color: "text-red-400",   bg: "bg-red-400/10 border-red-400/30"     };

  return (
    <main className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family:'Syne',sans-serif; }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fade-up 0.35s ease forwards; }
        .opt-btn { transition: all 0.15s ease; }
        .opt-btn:not(:disabled):hover { transform: translateX(4px); }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <Link to="/rolebased-trainings/general" className="hover:text-green-400 transition-colors">Training Hub</Link>
          <span>/</span>
          <span className={clr.text}>{meta.title}</span>
        </div>

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${clr.badge} mb-3`}>
            {meta.title}
          </span>
          <h1 className="syne text-2xl sm:text-3xl font-extrabold text-white">
            {step === 0 ? "Select your role" : step === 1 ? "Scenario Training" : "Your Results"}
          </h1>
        </div>

        <StepIndicator step={step} />

        {/* ════════════════════════════════
            STEP 0 — Role Selection
        ════════════════════════════════ */}
        {step === 0 && (
          <div className="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                    selectedRole === role.id
                      ? `${clr.border} ${clr.bg} bg-opacity-10`
                      : "border-gray-800/70 bg-gray-900/40 hover:border-gray-700"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center border transition-colors ${
                    selectedRole === role.id
                      ? `${clr.border} ${clr.text}`
                      : "border-gray-700/60 text-gray-500"
                  }`} style={{ background: selectedRole === role.id ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)" }}>
                    <Icon d={role.icon} size={18} />
                  </div>
                  <p className={`font-semibold text-sm mb-1 syne transition-colors ${
                    selectedRole === role.id ? "text-white" : "text-gray-300"
                  }`}>{role.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
                  {selectedRole === role.id && (
                    <span className={`mt-3 inline-flex items-center gap-1 text-xs ${clr.text} font-medium`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Level info */}
            <div className="rounded-xl border border-gray-800/60 bg-gray-900/30 p-5 mb-6">
              <h3 className="syne text-sm font-bold text-white mb-3">Training levels in this module</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {LEVELS.map((l, i) => (
                  <div key={l} className="flex-1 flex items-center gap-2.5 rounded-lg bg-gray-800/40 border border-gray-700/30 px-3 py-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      i===0?"bg-green-400":i===1?"bg-amber-400":"bg-red-400"
                    }`}/>
                    <span className="text-xs text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={!selectedRole}
              onClick={startTraining}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
            >
              Begin Training →
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            STEP 1 — Training
        ════════════════════════════════ */}
        {step === 1 && questions.length > 0 && (
          <div className="fade-up">
            <ProgressBar current={current + 1} total={questions.length} color={meta.color} />

            {/* Level badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                questions[current].level === "Beginner"     ? "text-green-400 bg-green-400/10 border-green-400/20" :
                questions[current].level === "Intermediate" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                                                              "text-red-400 bg-red-400/10 border-red-400/20"
              }`}>
                {questions[current].level}
              </span>
              <span className="text-xs text-gray-600">Scenario</span>
            </div>

            {/* Scenario card */}
            <div className={`rounded-xl border ${clr.border} ${clr.bg} p-5 mb-5`}>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scenario</p>
              <p className="text-sm text-gray-200 leading-relaxed">{questions[current].scenario}</p>
            </div>

            {/* Question */}
            <p className="text-white font-medium mb-4 leading-snug">{questions[current].question}</p>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
              {questions[current].options.map((opt, i) => {
                const isCorrect  = i === questions[current].correct;
                const isChosen   = i === chosen;
                let cls = "border-gray-800/70 bg-gray-900/40 text-gray-300 hover:border-gray-700 hover:text-white";
                if (answered) {
                  if (isCorrect)            cls = "border-green-400/50 bg-green-400/8 text-green-300";
                  else if (isChosen)        cls = "border-red-400/50 bg-red-400/8 text-red-300";
                  else                      cls = "border-gray-800/40 bg-gray-900/20 text-gray-600";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`opt-btn text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3 ${cls}`}
                  >
                    <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                      answered && isCorrect ? "border-green-400 text-green-400 bg-green-400/10" :
                      answered && isChosen  ? "border-red-400 text-red-400 bg-red-400/10" :
                                             "border-gray-600 text-gray-600"
                    }`}>
                      {answered && isCorrect ? "✓" : answered && isChosen ? "✗" : String.fromCharCode(65+i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="fade-up rounded-xl border border-gray-800/60 bg-gray-900/50 p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Explanation</p>
                <p className="text-sm text-gray-300 leading-relaxed">{questions[current].explanation}</p>
              </div>
            )}

            {answered && (
              <button
                onClick={nextQuestion}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 active:scale-95 transition-all duration-200"
              >
                {current + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            )}
          </div>
        )}

        {/* ════════════════════════════════
            STEP 2 — Results
        ════════════════════════════════ */}
        {step === 2 && (
          <div className="fade-up">
            {/* Score card */}
            <div className={`rounded-2xl border p-8 text-center mb-6 ${grade.bg}`}>
              <div className="text-5xl font-extrabold syne text-white mb-1">{score}/{questions.length}</div>
              <div className={`text-sm font-semibold mb-1 ${grade.color}`}>{grade.label}</div>
              <div className="text-xs text-gray-500">{pct}% correct</div>

              {/* score bar */}
              <div className="w-full h-2 bg-gray-800 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: pct>=80?"#4ade80":pct>=50?"#fbbf24":"#f87171" }}
                />
              </div>
            </div>

            {/* Per-question breakdown */}
            <h3 className="syne text-sm font-bold text-white mb-3">Answer breakdown</h3>
            <div className="flex flex-col gap-3 mb-8">
              {answers.map((a, i) => (
                <div key={i} className={`rounded-xl border p-4 ${
                  a.correct ? "border-green-400/20 bg-green-400/5" : "border-red-400/20 bg-red-400/5"
                }`}>
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      a.correct ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"
                    }`}>{a.correct ? "✓" : "✗"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1 leading-relaxed">{a.q.question}</p>
                      <p className="text-xs text-gray-500">
                        Your answer: <span className={a.correct ? "text-green-400" : "text-red-400"}>
                          {a.q.options[a.chosen]}
                        </span>
                      </p>
                      {!a.correct && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Correct: <span className="text-green-400">{a.q.options[a.q.correct]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restart}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-900 bg-green-400 hover:bg-green-300 active:scale-95 transition-all duration-200"
              >
                Retry with Different Role
              </button>
              <Link
                to="/rolebased-trainings/general"
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-300 border border-gray-700/60 hover:border-green-400/30 hover:text-white text-center transition-all duration-200"
              >
                ← Back to Training Hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}