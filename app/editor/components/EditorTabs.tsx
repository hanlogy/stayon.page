import { ButtonGroup, clsx } from '@hanlogy/react-web-ui';
import { useEditorContext } from '../state/hooks';
import { EditorTabName } from '../state/type';

export interface EditorTabItem {
  value: EditorTabName;
  label: string;
}

const tabItems: EditorTabItem[] = [
  { value: 'detail', label: 'Details' },
  { value: 'settings', label: 'Access & Expiry' },
];

export function EditorTabs() {
  const { tabName, setTabName } = useEditorContext();
  return (
    <ButtonGroup
      className="w-full max-w-80"
      items={tabItems}
      value={tabName}
      buttonBuilder={({ isSelected, isFirst, isLast, item }) => {
        return (
          <button
            type="button"
            onClick={() => setTabName(item.value)}
            key={item.value}
            className={clsx(
              'h-10',
              {
                'rounded-l-full': isFirst,
                'rounded-r-full': isLast,
              },
              isSelected
                ? 'bg-gray-500 text-white'
                : 'cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            {item.label}
          </button>
        );
      }}
    />
  );
}
