'use client';

interface Step {
  label: string;
  sub: string;
}

const STEPS: Step[] = [
  { label: 'Personal', sub: 'Info' },
  { label: 'University', sub: 'Details' },
  { label: 'Banking', sub: 'Info' },
  { label: 'Address', sub: 'Details' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base" aria-label="Registration progress">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = stepNumber === STEPS.length;

        return (
          <li
            key={stepNumber}
            className={[
              'flex items-center',
              !isLast
                ? "md:w-full sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-brand-border after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10"
                : '',
              isCompleted || isCurrent ? 'text-brand-orange' : 'text-gray-500',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 whitespace-nowrap">
              {isCompleted ? (
                <>
                  <span
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5 inline-flex items-center justify-center rounded-full bg-brand-orange text-white text-xs font-bold"
                    aria-hidden="true"
                  >
                    &#10003;
                  </span>
                  <span className="sr-only">completed</span>
                </>
              ) : (
                <span className="me-2">{stepNumber}</span>
              )}
              {step.label}
              <span className="hidden sm:inline-flex sm:ms-2">{step.sub}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
