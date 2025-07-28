/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/components/subsidy-calculator.tsx
"use client"; // This directive makes this component a Client Component

import React, { useState } from "react";
import { CropType, type CropDetails } from "../types"; // Import types from your new types file

// Main SubsidyCalculator component
const SubsidyCalculator: React.FC = () => {
  // State variables for user inputs
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [marketRateInput, setMarketRateInput] = useState<string>("");
  const [yieldInput, setYieldInput] = useState<string>("");

  // State variables for output and messages
  const [result, setResult] = useState<CropDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);

  /**
   * Calculates the agricultural subsidy based on the crop type, yield, and market rate.
   * @param cropType The type of crop (Rice, Wheat, or Maize).
   * @param yieldAmount The yield of the crop.
   * @param marketRate The market rate of the crop.
   * @returns The calculated subsidy amount.
   * @throws Error if an invalid crop type is provided.
   */
  const calculateSubsidy = (
    cropType: CropType,
    yieldAmount: number,
    marketRate: number,
  ): number => {
    let subsidy: number;
    const baseSubsidy = yieldAmount * marketRate;

    switch (cropType) {
      case CropType.Rice:
        subsidy = baseSubsidy + 100;
        break;
      case CropType.Wheat:
        subsidy = baseSubsidy + 200;
        break;
      case CropType.Maize:
        subsidy = baseSubsidy + 300;
        break;
      default:
        // This case should ideally not be reached if input validation is strict
        throw new Error("Invalid crop type selected.");
    }
    return subsidy;
  };

  /**
   * Handles the calculation logic when the "Calculate Subsidy" button is clicked.
   * Performs input validation and updates the result or error message.
   */
  const handleCalculate = () => {
    setErrorMessage(null); // Clear previous errors
    setResult(null); // Clear previous results

    if (selectedCrop === null) {
      setErrorMessage("Please select a crop type.");
      return;
    }

    const marketRate = parseFloat(marketRateInput);
    if (isNaN(marketRate) || marketRate <= 0) {
      setErrorMessage("Invalid Market Rate. Please enter a positive number.");
      return;
    }

    const yieldAmount = parseFloat(yieldInput);
    if (isNaN(yieldAmount) || yieldAmount <= 0) {
      setErrorMessage("Invalid Yield. Please enter a positive number.");
      return;
    }

    try {
      const subsidyAmount = calculateSubsidy(
        selectedCrop,
        yieldAmount,
        marketRate,
      );
      let cropName: string;
      switch (selectedCrop) {
        case CropType.Rice:
          cropName = "Rice";
          break;
        case CropType.Wheat:
          cropName = "Wheat";
          break;
        case CropType.Maize:
          cropName = "Maize";
          break;
        default:
          cropName = "Unknown";
      }

      setResult({
        type: cropName,
        yieldAmount: yieldAmount,
        marketRate: marketRate,
        subsidy: subsidyAmount,
      });
    } catch (error: any) {
      setErrorMessage(`Calculation Error: ${error.message}`);
    }
  };

  /**
   * Resets the form to allow for a new calculation.
   */
  const handleContinue = () => {
    setSelectedCrop(null);
    setMarketRateInput("");
    setYieldInput("");
    setResult(null);
    setErrorMessage(null);
    setShowThankYou(false);
  };

  /**
   * Sets the state to display the "Thank You" message and hide the input form.
   */
  const handleExit = () => {
    setShowThankYou(true);
    setResult(null); // Clear any displayed results
    setErrorMessage(null); // Clear any errors
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl transition-all duration-500 ease-in-out">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-100">
          Agricultural Subsidy Calculator
        </h1>

        {showThankYou ? (
          <div className="py-10 text-center transition-opacity duration-500 ease-in-out">
            <p className="mb-4 text-2xl font-semibold text-gray-200">
              Thank you!
            </p>
            <p className="text-gray-400">
              We appreciate your use of the subsidy calculator.
            </p>
            <button
              onClick={handleContinue}
              className="focus:ring-opacity-75 mt-8 transform rounded-xl bg-gray-700 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            >
              Start New Calculation
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 transition-opacity duration-500 ease-in-out">
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Select Crop Type:
              </label>
              <div className="flex flex-col space-y-3">
                <label className="inline-flex cursor-pointer items-center text-gray-100">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 rounded-full border-gray-600 bg-gray-700 text-gray-500 transition-colors duration-200 focus:ring-gray-400 focus:ring-offset-gray-900"
                    name="cropType"
                    value={CropType.Rice}
                    checked={selectedCrop === CropType.Rice}
                    onChange={() => setSelectedCrop(CropType.Rice)}
                  />
                  <span className="ml-2 text-lg">1. Rice</span>
                </label>
                <label className="inline-flex cursor-pointer items-center text-gray-100">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 rounded-full border-gray-600 bg-gray-700 text-gray-500 transition-colors duration-200 focus:ring-gray-400 focus:ring-offset-gray-900"
                    name="cropType"
                    value={CropType.Wheat}
                    checked={selectedCrop === CropType.Wheat}
                    onChange={() => setSelectedCrop(CropType.Wheat)}
                  />
                  <span className="ml-2 text-lg">2. Wheat</span>
                </label>
                <label className="inline-flex cursor-pointer items-center text-gray-100">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 rounded-full border-gray-600 bg-gray-700 text-gray-500 transition-colors duration-200 focus:ring-gray-400 focus:ring-offset-gray-900"
                    name="cropType"
                    value={CropType.Maize}
                    checked={selectedCrop === CropType.Maize}
                    onChange={() => setSelectedCrop(CropType.Maize)}
                  />
                  <span className="ml-2 text-lg">3. Maize</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="marketRate"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Market Rate:
              </label>
              <input
                type="number"
                id="marketRate"
                className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
                placeholder="e.g., 20"
                value={marketRateInput}
                onChange={(e) => setMarketRateInput(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="yield"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Yield:
              </label>
              <input
                type="number"
                id="yield"
                className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
                placeholder="e.g., 50"
                value={yieldInput}
                onChange={(e) => setYieldInput(e.target.value)}
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
                onClick={handleCalculate}
                className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-700 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              >
                Calculate Subsidy
              </button>
              <button
                onClick={handleExit}
                className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-800 px-6 py-3 font-bold text-gray-300 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              >
                Exit
              </button>
            </div>

            {result && (
              <div className="mt-8 rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-inner transition-all duration-500 ease-in-out">
                <h2 className="mb-4 text-xl font-bold text-gray-200">
                  Calculation Result:
                </h2>
                <p className="mb-2 text-gray-300">
                  <span className="font-semibold">Type of Crop:</span>{" "}
                  {result.type}
                </p>
                <p className="mb-2 text-gray-300">
                  <span className="font-semibold">Yield:</span>{" "}
                  {result.yieldAmount}
                </p>
                <p className="mb-2 text-gray-300">
                  <span className="font-semibold">Market Rate:</span>{" "}
                  {result.marketRate}
                </p>
                <p className="mt-4 text-xl font-bold text-gray-100">
                  <span className="text-gray-400">Total Subsidy:</span> ₹
                  {result.subsidy.toFixed(2)}
                </p>
                <button
                  onClick={handleContinue}
                  className="focus:ring-opacity-75 mt-6 w-full transform rounded-xl bg-gray-600 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-500 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                >
                  Calculate Another
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubsidyCalculator;
