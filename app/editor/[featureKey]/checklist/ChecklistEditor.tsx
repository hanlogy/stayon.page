import { SubmitEventHandler, useMemo, useState } from 'react';
import {
  FormFieldRegister,
  IconButton,
  useDialog,
} from '@hanlogy/react-web-ui';
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { TextButton } from '@/component/buttons';
import { TextField } from '@/component/form/fields';
import { ChecklistItem } from '@/definitions/types';
import { formId } from '../constants';
import { EditorTabName } from '../types';
import { ItemEditorDialog } from './ItemEditorDialog';
import { publishChecklist } from './action';

export default function ChecklistEditor({
  register,
  onValidate,
  setTabName,
}: {
  register: FormFieldRegister<{ name: string }>;
  onValidate: SubmitEventHandler;
  setTabName: (tabName: EditorTabName) => void;
}) {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  const itemsJson = useMemo(() => {
    return JSON.stringify(items);
  }, [items]);

  const handleOpenDialog = async (item?: ChecklistItem) => {
    const result = await openDialog<ChecklistItem>(({ closeDialog }) => (
      <ItemEditorDialog initialData={item} closeDialog={closeDialog} />
    ));

    if (!result) {
      return;
    }

    if (item) {
      setItems((prev) => prev.map((e) => (e.id === item.id ? result : e)));
    } else {
      setItems((prev) => [...prev, result]);
    }
  };

  return (
    <>
      <form
        autoComplete="off"
        id={formId}
        action={publishChecklist}
        onSubmit={onValidate}
      >
        <TextField
          label="Name"
          maxLength={200}
          controller={register('name', {
            validator: ({ name }) => {
              if (!name) {
                setTabName('detail');
                return 'Name is required';
              }
            },
          })}
        />
        <input type="hidden" name="items" value={itemsJson} />
      </form>
      <div className="space-y-2 py-4">
        {items.map((item) => {
          const { id, name, remark } = item;
          return (
            <div key={id} className="flex items-center">
              <div className="flex-1">
                <div className="font-medium">{name}</div>
                {remark && <div className="text-gray-500">{remark}</div>}
              </div>
              <div>
                <IconButton onClick={() => handleOpenDialog(item)}>
                  <Edit2Icon className="w-4" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setItems((prev) => {
                      return prev.filter((e) => e.id !== id);
                    })
                  }
                  className="ml-2"
                >
                  <Trash2Icon className="w-4" />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <TextButton
          icon={<PlusIcon size={18} />}
          onClick={() => handleOpenDialog()}
          size="medium"
          className=""
        >
          Add item
        </TextButton>
      </div>
    </>
  );
}
