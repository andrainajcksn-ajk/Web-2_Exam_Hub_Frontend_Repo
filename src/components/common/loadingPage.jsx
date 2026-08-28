import Spinner from '../ui/spinner';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <Spinner />
    </div>
  );
}
