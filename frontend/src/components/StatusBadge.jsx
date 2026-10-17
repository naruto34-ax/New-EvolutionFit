import { ORDER_STATUS } from '../services/orderService';

export default function StatusBadge({ status }) {
  const info = ORDER_STATUS[status] ?? { label: status, badge: 'badge-primary' };
  return <span className={`badge ${info.badge}`}>{info.label}</span>;
}