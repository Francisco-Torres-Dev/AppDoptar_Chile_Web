import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  items: { label: string; to?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Inicio</Link>
        </li>
        {items.map((item, i) => (
          <li
            key={item.label}
            className={`breadcrumb-item ${i === items.length - 1 ? 'active' : ''}`}
            aria-current={i === items.length - 1 ? 'page' : undefined}
          >
            {item.to && i < items.length - 1 ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
