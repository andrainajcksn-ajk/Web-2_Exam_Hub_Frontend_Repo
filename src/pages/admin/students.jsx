import { useEffect, useState } from "react";
import * as studentsApi from "../../api/studentsApi";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import Modal from "../../components/ui/modal";
import Alert from "../../components/ui/alert";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/badge";
import ConfirmDialog from "../../components/ui/confirmDialog";
import Spinner from "../../components/ui/spinner";
import { formatDate } from "../../utils/date";

const empty = { name: "", email: "", password: "" };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const [password, setPassword] = useState("");

  const load = async () => {
    setStudents(await studentsApi.listStudents());
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setPassword("");
    setModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email });
    setPassword("");
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await studentsApi.updateStudent(editing.id, {
          ...form,
          is_active: editing.is_active,
          password: password || undefined,
        });
      } else {
        await studentsApi.createStudent({ ...form, password });
      }
      setModal(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm) return;
    try {
      await studentsApi.deactivateStudent(confirm.id);
      setConfirm(null);
      load();
    } catch (err) {
      setConfirm(null);
      setError(err.message);
    }
  };

  const handleReactivate = async (student) => {
    setError("");
    try {
      await studentsApi.updateStudent(student.id, {
        name: student.name,
        email: student.email,
        is_active: true,
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Étudiants</h1>
        <Button onClick={openCreate}>+ Nouvel étudiant</Button>
      </div>
      <Alert message={error} />

      <Table headers={["Nom", "Email", "Statut", "Créé le", "Actions"]}>
        {students.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3">{s.name}</td>
            <td className="px-4 py-3 text-neutral-400">{s.email}</td>
            <td className="px-4 py-3">
              {s.is_active ? (
                <Badge color="green">Actif</Badge>
              ) : (
                <Badge color="red">Désactivé</Badge>
              )}
            </td>
            <td className="px-4 py-3 text-neutral-400">
              {formatDate(s.created_at)}
            </td>
            <td className="px-4 py-3 space-x-2">
              <Button variant="secondary" onClick={() => openEdit(s)}>
                Modifier
              </Button>
              {s.is_active ? (
                <Button variant="danger" onClick={() => setConfirm(s)}>
                  Désactiver
                </Button>
              ) : (
                <Button onClick={() => handleReactivate(s)}>Réactiver</Button>
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Modifier étudiant" : "Nouvel étudiant"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label={
              editing
                ? "Nouveau mot de passe (optionnel)"
                : "Mot de passe initial"
            }
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editing}
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
        onConfirm={handleDeactivate}
        message={`Désactiver le compte de ${confirm?.name} ? Ses résultats restent consultables.`}
      />
    </div>
  );
};
export default Students;
