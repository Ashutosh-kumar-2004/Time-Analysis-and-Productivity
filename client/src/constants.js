const loginPageQuotes = [
  "Every second counts. Make yours matter.",
  "Turn time into progress.",
  "Focus. Analyze. Achieve.",
  "Small steps. Measurable impact.",
  "Track time. Master productivity.",
  "What gets measured, gets improved.",
  "Own your hours, own your outcome.",
  "Time doesn’t wait, optimize it.",
  "Work smarter, not longer.",
  "Precision in time is power in progress.",
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * loginPageQuotes.length);
  return loginPageQuotes[randomIndex];
};

export const validateSignUp = ({
  firstName,
  lastName,
  email,
  password,
  agree,
  setErrors,
}) => {
  const newErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: "",
  };
  let isValid = true;

  if (!firstName.trim()) {
    newErrors.firstName = "First name is required.";
    isValid = false;
  }

  if (!email.trim()) {
    newErrors.email = "Email is required.";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    newErrors.email = "Email is invalid.";
    isValid = false;
  }

  if (!password) {
    newErrors.password = "Password is required.";
    isValid = false;
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
    isValid = false;
  }

  if (!agree) {
    newErrors.agree = "You must agree to the Terms & Conditions.";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};

export const strengthColors = [
  "bg-gray-300",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-green-600",
];

export function formatDateTime(isoString) {
  const date = new Date(isoString);

  if (isNaN(date)) return "Invalid Date";

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Format duration from minutes to readable format
export const formatDuration = (minutes) => {
  if (!minutes) return "0 mins";

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  let result = [];
  if (days > 0) result.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (mins > 0 || result.length === 0)
    result.push(`${mins} min${mins !== 1 ? "s" : ""}`);

  return result.join(", ");
};
