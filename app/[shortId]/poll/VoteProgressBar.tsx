export function VoteProgressBar({
  totalVotes,
  optionVotes,
  label,
}: {
  totalVotes: number;
  optionVotes: number;
  label: string;
}) {
  const safeTotal = Math.max(0, totalVotes);
  const safeOption = Math.max(0, optionVotes);
  const clampedOption = safeTotal === 0 ? 0 : Math.min(safeOption, safeTotal);

  const percent = safeTotal === 0 ? 0 : (clampedOption / safeTotal) * 100;

  return (
    <div>
      <div className="mb-2 flex items-baseline-last">
        <div className="mr-2 flex-1">{label}</div>
        <div className="text-sm text-slate-600">
          {clampedOption}/{safeTotal}
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gray-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
