import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as resultsApi from "../../api/resultsApi";
import Button from "../../components/ui/button";
import Alert from "../../components/ui/alert";
import Spinner from "../../components/ui/spinner";
import Badge from "../../components/ui/badge";
import ConfirmDialog from "../../components/ui/confirmDialog";

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    resultsApi
      .myExamDetail(id)
      .then(setExam)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([qid, cid]) => ({
        question_id: Number(qid),
        choice_id: Number(cid),
      }));
      const result = await resultsApi.submitExam(id, payload);
      navigate(`/student/exams/${id}/result`, { state: { result } });
    } catch (err) {
      setError(err.message);
      setConfirm(false);
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert message={error} />;

  const answered = Object.keys(answers).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{exam.title}</h1>
      <p className="text-neutral-400 mb-6">
        {exam.course?.code} — {exam.total_points} points au total
      </p>

      <div className="space-y-6">
        {exam.questions.map((q, qi) => (
          <div
            key={q.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
          >
            <div className="flex justify-between mb-4">
              <span className="font-medium">
                <span className="text-brand-500 mr-2">Q{qi + 1}.</span>
                {q.statement}
              </span>
              <Badge color="orange">{q.points} pt</Badge>
            </div>
            <div className="space-y-2">
              {q.choices.map((c) => (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    answers[q.id] === c.id
                      ? "border-brand-500 bg-brand-900/30"
                      : "border-neutral-700 hover:bg-neutral-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={c.id}
                    checked={answers[q.id] === c.id}
                    onChange={() => setAnswers({ ...answers, [q.id]: c.id })}
                    className="accent-brand-500"
                  />
                  <span>{c.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-neutral-400 text-sm">
          {answered}/{exam.questions.length} répondu(s). Les questions sans
          réponse valent 0 pt.
        </span>
        <Button onClick={() => setConfirm(true)} disabled={submitting}>
          {submitting ? "Soumission..." : "Soumettre"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleSubmit}
        message="Voulez-vous vraiment soumettre ? Cette action est définitive et vous ne pourrez plus modifier vos réponses."
      />
    </div>
  );
}
