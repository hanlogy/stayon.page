import { ReactNode, useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

export function WithExtraFields({
  children,
  extra,
  label,
  isExpandedDefault,
  onToggle,
}: {
  children: ReactNode;
  extra: ReactNode;
  label: string;
  isExpandedDefault: boolean;
  onToggle?: (isExpanded: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const toggleButton = (
    <button
      type="button"
      onClick={() => {
        setIsExpanded((prev) => {
          onToggle?.(!prev);
          return !prev;
        });
      }}
      className="mt-3 flex cursor-pointer items-center text-sm font-medium text-blue-500 hover:text-blue-800"
    >
      {isExpanded ? (
        <MinusIcon className="mr-1" size={16} />
      ) : (
        <PlusIcon className="mr-1" size={16} />
      )}
      {label}
    </button>
  );

  return (
    <>
      <div>
        {children}
        {!isExpanded && toggleButton}
      </div>
      {isExpanded && (
        <div>
          {extra}
          {toggleButton}
        </div>
      )}
    </>
  );
}
