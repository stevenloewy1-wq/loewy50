const form = document.querySelector(".rsvp-form");
const button = form.querySelector('button[type="submit"]');
const feedback = document.getElementById("rsvp-feedback");
const submissionId = crypto.randomUUID();

const errors = {
  invalid: "Enter your name and choose whether you can make it.",
  unavailable: "Your reply didn’t go through. Please try again.",
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (button.disabled) return;

  const body = new URLSearchParams(new FormData(form));
  body.set("submissionId", submissionId);
  button.disabled = true;
  button.textContent = "Sending…";
  feedback.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      credentials: "omit",
      headers: { Accept: "application/json" },
      body,
    });
    const { reply } = await response.json();

    if (response.ok && (reply === "yes" || reply === "no")) {
      const confirmation = document.getElementById("rsvp-" + reply);
      confirmation.classList.add("is-active");
      confirmation.focus();
    } else {
      feedback.textContent = reply === "invalid" ? errors.invalid : errors.unavailable;
    }
  } catch {
    feedback.textContent = errors.unavailable;
  } finally {
    button.disabled = false;
    button.textContent = "Send RSVP";
  }
});
