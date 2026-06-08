interface ProfileCompletionStatusProps {
  isComplete: boolean
}

export function ProfileCompletionStatus({ isComplete }: ProfileCompletionStatusProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Profile Status</h2>
          <p className="mt-1 text-sm text-stone-600">
            {isComplete ? 'Complete and ready for requirements.' : 'Incomplete'}
          </p>
        </div>
        <span
          className={[
            'inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium',
            isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
          ].join(' ')}
        >
          {isComplete ? 'Complete' : 'Needs profile'}
        </span>
      </div>
    </section>
  )
}
