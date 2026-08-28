const Badge = ({ children, color = 'neutral' }) => {
  const colors = {
    neutral: 'bg-neutral-800 text-neutral-300',
    green: 'bg-green-900/50 text-green-300',
    red: 'bg-red-900/50 text-red-300',
    orange: 'bg-brand-900/50 text-brand-300',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
}
export default Badge;
