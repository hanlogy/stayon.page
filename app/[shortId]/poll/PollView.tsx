import clsx from 'clsx';
import { ChartPieIcon, CircleQuestionMarkIcon } from 'lucide-react';
import { PollAnswersResponse } from '@/actions/getPollAnswers';
import { LazyLink } from '@/component/LazyLink';
import type { Poll } from '@/definitions';
import { QuestionsForm } from './QuestionsForm';
import { ResultView } from './ResultView';

const tabItems = [
  { view: 'questions', Icon: CircleQuestionMarkIcon, label: 'Questions' },
  { view: 'result', Icon: ChartPieIcon, label: 'Result' },
];

export function PollView({
  item,
}: {
  item: Poll & { pollAnswers?: PollAnswersResponse };
}) {
  const { shortId, name, questions, isClosed, note, pollAnswers } = item;
  const currentView = pollAnswers ? 'result' : 'questions';

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="mb-2 flex flex-col px-4">
        <div className="text-center text-lg text-gray-800 sm:text-left">
          {name}
        </div>
        {note && <div className="mt-1 text-gray-500">{note}</div>}
        <div className="mt-4 flex self-center sm:self-end">
          {tabItems.map(({ view, Icon, label }) => {
            return (
              <LazyLink
                key={view}
                href={`?view=${view}`}
                className={clsx(
                  'flex-center h-10 px-4 first:rounded-l-full last:rounded-r-full',
                  {
                    'bg-gray-100 font-medium text-green-600':
                      currentView === view,
                    'bg-gray-100 text-gray-500': currentView !== view,
                  }
                )}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </LazyLink>
            );
          })}
        </div>
      </div>
      {currentView === 'questions' && (
        <QuestionsForm
          isClosed={isClosed}
          questions={questions}
          shortId={shortId}
        />
      )}
      {pollAnswers && <ResultView poll={item} answers={pollAnswers} />}
    </div>
  );
}
