import { IconButton } from '@hanlogy/react-web-ui';
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { OutlinedButton } from '@/component/buttons';

export function EditIconButton(props: { onClick: VoidFunction }) {
  return (
    <IconButton {...props} className="text-gray-500 hover:bg-gray-200">
      <Edit2Icon className="w-4" />
    </IconButton>
  );
}

export function DeleteIconButton(props: { onClick: VoidFunction }) {
  return (
    <IconButton {...props} className="text-gray-500 hover:bg-gray-200">
      <Trash2Icon className="w-4" />
    </IconButton>
  );
}

export function AddItemButton(props: { onClick: VoidFunction }) {
  return (
    <OutlinedButton icon={<PlusIcon size={18} />} {...props}>
      Add item
    </OutlinedButton>
  );
}
