import { useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import { PollQuestion } from '@/definitions/types';
import { QuestionEditorDialog } from './QuestionEditorDialog';

export function usePollQuestionDialog(initialData?: readonly PollQuestion[]) {
  const { openDialog } = useDialog();
  const [questions, setQuestions] = useState<readonly PollQuestion[]>(
    initialData ?? []
  );

  const openQuestionDialog = async (question?: PollQuestion) => {
    const result = await openDialog<PollQuestion>(
      ({ closeDialog }) => (
        <QuestionEditorDialog
          initialData={question}
          closeDialog={closeDialog}
        />
      ),
      { closeOnBackdropClick: false }
    );

    if (!result) {
      return;
    }
    console.log(result);

    if (question) {
      setQuestions((prev) =>
        prev.map((e) =>
          e.pollQuestionId === question.pollQuestionId ? result : e
        )
      );
    } else {
      setQuestions((prev) => [...prev, result]);
    }
  };

  return {
    questions,
    setQuestions,
    openQuestionDialog,
  };
}
