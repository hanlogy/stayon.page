'use client';

import { IconButton } from '@hanlogy/react-web-ui';
import { CheckBoxBlankIcon, CheckBoxCheckedIcon } from '@/component/icons';
import { Checklist } from '@/definitions/types';
import { useStateStore } from './useStateStore';

export function ChecklistView({
  item: { shortId, name, items },
}: {
  item: Checklist;
}) {
  const { checkedItems, toggleChecked } = useStateStore({ shortId });

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <div className="text-center text-xl text-gray-700">{name}</div>
      <div className="py-6 text-center text-gray-500 italic">
        {!items.length && <div>No items</div>}
      </div>
      {items.map((item) => {
        const { checklistItemId, name, note } = item;

        return (
          <div
            key={checklistItemId}
            className="flex items-center border-b border-b-gray-200 py-2 pl-1 last:border-0"
          >
            <div className="flex-1">
              <div className="font-medium">{name}</div>
              {note && <div className="text-gray-500">{note}</div>}
            </div>
            <div>
              <IconButton
                onClick={() => toggleChecked(checklistItemId)}
                className="hover:bg-gray-100 active:bg-gray-100"
                size="medium"
              >
                {checkedItems.includes(checklistItemId) ? (
                  <CheckBoxCheckedIcon />
                ) : (
                  <CheckBoxBlankIcon />
                )}
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}
