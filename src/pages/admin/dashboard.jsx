import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listStudents } from "../../api/studentsApi";
import { listCourses } from "../../api/coursesApi";
import { listExams } from "../../api/examsApi";
import Spinner from "../../components/ui/spinner";

export default function Dashboard() {
  const [data, setData] = useState({
    students: 0,
    courses: 0,
    exams: 0,
    attempts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [students, courses, exams] = await Promise.all([
          listStudents(),
          listCourses(),
          listExams(),
        ]);
        const attempts = exams.reduce((s, e) => s + (e.attempt_count || 0), 0);
        setData({
          students: students.length,
          courses: courses.length,
          exams: exams.length,
          attempts,
        });
      } catch (err){
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: "Étudiants", value: data.students, to: "/admin/students" },
    { label: "Cours", value: data.courses, to: "/admin/courses" },
    { label: "Examens", value: data.exams, to: "/admin/exams" },
    { label: "Tentatives", value: data.attempts, to: "/admin/exams" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="block bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-500 transition"
          >
            <div className="text-4xl font-extrabold text-brand-500">
              {c.value}
            </div>
            <div className="mt-2 text-neutral-400">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
