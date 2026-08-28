import { useEffect, useState } from "react";
import * as coursesApi from "../../api/coursesApi";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import Modal from "../../components/ui/modal";
import Alert from "../../components/ui/alert";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/badge";
import ConfirmDialog from "../../components/ui/confirmDialog";
import Spinner from "../../components/ui/spinner";

const empty = { code: "", name: "", description: "" };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);

  const load = async () => setCourses(await coursesApi.listCourses());

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setModal(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ code: c.code, name: c.name, description: c.description || "" });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await coursesApi.updateCourse(editing.id, form);
      } else {
        await coursesApi.createCourse(form);
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
      await coursesApi.deleteCourse(confirm.id);
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
        <h1 className="text-2xl font-bold">Cours</h1>
        <Button onClick={openCreate}>+ Nouveau cours</Button>
      </div>
      <Alert message={error} />

      <Table headers={["Code", "Nom", "Description", "Examens", "Actions"]}>
        {courses.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-medium text-brand-500">{c.code}</td>
            <td className="px-4 py-3">{c.name}</td>
            <td className="px-4 py-3 text-neutral-400">
              {c.description || "-"}
            </td>
            <td className="px-4 py-3">
              <Badge color="orange">{c.exam_count}</Badge>
            </td>
            <td className="px-4 py-3 space-x-2">
              <Button variant="secondary" onClick={() => openEdit(c)}>
                Modifier
              </Button>
              <Button variant="danger" onClick={() => setConfirm(c)}>
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Modifier le cours" : "Nouveau cours"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
            placeholder="PROG2"
          />
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        message={`Supprimer le cours ${confirm?.code} ?`}
      />
    </div>
  );
}
