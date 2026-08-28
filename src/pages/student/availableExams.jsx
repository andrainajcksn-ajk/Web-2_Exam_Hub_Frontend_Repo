import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as resultsApi from "../../api/resultsApi";
import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";
import Spinner from "../../components/ui/spinner";
import { formatDate } from "../../utils/date";

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultsApi
      .myExams()
      .then(setExams)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Examens disponibles</h1>
      {exams.length === 0 ? (
        <p className="text-neutral-400">
          Aucun examen disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold">{ex.title}</h2>
                <Badge color="orange">{ex.course?.code}</Badge>
              </div>
              <p className="text-neutral-400 text-sm mb-1">{ex.course?.name}</p>
              {ex.description && (
                <p className="text-neutral-400 mb-3">{ex.description}</p>
              )}
              <div className="text-sm text-neutral-400 mb-4">
                {ex.question_count} question(s) · {ex.total_points} pt(s) · fin
                le {formatDate(ex.ends_at)}
              </div>
              <Link to={`/student/exams/${ex.id}`}>
                <Button>Passer l'examen</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
