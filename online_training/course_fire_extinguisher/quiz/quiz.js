// ২০টি প্রশ্ন + উত্তর
const quizData = [
  { q: "1. ফায়ার ট্রায়াঙ্গলের তিনটি উপাদান কী?", options: ["পানি, তাপ, গ্যাস", "অক্সিজেন, তাপ, জ্বালানি", "ধোঁয়া, আগুন, অক্সিজেন", "অক্সিজেন, ধূলা, পানি"], answer: 1 },
  { q: "2. ফায়ার এক্সটিংগুইশারের লাল রঙ সাধারণত কী নির্দেশ করে?", options: ["ফোম", "ড্রাই পাউডার", "পানি", "CO₂"], answer: 2 },
  { q: "3. ইলেকট্রিক্যাল আগুন নেভাতে কোন ফায়ার এক্সটিংগুইশার সবচেয়ে নিরাপদ?", options: ["পানি", "ফোম", "CO₂", "ভেজা কাপড়"], answer: 2 },
  { q: "4. PASS পদ্ধতির 'A' কী বোঝায়?", options: ["Aim (লক্ষ্য করা)", "Alert (সতর্ক করা)", "Action (কাজ করা)", "Apply (প্রয়োগ করা)"], answer: 0 },
  { q: "5. মেটাল আগুন (Class D) নেভাতে কোনটি ব্যবহার করতে হয়?", options: ["পানি", "ফোম", "ড্রাই পাউডার", "CO₂"], answer: 2 },
  { q: "6. CO₂ ফায়ার এক্সটিংগুইশার ব্যবহার করলে বিপদ কী হতে পারে?", options: ["অক্সিজেন কমে শ্বাসকষ্ট", "বিদ্যুৎ শক", "বিস্ফোরণ", "অতিরিক্ত তাপ উৎপন্ন"], answer: 0 },
  { q: "7. PASS পদ্ধতির 'S' (প্রথম S) মানে কী?", options: ["Squeeze (চাপ দেওয়া)", "Stop (থামানো)", "Spray (ছিটানো)", "Shift (সরানো)"], answer: 0 },
  { q: "8. Class K আগুন কোন ক্ষেত্রে হয়?", options: ["কেমিক্যাল ল্যাব", "রান্নাঘর (তেল ও চর্বি)", "ধাতু ফ্যাক্টরি", "কাগজ শিল্প"], answer: 1 },
  { q: "9. ফোম এক্সটিংগুইশার কোথায় ব্যবহার করা উচিত নয়?", options: ["কাঠ ও কাগজ", "দাহ্য তরল", "ইলেকট্রিক্যাল আগুন", "ফোম দিয়ে সব আগুন নেভানো যায়"], answer: 2 },
  { q: "10. একটি স্ট্যান্ডার্ড পোর্টেবল ফায়ার এক্সটিংগুইশারের কার্যকাল সাধারণত কতক্ষণ থাকে?", options: ["৫-১০ সেকেন্ড", "১৫-২০ সেকেন্ড", "১ মিনিট", "৫ মিনিট"], answer: 0 },
  { q: "11. আগুন নেভানোর চারটি মূল পদ্ধতির একটি নয় কোনটি?", options: ["Cooling (ঠান্ডা করা)", "Smothering (অক্সিজেন বন্ধ করা)", "Starvation (জ্বালানি সরানো)", "Polishing (পালিশ করা)"], answer: 3 },
  { q: "12. ড্রাই কেমিক্যাল পাউডার এক্সটিংগুইশার কোন ক্লাসের আগুনে ব্যবহার করা যায়?", options: ["শুধু ক্লাস A", "শুধু ক্লাস C", "A, B এবং C", "শুধু ক্লাস D"], answer: 2 },
  { q: "13. যে আগুন ধীরে ধীরে ভিতরে ভিতরে জ্বলে তাকে কী বলা হয়?", options: ["ফ্ল্যাশ ফায়ার", "স্মোল্ডারিং ফায়ার", "ব্লাস্ট ফায়ার", "সারফেস ফায়ার"], answer: 1 },
  { q: "14. CO₂ ফায়ার এক্সটিংগুইশার ব্যবহার করার সময় হাত কোথায় রাখা নিরাপদ নয়?", options: ["লাল হ্যান্ডেল", "কালো হর্ন (discharge horn)", "ক্যানিস্টার বডি", "নিরাপত্তা পিন"], answer: 1 },
  { q: "15. Class A আগুন সাধারণত কোন উপকরণ দিয়ে হয়?", options: ["কাঠ, কাগজ, কাপড়", "পেট্রোল, ডিজেল", "বৈদ্যুতিক যন্ত্রপাতি", "রান্নার তেল"], answer: 0 },
  { q: "16. একটি ফায়ার এক্সটিংগুইশারের প্রেসার গেজে সবুজ অংশ কী নির্দেশ করে?", options: ["খালি", "ওভারচার্জড", "স্বাভাবিক ব্যবহারের জন্য প্রস্তুত", "ক্ষতিগ্রস্ত"], answer: 2 },
  { q: "17. কোন পরিস্থিতিতে পানির এক্সটিংগুইশার ব্যবহার করা সবচেয়ে বিপজ্জনক?", options: ["কাঠের আগুনে", "কাগজের আগুনে", "ইলেকট্রিক্যাল আগুনে", "কাপড়ের আগুনে"], answer: 2 },
  { q: "18. ফায়ার এক্সটিংগুইশার ব্যবহারের সময় নিরাপদ দূরত্ব কত?", options: ["০.৫ মিটার", "১-২ মিটার", "৫ মিটার", "১০ মিটার"], answer: 1 },
  { q: "19. এক্সটিংগুইশারের পিন টানার পর কী করা উচিত?", options: ["ফায়ার অ্যালার্ম বাজানো", "লক্ষ্য করে স্প্রে করা", "পুনরায় পিন ঢোকানো", "ক্যানিস্টার ঘোরানো"], answer: 1 },
  { q: "20. অফিস ভবনে সাধারণত কোন ধরনের এক্সটিংগুইশার রাখা সবচেয়ে কার্যকর?", options: ["পানি", "CO₂", "ড্রাই কেমিক্যাল পাউডার", "ফোম"], answer: 2 }
];

// Quiz form container
const quizForm = document.getElementById("quizForm");

// Dynamically create questions
quizData.forEach((item, index) => {
  let div = document.createElement("div");
  div.classList.add("quiz-question");
  div.innerHTML = `<p>${item.q}</p>`;
  item.options.forEach((opt, i) => {
    div.innerHTML += `<label><input type="radio" name="q${index+1}" value="${i}"> ${opt}</label><br>`;
  });
  quizForm.appendChild(div);
});

// Quiz checking
function checkQuiz() {
  let score = 0;

  // Validate name & department
  const name = document.getElementById("name").value.trim();
  const department = document.getElementById("department").value.trim();
  if (!name || !department) {
    alert("⚠️ নাম এবং বিভাগ লিখতে হবে।");
    return;
  }

  quizData.forEach((item, index) => {
    const selected = document.querySelector(`input[name="q${index+1}"]:checked`);
    const questionDiv = document.getElementsByClassName("quiz-question")[index];

    // Reset previous result color
    questionDiv.style.backgroundColor = "#fff";

    if (selected) {
      if (parseInt(selected.value) === item.answer) {
        score++;
        questionDiv.style.backgroundColor = "#d4edda"; // green for correct
      } else {
        questionDiv.style.backgroundColor = "#f8d7da"; // red for wrong
      }
    } else {
      questionDiv.style.backgroundColor = "#fff3cd"; // yellow for unanswered
    }

    // Show correct answer
    const correctAnswerText = item.options[item.answer];
    let existing = questionDiv.querySelector(".correct-answer");
    if (!existing) {
      const p = document.createElement("p");
      p.classList.add("correct-answer");
      p.style.fontWeight = "600";
      p.style.color = "#155724";
      p.innerText = `সঠিক উত্তর: ${correctAnswerText}`;
      questionDiv.appendChild(p);
    }
  });

  document.getElementById("quizResult").innerText = `✅ আপনি ${score} টি প্রশ্নের মধ্যে ${quizData.length} এর মধ্যে সঠিক উত্তর দিয়েছেন।`;

  // Send data to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbxyekjMPf2Os-Hh3e5k6TQvorn7pwRMlwV7zN0rMdZ9wPTTXsW1wbSl2X4BJ3nvZgRzWQ/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, department: department, score: score })
  });
}


