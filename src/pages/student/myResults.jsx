import { useEffect, useState } from "react";
import * as resultsApi from "../../api/resultsApi";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/badge";
import Spinner from "../../components/ui/spinner";
import { formatDate } from "../../utils/date";

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultsApi
      .myResults()
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes résultats</h1>
      {results.length === 0 ? (
        <p className="text-neutral-400">
          Vous n'avez pas encore passé d'examen.
        </p>
      ) : (
        <Table headers={["Examen", "Cours", "Note", "Soumis le"]}>
          {results.map((r, i) => (
            <tr key={`${r.exam_id}-${i}`}>
              <td className="px-4 py-3 font-medium">{r.title}</td>
              <td className="px-4 py-3 text-brand-500">{r.course_code}</td>
              <td className="px-4 py-3">
                <Badge color={r.score === r.total_points ? "green" : "orange"}>
                  {r.score}/{r.total_points}
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
};
export default MyResults;
