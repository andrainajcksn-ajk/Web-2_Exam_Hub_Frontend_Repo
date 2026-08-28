import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo-page.png" alt="ExamHub" className="h-30 mb-4" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
export default AuthLayout;
