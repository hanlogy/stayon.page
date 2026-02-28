import type { PollResultsVisibility } from '@/definitions';

export function ResultView({
  resultsVisibility,
  isClosed,
}: {
  resultsVisibility: PollResultsVisibility;
  isClosed: boolean;
}) {
  const errorMessage = (() => {
    if (resultsVisibility === 'afterClose' && !isClosed) {
      return 'The result will be available when the voting closes.';
    }
    if (resultsVisibility === 'admin') {
      return 'It requires admin access to see the voting result.';
    }

    return undefined;
  })();
  return (
    <div className="sm:px-4">
      <div className="bg-gray-50 px-4 py-6 text-center sm:rounded-2xl">
        {errorMessage}
      </div>
    </div>
  );
}
