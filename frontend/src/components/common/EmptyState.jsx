export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state animate-fade">
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
