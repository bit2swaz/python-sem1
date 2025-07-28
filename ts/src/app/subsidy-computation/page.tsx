import SubsidyCalculator from "~/components/subsidy-calculator";

export const metadata = {
  title: "Subsidy Computation",
  description: "Agricultural Subsidy Calculator",
};

export default function SubsidyComputationPage() {
  return (
    <>
      {/* The SubsidyCalculator component already has the full page styling */}
      <SubsidyCalculator />
    </>
  );
}
