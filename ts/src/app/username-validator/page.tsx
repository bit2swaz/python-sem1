import UsernameValidator from "../../components/username-validator";

export const metadata = {
  title: "Username Validator",
  description: "Validate game usernames based on specific rules.",
};

export default function UsernameValidatorPage() {
  return (
    <>
      {/* The UsernameValidator component already has the full page styling */}
      <UsernameValidator />
    </>
  );
}
