"use client";

import React, { useState } from "react";

const UsernameValidator: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Validates the given username against the specified rules using a regular expression.
   * Rules:
   * - Must start with a letter (A-Z or a-z).
   * - Can contain letters, numbers, and underscores (_) only.
   * - No other symbols or spaces are allowed.
   * - Length must be between 5 and 15 characters.
   * @param name The username string to validate.
   * @returns true if the username is valid, false otherwise.
   */
  const validateUsername = (name: string): boolean => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{4,14}$/;
    return regex.test(name);
  };

  const handleValidate = () => {
    if (username.trim() === "") {
      setValidationResult(false);
      setMessage("Username cannot be empty.");
      return;
    }

    const isValid = validateUsername(username);
    setValidationResult(isValid);
    if (isValid) {
      setMessage("Valid Username");
    } else {
      setMessage("Invalid Name");
    }
  };

  const handleClear = () => {
    setUsername("");
    setValidationResult(null);
    setMessage(null);
  };

  // Determine message color based on validation result
  const messageColorClass =
    validationResult === true ? "text-green-400" : "text-red-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl transition-all duration-500 ease-in-out">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-100">
          Gaming Leaderboard Username Validator
        </h1>

        <div className="mb-6">
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Enter Username:
          </label>
          <input
            type="text"
            id="username"
            className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 leading-tight text-gray-100 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
            placeholder="e.g., Player_One"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={15}
          />
          <p className="mt-1 text-xs text-gray-400">
            5-15 characters, starts with a letter, contains only letters,
            numbers, or underscores.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleValidate}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-700 px-6 py-3 font-bold text-gray-100 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            Validate Username
          </button>
          <button
            onClick={handleClear}
            className="focus:ring-opacity-75 w-full transform rounded-xl bg-gray-800 px-6 py-3 font-bold text-gray-300 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:outline-none"
          >
            Clear
          </button>
        </div>

        {message && (
          <div
            className={`mt-8 rounded-xl p-6 shadow-inner transition-all duration-500 ease-in-out ${validationResult === true ? "border border-green-700 bg-green-900" : "border border-red-700 bg-red-900"}`}
          >
            <h2 className={`mb-4 text-xl font-bold ${messageColorClass}`}>
              Validation Status:
            </h2>
            <p className={`text-lg font-semibold ${messageColorClass}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsernameValidator;
