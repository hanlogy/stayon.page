import { ReactNode } from 'react';
import { PollAnswersResponse } from '@/actions/getPollAnswers';
import { AuthForm } from '@/component/AuthForm/AuthForm';
import { Poll } from '@/definitions';
import { VoteProgressBar } from './VoteProgressBar';

export function ResultView({
  poll: { shortId, questions },
  answers: { error, data: answers = [] },
}: {
  poll: Poll;
  answers: PollAnswersResponse;
}) {
  if (error) {
    let errorContent: ReactNode;

    switch (error.data.reason) {
      case 'notClosed':
        errorContent = 'The result will be available when the voting closes';
        break;
      case 'needAdminAccess':
        errorContent = (
          <>
            <div className="mb-4 text-lg">
              It requires admin access to see the voting result.
            </div>
            <AuthForm type="adminAccess" shortId={shortId} />
          </>
        );
        break;
    }

    return (
      <div className="sm:px-4">
        <div className="bg-gray-50 px-4 py-6 text-center sm:rounded-2xl">
          {errorContent}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(({ pollQuestionId, title, options }) => {
        const selectedOptions = answers
          .filter((e) => e.pollQuestionId === pollQuestionId)
          .flatMap((e) => e.optionIds);

        return (
          <div className="sm:px-4" key={pollQuestionId}>
            <div className="bg-gray-50 px-4 pt-8 pb-6 sm:rounded-2xl sm:px-6">
              <div className="text-xl">{title}</div>
              <div className="mt-4 space-y-6">
                {options.map(({ label, pollQuestionOptionId }) => {
                  const votes = selectedOptions.reduce((prev, optionId) => {
                    return optionId === pollQuestionOptionId ? prev + 1 : prev;
                  }, 0);

                  return (
                    <VoteProgressBar
                      key={pollQuestionOptionId}
                      label={label}
                      totalVotes={selectedOptions.length}
                      optionVotes={votes}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
