// 1. СТУДЕНТТЕРДИН ТИЗМЕСИ
let ALLOWED_STUDENTS = [
    { name: "Алиев Умар", dob: "2008-05-12", oms: "12345678901234" },
    { name: "Касымова Фатима", dob: "2010-11-20", oms: "23456789012345" },
    { name: "Ибрахимов Юсуф", dob: "2007-01-15", oms: "34567890123456" }
];

// 2. 20 СУРОО БАЗАСЫ
const QUESTIONS = [
    { id: 1, question: "Исламда намаз окуунун өкүмү кандай?", options: ["Фарз айн", "Суннат", "Мустахаб", "Важиб"], correct: 0 },
    { id: 2, question: "Куранда канча сүрө бар?", options: ["110", "112", "114", "116"], correct: 2 },
    { id: 3, question: "Пайгамбарыбызга (с.а.в.) эң биринчи кайсы сүрө түшкөн?", options: ["Фатиха", "Алак", "Ясин", "Ихлас"], correct: 1 },
    { id: 4, question: "Ыймандын негизги түркүктөрү канча?", options: ["5", "6", "7", "4"], correct: 1 },
    { id: 5, question: "Даараттын фарздары канча?", options: ["4", "6", "8", "12"], correct: 0 },
    { id: 6, question: "Эң ишенимдүү Хадис жыйнагы кайсы?", options: ["Сунан Абу Давуд", "Сахих ал-Бухари", "Муснад Ахмад", "Сунан ат-Тирмизи"], correct: 1 },
    { id: 7, question: "Пайгамбарыбыз (с.а.в.) кайсы жылы туулган?", options: ["Пил жылы (571-ж.)", "610-жыл", "622-жыл", "632-жыл"], correct: 0 },
    { id: 8, question: "Намазда Куран окуу эмне деп аталат?", options: ["Руку", "Сажда", "Кирам", "Кыям"], correct: 3 },
    { id: 9, question: "Акида илими эмнени үйрөтөт?", options: ["Ишеним, ыйман негиздерин", "Соода эрежелерин", "Араб тилин", "Тарыхты"], correct: 0 },
    { id: 10, question: "Рамазан орозосу кайсы айда кармалат?", options: ["Шаабан", "Ражаб", "Рамазан", "Мухаррам"], correct: 2 },
    { id: 11, question: "Пайгамбарыбыздын (с.а.в.) биринчи аялы ким болгон?", options: ["Аиша энебиз", "Хадича энебиз", "Мария энебиз", "Зайнаб энебиз"], correct: 1 },
    { id: 12, question: "Мединага көчүү окуясы эмне деп аталат?", options: ["Исра", "Мираж", "Хижрат", "Фатх"], correct: 2 },
    { id: 13, question: "Дааратты эмне бузат?", options: ["Тамак жегендик", "Жел чыгуу же дааратканага баруу", "Суу ичүү", "Сүйлөө"], correct: 1 },
    { id: 14, question: "Бамдат намазы канча ракат фарздан турат?", options: ["2 ракат", "3 ракат", "4 ракат", "1 ракат"], correct: 0 },
    { id: 15, question: "Бадр казаты кайсы жылы болгон?", options: ["Хижранын 2-жылы", "Хижранын 5-жылы", "Хижранын 10-жылы", "Хижранын 1-жылы"], correct: 0 },
    { id: 16, question: "Аллахтын канча көркөм ысымы бар?", options: ["33", "66", "99", "100"], correct: 2 },
    { id: 17, question: "Орозо айт күнү орозо кармоого болобу?", options: ["Болот", "Арам (Болбойт)", "Макрух", "Мустахаб"], correct: 1 },
    { id: 18, question: "Акырет күнүнө ишенүү ыймандын канчанчы шарты?", options: ["1-шарты", "3-шарты", "5-шарты", "6-шарты"], correct: 2 },
    { id: 19, question: "Курандын эң узун сүрөсү кайсы?", options: ["Ясин", "Бакара", "Имран", "Маида"], correct: 1 },
    { id: 20, question: "Зекет кимдерге берилет?", options: ["Байларга", "Кембагал-кедейлерге", "Каалаган кишиге", "Мамлекетке"], correct: 1 }
];

let currentUser = null;
let timerInterval = null;
let timeLeft = 30 * 60; 
let warnings = 0;
const MAX_WARNINGS = 3;
let isExamActive = false;
let cameraStream = null;
let lastLookAwayTime = 0;

// АВТОРИЗАЦИЯ
function authenticateUser() {
    let inputName = document.getElementById("input-name").value.trim().replace(/\s+/g, ' ').toLowerCase();
    const dob = document.getElementById("input-dob").value;
    let inputOms = document.getElementById("input-oms").value.trim();

    if (!inputName || !dob || !inputOms) {
        alert("Сураныч, бардык талааларды толтуруңуз!");
        return;
    }

    const found = ALLOWED_STUDENTS.find(s => {
        const studentName = String(s.name).trim().replace(/\s+/g, ' ').toLowerCase();
        const studentOms = String(s.oms).trim();
        return studentOms === inputOms && studentName === inputName;
    });

    if (!found) {
        alert("⛔ КЕЧИРИҢИЗ! Сиз катышуучулардын тизмесинде жоксуз.");
        return;
    }

    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if ((currentYear - birthYear) < 16) {
        alert("⛔ КЕЧИРИҢИЗ! Экзаменге 16 жашка толгон окуучулар гана катыша алат.");
        return;
    }

    const lastAttempt = localStorage.getItem(`medrese_attempt_${inputOms}`);
    if (lastAttempt) {
        const diffDays = (new Date() - new Date(parseInt(lastAttempt))) / (1000 * 60 * 60 * 24);
        if (diffDays < 3) {
            alert("⛔ Кайра кирүү 3 күндөн кийин гана мүмкүн болот!");
            return;
        }
    }

    currentUser = found;
    startExam();
}

// ЭКЗАМЕНДИ БАШТОО
function startExam() {
    document.getElementById("auth-box").classList.add("hidden");
    document.getElementById("exam-box").classList.remove("hidden");

    document.getElementById("student-display").innerText = `Окуучу: ${currentUser.name}`;
    document.getElementById("student-oms-display").innerText = `ОМС: ${currentUser.oms}`;

    isExamActive = true;
    renderQuestions();
    startTimer();
    initProctoringAI();
    setupTabVisibilityTracker();
}

// 1-КОРГОО: ВКЛАДКАДАН ЧЫГЫП КЕТҮҮНҮ ТЕКШЕРҮҮ
function setupTabVisibilityTracker() {
    document.addEventListener("visibilitychange", () => {
        if (isExamActive && document.hidden) {
            triggerWarning("Экрандан же браузер вкладкасынан чыгууга болбойт!");
        }
    });
}

// ЭСКЕРТҮҮ БЕРҮҮ ЛОГИКАСЫ
function triggerWarning(reason) {
    if (!isExamActive) return;
    
    warnings++;
    document.getElementById("warning-count-display").innerText = `Эскертүүлөр: ${warnings} / ${MAX_WARNINGS}`;
    alert(`⚠️ ЭСКЕРТҮҮ (${warnings}/${MAX_WARNINGS}): ${reason}`);

    if (warnings >= MAX_WARNINGS) {
        isExamActive = false;
        clearInterval(timerInterval);
        alert("⛔ Сиз эрежелерди бир нече ирет бузганыңыз үчүн экзамен жокко чыгарылды!");
        localStorage.setItem(`medrese_attempt_${currentUser.oms}`, Date.now().toString());
        location.reload();
    }
}

// 2-КОРГОО: GOOGLE MEDIAPIPE FACE MESH AI (БАШТЫ БУРГАНДЫ АНЫКТОО)
function initProctoringAI() {
    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const aiStatus = document.getElementById('ai-status');

    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            
            // Мурун жана беттин чектери аркылуу бурчтарды эсептөө
            const nose = landmarks[1];
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];

            const dx = rightCheek.x - leftCheek.x;
            const noseRelX = (nose.x - leftCheek.x) / dx;

            // БАШ БУРУЛДУБЫ? (noseRelX: 0.25 - 0.75 ортосунда болушу керек)
            if (noseRelX < 0.25 || noseRelX > 0.75) {
                aiStatus.innerText = "⚠️ Экранды түз караңыз!";
                aiStatus.style.background = "rgba(198, 40, 40, 0.9)";
                
                const now = Date.now();
                if (now - lastLookAwayTime > 4000) { // 4 секунд туташ карабаса эскертүү берилет
                    lastLookAwayTime = now;
                    triggerWarning("Башты капталга бурууга болбойт!");
                }
            } else {
                aiStatus.innerText = "🟢 AI: Карап турат";
                aiStatus.style.background = "rgba(26, 77, 46, 0.8)";
            }
        } else {
            aiStatus.innerText = "⚠️ Бет көрүнбөй жатат!";
            aiStatus.style.background = "rgba(198, 40, 40, 0.9)";
        }
        canvasCtx.restore();
    });

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            if (isExamActive) {
                await faceMesh.send({ image: videoElement });
            }
        },
        width: 160,
        height: 120
    });
    camera.start();
}

// ТАЙМЕР
function startTimer() {
    const timerDisplay = document.getElementById("timer");
    
    timerInterval = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        timerDisplay.innerText = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Убакыт бүттү! Экзамен автоматтык түрдө тапшырылат.");
            finishExam();
        }
    }, 1000);
}

// СУРООЛОРДУ ТИЗҮҮ
function renderQuestions() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    QUESTIONS.forEach((q, index) => {
        let qHtml = `
            <div class="question-card">
                <h4>${index + 1}. ${q.question}</h4>
                <div class="options">
        `;

        q.options.forEach((opt, optIdx) => {
            qHtml += `
                <label>
                    <input type="radio" name="q_${q.id}" value="${optIdx}">
                    ${opt}
                </label>
            `;
        });

        qHtml += `</div></div>`;
        container.innerHTML += qHtml;
    });
}

// ЖЫЙЫНТЫК
function finishExam() {
    isExamActive = false;
    clearInterval(timerInterval);
    localStorage.setItem(`medrese_attempt_${currentUser.oms}`, Date.now().toString());

    let score = 0;
    QUESTIONS.forEach(q => {
        const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
        }
    });

    const percent = (score / QUESTIONS.length) * 100;
    
    document.getElementById("exam-box").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");

    const statusElem = document.getElementById("result-status");
    const scoreTextElem = document.getElementById("result-score-text");

    scoreTextElem.innerText = `Сиз ${QUESTIONS.length} суроодон ${score} туура жооп бердиңиз (${percent.toFixed(0)}%).`;

    if (percent >= 60) {
        statusElem.innerText = "🎉 КАТТАРЫҢЫЗДЫ ТАБРИКТЕЙБИЗ! СИЗ ЭКЗАМЕНДЕН ӨТТҮҢҮЗ!";
        statusElem.style.color = "#1a4d2e";

        document.getElementById("cert-name").innerText = currentUser.name;
        document.getElementById("cert-score").innerText = `${score} / ${QUESTIONS.length}`;
        document.getElementById("cert-date-text").innerText = new Date().toLocaleDateString('ky-KG');

        document.getElementById("certificate-area").classList.remove("hidden");
        document.getElementById("print-btn").classList.remove("hidden");
    } else {
        statusElem.innerText = "😔 КЕЧИРИҢИЗ, СИЗ ЭКЗАМЕНДЕН ӨТПӨДҮҢҮЗ.";
        statusElem.style.color = "#c62828";
    }
}

// ПРИНТЕР
function printCertificate() {
    window.print();
}
