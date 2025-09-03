function checkQuiz() {
  let score = 0;
  let total = 5;

  let answers = { q1: "b", q2: "c", q3: "b", q4: "a", q5: "b" };

  for (let q in answers) {
    let selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  document.getElementById("quizResult").innerText =
    `✅ You scored ${score} out of ${total}`;

  // Get Name + Department from input fields
  let name = document.getElementById("name").value.trim();
  let department = document.getElementById("department").value.trim();

  if (!name || !department) {
    alert("⚠️ Please enter both Name and Department before submitting.");
    return;
  }

  // Send data to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycby-Iu6MSQy8zNWoFfovWE3Y2QO4PcVXsgEC0KkUnXeJEdlh5px_dKQ7bMHbxjxwLwI/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, department: department, score: score })
  });
}
