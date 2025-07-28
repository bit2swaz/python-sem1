"use client";

import React, { useState } from "react";

interface TemperatureAnalysisResult {
  highest: number;
  lowest: number;
  average: number;
}

const ClimateAnalyzer: React.FC = () => {
  const [temperatureInput, setTemperatureInput] = useState<string>("");
  const [result, setResult] = useState<TemperatureAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = () => {
    setResult(null); // Clear previous results
    setErrorMessage(null); // Clear previous errors

    const tempStrings = temperatureInput
      .trim()
      .split(" ")
      .filter((s) => s !== "");

    if (tempStrings.length < 2) {
      setErrorMessage("Input must have at least two temperature values.");
      return;
    }

    const temperatures: number[] = [];
    for (const tempStr of tempStrings) {
      const temp = parseFloat(tempStr);

      if (isNaN(temp)) {
        setErrorMessage(
          `Invalid temperature value found: "${tempStr}". All values must be numeric.`,
        );
        return;
      }
      if (temp < -100.0 || temp > 60.0) {
        setErrorMessage(
          `Temperature "${temp}" is out of realistic range (-100.0°C to 60.0°C).`,
        );
        return;
      }
      temperatures.push(temp);
    }

    // After all validations, ensure we still have at least two valid temperatures
    if (temperatures.length < 2) {
      setErrorMessage(
        "Input must have at least two valid temperature values after parsing.",
      );
      return;
    }

    const highest = Math.max(...temperatures);
    const lowest = Math.min(...temperatures);
    const sum = temperatures.reduce((acc, curr) => acc + curr, 0);
    const average = parseFloat((sum / temperatures.length).toFixed(2)); // Round to two decimal places

    setResult({ highest, lowest, average });
  };

  const handleClear = () => {
    setTemperatureInput("");
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl transition-all duration-500 ease-in-out">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-100">
          Climate Change Data Analyzer
        </h1>

        <div className="mb-6">
          <label
            htmlFor="temperatures"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Enter Temperatures (space-separated, e.g., &quot;25.4 27.8
            26.5&quot;):
          </label>
          <input
            type="text"
            id="temperatures"
            className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
            placeholder="e.g., 30.5 32.1 29.8"
            value={temperatureInput}
            onChange={(e) => setTemperatureInput(e.target.value)}
          />
        </div>

        {errorMessage && (
          <div
            className="relative mb-6 rounded-xl border border-red-700 bg-red-900 px-4 py-3 text-red-300 transition-all duration-300 ease-in-out"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="ml-2 block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleAnalyze}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-700 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            Analyze Temperatures
          </button>
          <button
            onClick={handleClear}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-800 px-6 py-3 font-bold text-gray-300 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-inner transition-all duration-500 ease-in-out">
            <h2 className="mb-4 text-xl font-bold text-gray-200">
              Analysis Result:
            </h2>
            <p className="mb-2 text-gray-300">
              <span className="font-semibold">Highest:</span> {result.highest}°C
            </p>
            <p className="mb-2 text-gray-300">
              <span className="font-semibold">Lowest:</span> {result.lowest}°C
            </p>
            <p className="mt-4 text-xl font-bold text-gray-100">
              <span className="text-gray-400">Average:</span> {result.average}°C
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateAnalyzer;
