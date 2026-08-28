import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as examsApi from "../../api/examsApi";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/badge";
import Spinner from "../../components/ui/spinner";
import { formatDate } from "../../utils/date";

export default function ExamResults() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examsApi
      .getExamResults(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/exams" className="text-brand-500 hover:underline">
          ← Examens
        </Link>
        <h1 className="text-2xl font-bold">Résultats — {data?.exam?.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="text-3xl font-extrabold text-brand-500">
            {data?.total_points}
          </div>
          <div className="text-neutral-400 mt-1">Points totaux</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="text-3xl font-extrabold text-white">
            {data?.average ?? "-"}
          </div>
          <div className="text-neutral-400 mt-1">Moyenne</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="text-3xl font-extrabold text-white">
            {data?.attempt_count}
          </div>
          <div className="text-neutral-400 mt-1">Tentatives</div>
        </div>
      </div>

      {data?.results?.length === 0 ? (
        <p className="text-neutral-400">
          Aucun étudiant n'a encore passé cet examen.
        </p>
      ) : (
        <Table headers={["Étudiant", "Note", "Soumis le"]}>
          {data?.results?.map((r) => (
            <tr key={r.student_id}>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">
                <Badge
                  color={r.score === data.total_points ? "green" : "orange"}
                >
                  {r.score}/{data.total_points}
                </Badge>
              </td>
              <td className="px-4 py-3 text-neutral-400">
                {formatDate(r.submitted_at)}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
