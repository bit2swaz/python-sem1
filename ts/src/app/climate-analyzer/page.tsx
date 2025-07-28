import ClimateAnalyzer from "../../components/climate-analyzer"; // Adjust path if needed

export const metadata = {
  title: "Climate Change Data Analyzer",
  description: "Analyze daily temperature readings",
};

export default function ClimateAnalyzerPage() {
  return (
    <>
      {/* The ClimateAnalyzer component already has the full page styling */}
      <ClimateAnalyzer />
    </>
  );
}
