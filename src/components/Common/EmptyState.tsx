export default function EmptyState({ icon, title, description }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
