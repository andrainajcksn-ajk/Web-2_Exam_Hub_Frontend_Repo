import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as examsApi from "../../api/examsApi";
import * as questionsApi from "../../api/questionsApi";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import Modal from "../../components/ui/modal";
import Alert from "../../components/ui/alert";
import Badge from "../../components/ui/badge";
import ConfirmDialog from "../../components/ui/confirmDialog";
import Spinner from "../../components/ui/spinner";

function emptyChoices() {
  return [
    { text: "", is_correct: true },
    { text: "", is_correct: false },
  ];
}

function QuestionForm({ initial, onSubmit, locked }) {
  const [statement, setStatement] = useState(initial?.statement || "");
  const [points, setPoints] = useState(initial?.points || 1);
  const [choices, setChoices] = useState(
    initial
      ? initial.choices.map((c) => ({ text: c.text, is_correct: c.is_correct }))
      : emptyChoices(),
  );

  const setChoice = (i, field, value) => {
    setChoices((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    );
  };

  const markCorrect = (i) => {
    setChoices((prev) =>
      prev.map((c, idx) => ({ ...c, is_correct: idx === i })),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ statement, points: Number(points), choices });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Énoncé"
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        required
      />
      <Input
        label="Points"
        type="number"
        min="1"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm text-neutral-400 mb-1">
          Choix (2 à 6, exactement 1 correct)
        </label>
        <div className="space-y-2">
          {choices.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={c.is_correct}
                onChange={() => markCorrect(i)}
                className="accent-brand-500"
              />
              <Input
                value={c.text}
                onChange={(e) => setChoice(i, "text", e.target.value)}
                required
                placeholder={`Choix ${i + 1}`}
              />
              {choices.length > 2 && (
                <button
                  type="button"
                  onClick={() =>
                    setChoices((p) => p.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {choices.length < 6 && (
          <button
            type="button"
            onClick={() =>
              setChoices((p) => [...p, { text: "", is_correct: false }])
            }
            className="mt-2 text-brand-500 hover:underline text-sm"
          >
            + Ajouter un choix
          </button>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={locked}>
          {initial ? "Enregistrer" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

export default function ExamQuestions() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    const [ex, qs] = await Promise.all([
      examsApi.getExam(id),
      examsApi.getExamQuestions(id),
    ]);
    setExam(ex);
    setQuestions(qs);
    setLocked((ex.attempt_count || 0) > 0);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (input) => {
    setError("");
    try {
      if (editing) {
        await questionsApi.updateQuestion(editing.id, input);
      } else {
        await examsApi.addQuestion(id, input);
      }
      setModal(false);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await questionsApi.deleteQuestion(confirm.id);
      setConfirm(null);
      load();
    } catch (err) {
      setConfirm(null);
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/exams" className="text-brand-500 hover:underline">
          ← Examens
        </Link>
        <h1 className="text-2xl font-bold">Questions — {exam?.title}</h1>
      </div>

      {locked && (
        <Alert
          message="Cet examen possède des tentatives : les questions sont verrouillées (RG-08)."
          type="orange"
        />
      )}
      <Alert message={error} />

      <div className="mb-6">
        <Button
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
          disabled={locked}
        >
          + Ajouter une question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 && (
          <p className="text-neutral-400">Aucune question pour le moment.</p>
        )}
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-brand-500 font-medium mr-2">
                  Q{q.position}.
                </span>
                <span className="font-medium">{q.statement}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="orange">{q.points} pt</Badge>
                {!locked && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(q);
                        setModal(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button variant="danger" onClick={() => setConfirm(q)}>
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>
            <ul className="space-y-1 text-neutral-300">
              {q.choices.map((c) => (
                <li key={c.id} className={c.is_correct ? "text-green-400" : ""}>
                  {c.is_correct ? "✓ " : ""}
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
        title={editing ? "Modifier la question" : "Nouvelle question"}
      >
        <QuestionForm
          initial={editing}
          onSubmit={handleSubmit}
          locked={locked}
        />
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        message="Supprimer cette question et ses choix ?"
      />
    </div>
  );
}
