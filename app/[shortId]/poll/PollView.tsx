'use client';

import { SubmitEvent, useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/component/buttons';
import { Poll, PollQuestion, PollVoteAnswer } from '@/definitions/types';
import { QuestionCard } from './QuestionCard';
import { VoteDialog } from './VoteDialog';

export function PollView({
  item: { shortId, name, questions, note },
}: {
  item: Poll;
}) {
  const [answers, setAnswers] = useState<PollVoteAnswer[]>(
    questions.map(({ pollQuestionId }) => ({ pollQuestionId, optionIds: [] }))
  );

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { openDialog } = useDialog();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    for (const { isRequired, pollQuestionId } of questions) {
      if (!isRequired) {
        continue;
      }
      const selectedOptions = answers.find(
        (e) => e.pollQuestionId === pollQuestionId
      )?.optionIds;

      if (!selectedOptions?.length) {
        setErrors({ ...errors, [pollQuestionId]: 'Required' });
        return;
      }
    }

    openDialog(({ closeDialog }) => {
      return (
        <VoteDialog
          shortId={shortId}
          answers={answers}
          closeDialog={closeDialog}
        />
      );
    });
  };

  const handleOnSelectOption = (question: PollQuestion, optionId: string) => {
    setAnswers((prev) => {
      return prev.map((answer) => {
        if (answer.pollQuestionId !== question.pollQuestionId) {
          return answer;
        }
        setErrors({ ...errors, [question.pollQuestionId]: undefined });

        const { pollQuestionId, optionIds } = answer;
        const isMultiple = question.isMultiple;
        let optionUpdated: string[];
        if (isMultiple) {
          optionUpdated = optionIds.includes(optionId)
            ? optionIds.filter((e) => e !== optionId)
            : [...optionIds, optionId];
        } else {
          optionUpdated = [optionId];
        }

        return {
          pollQuestionId,
          optionIds: optionUpdated,
        };
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl pb-10">
      <div className="px-4">
        <div className="text-lg text-gray-800">{name}</div>
        {note && <div className="mt-1 text-gray-500">{note}</div>}
      </div>
      <div className="mt-6 space-y-4">
        {questions.map((question) => {
          return (
            <QuestionCard
              error={errors[question.pollQuestionId]}
              onSelectOption={handleOnSelectOption}
              answer={
                answers.find(
                  (e) => e.pollQuestionId === question.pollQuestionId
                )?.optionIds
              }
              key={question.pollQuestionId}
              question={question}
            />
          );
        })}
      </div>
      <div className="flex-center py-10">
        <FilledButton type="submit" size="medium" className="min-w-40">
          Vote
        </FilledButton>
      </div>
    </form>
  );
}
