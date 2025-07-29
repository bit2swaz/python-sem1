"use client";

import React, { useState } from "react";

const OPERATIONS = ["+", "-", "*", "/"];

/**
 * Evaluates a simple left-to-right arithmetic operation.
 * Handles integer division and division by zero.
 * @param a The first operand.
 * @param op The operator ('+', '-', '*', '/').
 * @param b The second operand.
 * @returns The result of the operation, or NaN if division by zero or non-integer division.
 */
const evaluateOperation = (a: number, op: string, b: number): number => {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return NaN;
      if (a % b !== 0) return NaN;
      return a / b;
    default:
      return NaN;
  }
};

/**
 * Generates all permutations of an array.
 * @param arr The input array.
 * @returns A 2D array containing all permutations.
 */
const getPermutations = <T,>(arr: T[]): T[][] => {
  if (arr.length === 0) return [[]];
  if (arr.length === 1) return [arr];

  const result: T[][] = [];
  arr.forEach((item, i) => {
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const innerPermutations = getPermutations(remaining);
    innerPermutations.forEach((p) => {
      result.push([item, ...p]);
    });
  });
  return result;
};

const NumberGameSolver: React.FC = () => {
  const [numbersInput, setNumbersInput] = useState<string>("");
  const [targetInput, setTargetInput] = useState<string>("");
  const [solution, setSolution] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const solveNumberGame = (nums: number[], target: number): string => {
    if (nums.length === 0) {
      return "Error: No numbers provided.";
    }
    if (nums.length === 1) {
      return nums[0] === target ? nums[0].toString() : "No solution found";
    }

    let bestDiff = Infinity;
    const bestExpressions = new Set<string>();

    const permutations = getPermutations(nums);

    for (const perm of permutations) {
      const exploreOperators = (
        index: number,
        currentValue: number,
        currentExpression: string,
      ) => {
        if (index === perm.length) {
          const diff = Math.abs(currentValue - target);

          if (diff < bestDiff) {
            bestDiff = diff;
            bestExpressions.clear();
            bestExpressions.add(currentExpression);
          } else if (diff === bestDiff) {
            bestExpressions.add(currentExpression);
          }
          return;
        }

        for (const op of OPERATIONS) {
          const nextNum = perm[index];
          const nextValue = evaluateOperation(currentValue, op, nextNum);

          // If evaluation resulted in NaN (invalid operation like division by zero or non-integer division), skip
          if (isNaN(nextValue)) {
            continue;
          }

          exploreOperators(
            index + 1,
            nextValue,
            `${currentExpression}${op}${nextNum}`,
          );
        }
      };

      // Start exploring operators with the first number of the permutation
      exploreOperators(1, perm[0], perm[0].toString());
    }

    if (bestExpressions.size === 0) {
      return "No solution found"; // Should ideally not happen if numbers are provided
    } else if (bestExpressions.size > 1) {
      // Check if any of the best expressions is an exact match
      const exactMatch = Array.from(bestExpressions).find((expr) => {
        // Re-evaluate the expression to be sure, though it should match bestDiff
        const parts = expr.match(/(\d+)([+\-*/])(\d+)/g) || []; // Simple regex for parts, needs careful evaluation
        let val = parseInt(expr.split(/[+\-*/]/)[0] || "0"); // Start with first number
        for (const part of parts) {
          const match = /(\d+)([+\-*/])(\d+)/.exec(part);
          if (match) {
            const [, num1Str, op, num2Str] = match;
            val = evaluateOperation(val, op, parseInt(num2Str));
          }
        }
        return val === target;
      });

      if (bestDiff === 0 && exactMatch) {
        return "No single solution";
      } else if (bestDiff === 0) {
        // This case should be covered by exactMatch check, but as a fallback
        return "No single solution";
      }
      return "No single solution";
    } else {
      return bestExpressions.values().next().value;
    }
  };

  const handleSolve = () => {
    setSolution(null);
    setErrorMessage(null);

    const rawNumbers = numbersInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const numbers: number[] = [];

    if (rawNumbers.length === 0) {
      setErrorMessage("Please enter at least one number.");
      return;
    }

    for (const numStr of rawNumbers) {
      const num = parseInt(numStr);
      if (isNaN(num) || num <= 0) {
        setErrorMessage(
          `Invalid number found: "${numStr}". All numbers must be positive integers.`,
        );
        return;
      }
      numbers.push(num);
    }

    const target = parseInt(targetInput.trim());
    if (isNaN(target)) {
      setErrorMessage("Invalid Target. Please enter an integer.");
      return;
    }

    // Sort numbers to handle permutations more efficiently if needed, though getPermutations handles it.
    // For this problem, the order of input numbers doesn't matter for the set of numbers,
    // but their order in an expression does. So, sorting before permuting is fine.
    numbers.sort((a, b) => a - b);

    // If there's only one number and it's not the target, it's not a solution.
    // The `solveNumberGame` function handles this more robustly now.

    const result = solveNumberGame(numbers, target);
    setSolution(result);
  };

  const handleClear = () => {
    setNumbersInput("");
    setTargetInput("");
    setSolution(null);
    setErrorMessage(null);
  };

  // Determine message color based on solution type
  const solutionColorClass =
    solution === "No single solution" || solution?.startsWith("Error:")
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl transition-all duration-500 ease-in-out">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-100">
          Numeria Number Game
        </h1>

        <div className="mb-4">
          <label
            htmlFor="numbers"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Numbers (comma-separated, e.g., &quot;2,3,5&quot;):
          </label>
          <input
            type="text"
            id="numbers"
            className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
            placeholder="e.g., 2,3,5"
            value={numbersInput}
            onChange={(e) => setNumbersInput(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="target"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Target:
          </label>
          <input
            type="number"
            id="target"
            className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
            placeholder="e.g., 17"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
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
            onClick={handleSolve}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-700 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            Find Solution
          </button>
          <button
            onClick={handleClear}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-800 px-6 py-3 font-bold text-gray-300 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          >
            Clear
          </button>
        </div>

        {solution && (
          <div
            className={`mt-8 rounded-xl p-6 shadow-inner transition-all duration-500 ease-in-out ${solutionColorClass === "text-green-400" ? "border border-green-700 bg-green-900" : "border border-red-700 bg-red-900"}`}
          >
            <h2 className={`mb-4 text-xl font-bold ${solutionColorClass}`}>
              Result:
            </h2>
            <p className={`text-lg font-semibold ${solutionColorClass}`}>
              {solution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberGameSolver;
