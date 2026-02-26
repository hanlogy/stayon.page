'use client';

import { SubmitEvent, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { Poll, PollQuestion, PollVoteAnswer } from '@/definitions/types';
import { QuestionCard } from './QuestionCard';
import { VoteButton } from './VoteButton';

interface FormData {
  name: string;
}
export function PollView({ item: { name, questions, note } }: { item: Poll }) {
  const { register, validate } = useForm<FormData>();
  const [answers, setAnswers] = useState<PollVoteAnswer[]>(
    questions.map(({ pollQuestionId }) => ({ pollQuestionId, optionIds: [] }))
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
  };

  const handleOnSelectOption = (question: PollQuestion, optionId: string) => {
    setAnswers((prev) => {
      return prev.map((answer) => {
        if (answer.pollQuestionId !== question.pollQuestionId) {
          return answer;
        }
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 pb-10">
      <div className="text-gray-800">{name}</div>
      {note && <div className="mt-1 text-gray-500">{note}</div>}
      <div className="mt-6 space-y-8">
        <div className="w-60">
          <TextField
            label="Your name"
            controller={register('name', {
              validator: ({ name }) => {
                if (!name?.trim()) {
                  return 'Name is required';
                }
              },
            })}
          />
        </div>
        {questions.map((question) => {
          return (
            <QuestionCard
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
        <VoteButton />
      </div>
    </form>
  );
}
