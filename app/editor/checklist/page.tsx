'use client';

import { useState } from 'react';
import { Button, IconButton, useDialog } from '@hanlogy/react-web-ui';
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { TextButton } from '@/component/buttons';
import { ChecklistItem } from '@/definitions/types';
import { ItemEditorDialog } from './ItemEditorDialog';

export default function ChecklistEditorPage() {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<ChecklistItem[]>([]);

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
      <div className="text-left">
        <div className="mb-1 block pl-3 font-medium text-gray-600">Name</div>
        <div>
          <input
            type="text"
            name="name"
            maxLength={200}
            placeholder=""
            className="h-14 w-full rounded-full border border-gray-300 px-3"
          />
        </div>
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
      </div>
    </>
  );
}
