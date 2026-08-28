import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/student', label: 'Examens disponibles', end: true },
  { to: '/student/results', label: 'Mes résultats' },
];

const StudentLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src="/logo-page.png" alt="ExamHub" className="h-30 mb-4" />
          <nav className="flex items-center gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition ${isActive ? 'bg-brand-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <span className="ml-3 text-sm text-neutral-400">{user?.name}</span>
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800">
              Déconnexion
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
export default StudentLayout;
