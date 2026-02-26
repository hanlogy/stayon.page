import { IconWrapper } from '@hanlogy/react-web-ui';
import { CheckBoxBlankIcon, CheckBoxCheckedIcon } from '@/component/icons';
import { PollQuestion } from '@/definitions/types';

export function QuestionCard({
  question,
  answer = [],
  onSelectOption,
}: {
  question: PollQuestion;
  answer?: string[];
  onSelectOption: (question: PollQuestion, optionId: string) => void;
}) {
  const { title, options } = question;
  return (
    <>
      <div className="text-xl">{title}</div>
      <div className="mt-2">
        {options.map(({ pollQuestionOptionId, label }) => {
          return (
            <div key={pollQuestionOptionId}>
              <button
                onClick={() => onSelectOption(question, pollQuestionOptionId)}
                type="button"
                className="flex h-12 items-center text-left text-gray-600 hover:text-gray-800"
              >
                <IconWrapper className="mr-2">
                  {answer.includes(pollQuestionOptionId) ? (
                    <CheckBoxCheckedIcon />
                  ) : (
                    <CheckBoxBlankIcon />
                  )}
                </IconWrapper>
                <div className="flex-1">{label}</div>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
