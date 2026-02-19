import { Checklist } from '@/definitions/types';

export function ChecklistView({ item }: { item: Checklist }) {
  return (
    <pre>
      <code>{JSON.stringify(item, null, 2)}</code>
    </pre>
  );
}
