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
      if (a % b !== 0) return NaN; // Must result in integers only
      return a / b;
    default:
      return NaN; // Should not happen with defined OPERATIONS
  }
};

/**
 * Evaluates a full arithmetic expression string from left-to-right.
 * Assumes the expression is well-formed (e.g., "num op num op num").
 * @param expression The arithmetic expression string.
 * @returns The numeric result of the expression, or NaN if any operation is invalid.
 */
const evaluateExpressionString = (expression: string): number => {
  // Split the expression into numbers and operators, maintaining order
  // This regex matches either a sequence of digits OR any of the operators
  const parts = expression.match(/(\d+)|([+\-*/])/g);

  if (!parts || parts.length === 0) {
    return NaN;
  }

  let currentVal: number = parseFloat(parts[0]);
  if (isNaN(currentVal)) return NaN;

  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i]; // Operator
    const nextNumStr = parts[i + 1]; // Next number as string

    // Ensure operator and next number string exist
    if (!op || !nextNumStr) {
      return NaN; // Malformed expression, e.g., ends with an operator
    }

    const nextNum = parseFloat(nextNumStr);
    if (isNaN(nextNum)) {
      return NaN; // Next part is not a valid number
    }

    currentVal = evaluateOperation(currentVal, op, nextNum);
    if (isNaN(currentVal)) {
      return NaN; // Propagate NaN from evaluateOperation (e.g., division by zero)
    }
  }
  return currentVal;
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
    const bestExpressions = new Set<string>(); // Use a Set to store unique expressions

    const permutations = getPermutations(nums);

    for (const perm of permutations) {
      // Recursive function to explore operator combinations for a given number permutation
      const exploreOperators = (
        index: number,
        currentValue: number,
        currentExpression: string,
      ) => {
        // Base case: All numbers in the current permutation have been used
        if (index === perm.length) {
          const diff = Math.abs(currentValue - target);

          if (diff < bestDiff) {
            bestDiff = diff;
            bestExpressions.clear(); // Clear previous best if a new better one is found
            bestExpressions.add(currentExpression);
          } else if (diff === bestDiff) {
            bestExpressions.add(currentExpression); // Add to set if it's equally good
          }
          return;
        }

        // Recursive step: Try all operations with the next number
        for (const op of OPERATIONS) {
          // Assert that perm[index] is a number because `index` is always valid here
          // (checked by `index === perm.length` base case)
          const nextNum = perm[index]!;
          const nextValue = evaluateOperation(currentValue, op, nextNum);

          // If evaluation resulted in NaN (invalid operation like division by zero or non-integer division), skip this path
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

      // Start exploring operators with the first number of the current permutation
      // Assert that perm[0] is a number because permutations generated from non-empty nums are non-empty
      exploreOperators(1, perm[0]!, perm[0]!.toString());
    }

    if (bestExpressions.size === 0) {
      // This case should ideally not be reached if numbers are provided and operations are possible
      return "No solution found";
    } else if (bestExpressions.size > 1) {
      // Check if any of the best expressions is an exact match (diff is 0)
      // We re-evaluate using the new robust `evaluateExpressionString`
      const hasExactMatch = Array.from(bestExpressions).some((expr) => {
        return evaluateExpressionString(expr) === target;
      });

      // If bestDiff is 0 and there are multiple expressions that achieve it, return "No single solution"
      // Or if bestDiff > 0 and multiple expressions achieve the same closest result, also "No single solution"
      if (bestDiff === 0 && hasExactMatch) {
        return "No single solution"; // Multiple exact solutions
      } else if (bestDiff > 0 && bestExpressions.size > 1) {
        return "No single solution"; // Multiple closest solutions
      }
      // If bestDiff is 0 and only one expression, it's the unique exact solution.
      // If bestDiff > 0 and only one expression, it's the unique closest solution.
    }

    // If we reach here, there's exactly one best expression (either exact or closest)
    // Assert that .value is a string because we know bestExpressions.size is 1
    return bestExpressions.values().next().value!;
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
    // numbers.sort((a, b) => a - b); // Sorting is not strictly necessary for permutation generation, can remove if desired.

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
