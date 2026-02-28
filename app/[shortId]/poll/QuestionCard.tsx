import { IconWrapper } from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import {
  CheckBoxBlankIcon,
  CheckBoxCheckedIcon,
  RadioBlankIcon,
  RadioCheckedIcon,
} from '@/component/icons';
import type { PollQuestion } from '@/definitions';

export function QuestionCard({
  error,
  question,
  answer = [],
  onSelectOption,
}: {
  error?: string;
  question: PollQuestion;
  answer?: string[];
  onSelectOption: (question: PollQuestion, optionId: string) => void;
}) {
  const { title, options } = question;
  return (
    <div className="sm:px-4">
      <div className="bg-gray-50 px-4 pt-8 pb-6 sm:rounded-2xl sm:px-6">
        <div
          className={clsx('text-xl', {
            'text-red-600': !!error,
          })}
        >
          {title}
        </div>
        {error && (
          <div className="mt-1 text-sm font-semibold text-red-600">{error}</div>
        )}
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
                      question.isMultiple ? (
                        <CheckBoxCheckedIcon />
                      ) : (
                        <RadioCheckedIcon />
                      )
                    ) : question.isMultiple ? (
                      <CheckBoxBlankIcon />
                    ) : (
                      <RadioBlankIcon />
                    )}
                  </IconWrapper>
                  <div className="flex-1">{label}</div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
