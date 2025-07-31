document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const submitBtn = form.querySelector('button[type="submit"]');

  const messageBox = document.createElement("div");
  messageBox.className = "hidden mt-4 p-3 rounded text-center text-sm";
  form.appendChild(messageBox);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous message
    messageBox.textContent = "";
    messageBox.className = "hidden";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showMessage("Please fill all fields.", "text-red-700 bg-red-100 border border-red-400");
      return;
    }

    // Show instant feedback
    showMessage("Sending message...", "text-gray-700 bg-gray-100 border border-gray-300");
    submitBtn.disabled = true;  // disable button during send

    try {
      const response = await fetch("/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || response.statusText);
      }

      showMessage("Message sent successfully!", "text-green-700 bg-green-100 border border-green-400");
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      showMessage("Failed to send message. Please try again later.", "text-red-700 bg-red-100 border border-red-400");
    } finally {
      submitBtn.disabled = false;  // re-enable button after request
    }
  });

  function showMessage(text, className) {
    messageBox.textContent = text;
    messageBox.className = `block mt-4 p-3 rounded text-center text-sm ${className}`;
  }
});
