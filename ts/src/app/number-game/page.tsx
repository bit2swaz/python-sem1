import NumberGameSolver from "../../components/number-game-solver"; // Adjust path if needed

export const metadata = {
  title: "Numeria Number Game",
  description: "Build arithmetic expressions to match a target.",
};

export default function NumberGamePage() {
  return (
    <>
      {/* The NumberGameSolver component already has the full page styling */}
      <NumberGameSolver />
    </>
  );
}
