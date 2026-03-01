import { useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import { type PollQuestion } from '@/definitions';
import { QuestionEditorDialog } from './QuestionEditorDialog';

export function usePollQuestionDialog({
  initialData,
  onChange,
}: {
  initialData?: readonly PollQuestion[];
  onChange: () => void;
}) {
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

    if (question) {
      setQuestions((prev) =>
        prev.map((e) =>
          e.pollQuestionId === question.pollQuestionId ? result : e
        )
      );
    } else {
      setQuestions((prev) => [...prev, result]);
    }
    onChange();
  };

  return {
    questions,
    setQuestions,
    openQuestionDialog,
  };
}
