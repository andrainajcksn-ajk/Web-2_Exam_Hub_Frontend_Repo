export default function Alert({ message, type = 'error' }) {
  if (!message) return null;
  const styles = type === 'error' ? 'bg-red-900/40 border-red-700 text-red-200' : 'bg-brand-900/40 border-brand-700 text-brand-200';
  return <div className={`border rounded-lg px-4 py-3 mb-4 ${styles}`}>{message}</div>;
}
