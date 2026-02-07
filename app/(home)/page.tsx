import clsx from 'clsx';
import { CreateCards } from './components/CreateCards';

export default function HomePage() {
  return (
    <>
      <main className="">
        <div className="mt-8 mb-10 text-center md:mt-10 md:mb-12 lg:mt-12 lg:mb-16">
          <div className="mb-2 text-gray-500 lg:mb-4 lg:text-lg">
            No account, no tracking
          </div>
          <h2 className="text-3xl font-medium text-gray-600 md:text-4xl lg:text-5xl">
            I want to create...
          </h2>
        </div>
        <div className="bg-gray-50">
          <div
            className={clsx(
              'mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 py-8',
              'sm:grid-cols-2 sm:px-8 sm:py-10',
              'md:py-14',
              'lg:gap-6 lg:py-20'
            )}
          >
            <CreateCards />
          </div>
        </div>
      </main>
    </>
  );
}
