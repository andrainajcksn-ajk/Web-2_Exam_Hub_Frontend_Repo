import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl font-extrabold text-white">Exam<span className="text-brand-500">Hub</span></span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
