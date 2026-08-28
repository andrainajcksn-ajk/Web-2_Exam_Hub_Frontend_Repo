import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as examsApi from "../../api/examsApi";
import * as coursesApi from "../../api/coursesApi";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import Button from "../../components/ui/button";
import Modal from "../../components/ui/modal";
import Alert from "../../components/ui/alert";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/badge";
import ConfirmDialog from "../../components/ui/confirmDialog";
import Spinner from "../../components/ui/spinner";
import { formatDate } from "../../utils/date";

const empty = {
  course_id: "",
  title: "",
  description: "",
  starts_at: "",
  ends_at: "",
};

function toLocalInput(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);

  const load = async () => setExams(await examsApi.listExams());

  useEffect(() => {
    (async () => {
      try {
        const [e, c] = await Promise.all([
          examsApi.listExams(),
          coursesApi.listCourses(),
        ]);
        setExams(e);
        setCourses(c);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();
  const isOpen = (ex) =>
    new Date(ex.starts_at) <= now && new Date(ex.ends_at) >= now;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, course_id: courses[0]?.id || "" });
    setModal(true);
  };

  const openEdit = (ex) => {
    setEditing(ex);
    setForm({
      course_id: ex.course?.id || courses[0]?.id || "",
      title: ex.title,
      description: ex.description || "",
      starts_at: toLocalInput(ex.starts_at),
      ends_at: toLocalInput(ex.ends_at),
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, course_id: Number(form.course_id) };
      if (editing) {
        await examsApi.updateExam(editing.id, payload);
      } else {
        await examsApi.createExam(payload);
      }
      setModal(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await examsApi.deleteExam(confirm.id);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Examens</h1>
        <Button onClick={openCreate} disabled={courses.length === 0}>
          + Nouvel examen
        </Button>
      </div>
      <Alert message={error} />

      <Table
        headers={[
          "Titre",
          "Cours",
          "Disponibilité",
          "Questions",
          "Tentatives",
          "Actions",
        ]}
      >
        {exams.map((ex) => (
          <tr key={ex.id}>
            <td className="px-4 py-3 font-medium">{ex.title}</td>
            <td className="px-4 py-3 text-neutral-400">{ex.course?.code}</td>
            <td className="px-4 py-3 text-neutral-400">
              {formatDate(ex.starts_at)} → {formatDate(ex.ends_at)}
              <br />
              {isOpen(ex) ? (
                <Badge color="green">Ouvert</Badge>
              ) : (
                <Badge color="neutral">Fermé</Badge>
              )}
            </td>
            <td className="px-4 py-3">
              <Badge color="orange">{ex.question_count}</Badge>
            </td>
            <td className="px-4 py-3">{ex.attempt_count}</td>
            <td className="px-4 py-3 space-x-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/exams/${ex.id}/questions`)}
              >
                Questions
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/exams/${ex.id}/results`)}
              >
                Résultats
              </Button>
              <Button variant="secondary" onClick={() => openEdit(ex)}>
                Modifier
              </Button>
              <Button variant="danger" onClick={() => setConfirm(ex)}>
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Modifier l'examen" : "Nouvel examen"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Cours"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            options={courses.map((c) => ({
              value: c.id,
              label: `${c.code} - ${c.name}`,
            }))}
          />
          <Input
            label="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Début"
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            required
          />
          <Input
            label="Fin"
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModal(false)}
            >
              Annuler
            </Button>
            <Button type="submit">{editing ? "Enregistrer" : "Créer"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        message={`Supprimer l'examen « ${confirm?.title} » ?`}
      />
    </div>
  );
}
