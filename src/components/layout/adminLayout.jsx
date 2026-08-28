import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/students', label: 'Étudiants' },
  { to: '/admin/courses', label: 'Cours' },
  { to: '/admin/exams', label: 'Examens' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-neutral-950">
      <aside className="w-64 border-r border-neutral-800 p-4 flex flex-col">
       <img src="/logo-page.png" alt="ExamHub" className="h-30 mb-4" />
        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-brand-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-4 px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 text-left">
          Déconnexion
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
export default AdminLayout;
