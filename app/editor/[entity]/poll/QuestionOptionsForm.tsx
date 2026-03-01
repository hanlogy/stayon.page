import { IconButton, TextInput } from '@hanlogy/react-web-ui';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { OutlinedButton } from '@/component/buttons';
import { type PollQuestionOption } from '@/definitions/types';

export function QuestionOptionsForm({
  options,
  onAdd,
  onRemove,
  onChange,
}: {
  options: PollQuestionOption[];
  onRemove: (id: string) => void;
  onAdd: () => void;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <>
      <div className="pt-4 pb-2 text-lg font-medium">Options</div>
      <div className="space-y-4">
        {options.map(({ pollQuestionOptionId, label }) => {
          return (
            <div key={pollQuestionOptionId} className="flex items-center">
              <div className="flex-1">
                <TextInput
                  defaultValue={label}
                  onChange={(e) =>
                    onChange(pollQuestionOptionId, e.currentTarget.value)
                  }
                  name="title"
                  className="rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>
              <IconButton
                onClick={() => {
                  onRemove(pollQuestionOptionId);
                }}
              >
                <Trash2Icon size={18} />
              </IconButton>
            </div>
          );
        })}
      </div>
      <div className="pt-4 pb-2 text-center">
        <OutlinedButton
          onClick={() => {
            onAdd();
          }}
          size="xsmall"
          icon={<PlusIcon size={16} />}
          className="w-40"
        >
          Option
        </OutlinedButton>
      </div>
    </>
  );
}
