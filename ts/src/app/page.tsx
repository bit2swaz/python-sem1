// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans text-gray-100">
      <div className="container flex max-w-2xl flex-col items-center justify-center gap-12 rounded-2xl border border-gray-700 bg-gray-900 px-4 py-16 shadow-2xl transition-all duration-500 ease-in-out">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-gray-100 sm:text-[5rem]">
          Problem <span className="text-gray-400">Solutions</span>
        </h1>
        <p className="mb-8 text-center text-lg text-gray-300">
          Navigate to the solutions for the programming problems below.
        </p>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {/* Link to Subsidy Computation Problem */}
          <Link
            href="/subsidy-computation"
            className="flex max-w-xs transform flex-col gap-4 rounded-xl border border-gray-600 bg-gray-800 p-6 text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700"
          >
            <h3 className="text-2xl font-bold">Subsidy Computation →</h3>
            <div className="text-lg">
              Calculate agricultural subsidies based on crop type, yield, and
              market rate.
            </div>
          </Link>

          {/* Add more links here as you solve more problems */}
          {/*
          <Link
            href="/climate-change-data-analyzer"
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-gray-800 p-6 text-gray-100 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md border border-gray-600"
          >
            <h3 className="text-2xl font-bold">Climate Change Data Analyzer →</h3>
            <div className="text-lg">
              Analyze temperature data to find highest, lowest, and average.
            </div>
          </Link>
          */}
        </div>
      </div>
    </main>
  );
}
