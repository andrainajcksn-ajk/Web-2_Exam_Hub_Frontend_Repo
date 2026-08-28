import { useLocation, Link } from "react-router-dom";

export default function ExamResult() {
  const { state } = useLocation();
  const result = state?.result;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Résultat</h1>
        <div className="text-5xl font-extrabold text-brand-500">
          {result?.score}
          <span className="text-neutral-500 text-2xl">
            /{result?.total_points}
          </span>
        </div>
        <p className="text-neutral-400 mt-2">
          {result?.score === result?.total_points
            ? "Excellent travail !"
            : result?.score >= result?.total_points / 2
              ? "Bien joué !"
              : "Encore un effort !"}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {result?.correction?.map((line) => (
          <div
            key={line.question_id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-medium">{line.statement}</span>
              <span
                className={`font-bold ${line.is_correct ? "text-green-400" : "text-red-400"}`}
              >
                {line.is_correct ? "+ " : "+0 "}/{line.points} pt
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div
                className={line.is_correct ? "text-green-400" : "text-red-400"}
              >
                Votre réponse :{" "}
                {line.student_choice_id
                  ? "choix sélectionné"
                  : "Aucune réponse"}
              </div>
              <div className="text-neutral-300">
                Bonne réponse : choix #{line.correct_choice_id}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/student"
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
        >
          Examens disponibles
        </Link>
        <Link
          to="/student/results"
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 font-medium"
        >
          Mes résultats
        </Link>
      </div>
    </div>
  );
}
