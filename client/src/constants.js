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
