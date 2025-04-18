let startTime, isRunning = false, originalText = "";

function startTest() {
  const wordCount = parseInt(document.getElementById("wordCount").value);
  document.getElementById("input").value = "";
  document.getElementById("retryBtn").style.display = "none";
  document.getElementById("sentence").textContent = "Loading...";

  fetch(`https://baconipsum.com/api/?type=all-meat&paras=2`)
    .then(res => res.json())
    .then(data => {
      const fullText = data.join(" ").replace(/[^a-zA-Z0-9\s]/g, "");
      const words = fullText.split(/\s+/).slice(0, wordCount);
      originalText = words.join(" ");
      document.getElementById("sentence").textContent = originalText;
      document.getElementById("input").disabled = false;
      document.getElementById("input").focus();
      document.getElementById("time").textContent = "0.00";
      document.getElementById("wpm").textContent = "0";
      document.getElementById("accuracy").textContent = "0";
      startTime = new Date().getTime();
      isRunning = true;
    })
    .catch(() => {
      alert("⚠️ Failed to load text. Try again.");
      document.getElementById("sentence").textContent = "";
    });
}

function checkTyping() {
  if (!isRunning) return;

  const input = document.getElementById("input").value;
  const elapsed = (new Date().getTime() - startTime) / 1000;
  document.getElementById("time").textContent = elapsed.toFixed(2);

  const wordsTyped = input.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / elapsed) * 60);
  document.getElementById("wpm").textContent = isNaN(wpm) ? 0 : wpm;

  const inputWords = input.trim().split(/\s+/);
  const originalWords = originalText.trim().split(/\s+/);
  let correct = 0;
  for (let i = 0; i < inputWords.length; i++) {
    if (inputWords[i] === originalWords[i]) correct++;
  }
  const accuracy = Math.round((correct / originalWords.length) * 100);
  document.getElementById("accuracy").textContent = isNaN(accuracy) ? 0 : accuracy;

  if (input.trim() === originalText.trim()) {
    isRunning = false;
    document.getElementById("input").disabled = true;
    document.getElementById("retryBtn").style.display = "inline-block";
    alert(`🎉 Done! Speed: ${wpm} WPM | Accuracy: ${accuracy}%`);
  }
}

function retryTest() {
  document.getElementById("sentence").textContent = "";
  document.getElementById("input").value = "";
  document.getElementById("wpm").textContent = "0";
  document.getElementById("time").textContent = "0.00";
  document.getElementById("accuracy").textContent = "0";
  document.getElementById("retryBtn").style.display = "none";
  startTest();
}
