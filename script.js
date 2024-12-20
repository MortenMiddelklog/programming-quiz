const base_url = "./images/";

let quizData;
let currentQuestion = 0;
let score = 0;
const wrongAnswers = [];

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const questionContainer = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const submitBtn = document.getElementById("submit-btn");
const counter = document.getElementById("counter");
const imgContainer = document.getElementById("image-container");

let img = new Image();
img.classList.add("d-block", "img-fluid");
img.style.maxHeight = "200px";

const inputElem = document.createElement("input");
const labelElem = document.createElement("label");
const p = document.createElement("p");
const div = document.createElement("div");

p.classList.add("lh-1", "m-0", "p-0", "mb-2")
div.classList.add("mb-4", "p-3", "border", "border-dark", "rounded");
inputElem.type = "radio";
inputElem.name = "answer";
inputElem.autocomplete = "off";
inputElem.classList.add("btn-check");
labelElem.classList.add("btn", "btn-outline-dark", "btn-lg", "mb-3")

function populateQuestion() {
    counter.innerText = currentQuestion + 1;
    questionContainer.innerText = quizData[currentQuestion].question;
    while (imgContainer.firstChild) {
        imgContainer.removeChild(imgContainer.firstChild);
    }
    if (quizData[currentQuestion].imgLink) {
        let im = img.cloneNode();
        im.src = base_url + quizData[currentQuestion].imgLink;
        imgContainer.appendChild(im);
    }
    
    quizData[currentQuestion].answers.forEach((answer, i) => {
        const input = inputElem.cloneNode();
        const label = labelElem.cloneNode();
        input.id = `Q${i}`;
        input.value = i;
        label.setAttribute("for", `Q${i}`);
        label.innerText = answer;
        answersContainer.append(input, label);
    });
}

function showResults() {
    quiz.classList.add("d-none", "invisible");
    result.innerHTML += `<p class=\"fs-5 lh-1\">You gave the correct answer to <strong>${Math.round(100*score/quizData.length)}%</strong> of the questions (${score}/${quizData.length}).</p>`;
    if (wrongAnswers.length) {
        result.innerHTML += "<p class=\"fs-5 lh-1\">These are the correct answers to the questions you got wrong:</p>";
        wrongAnswers.forEach((q) => {
            let divElem = div.cloneNode();
            let qElem = p.cloneNode();
            let aElem = p.cloneNode();
            qElem.innerHTML = `<strong>Question ${q.id}:</strong> ${q.question}`;
            aElem.innerHTML = `<strong>Answer:</strong> ${q.answers[q.correct_answer]}`;
            if (q.imgLink) {
                let im = img.cloneNode();
                im.src = base_url + q.imgLink;
                divElem.append(qElem, im, aElem);
            } else {
                divElem.append(qElem, aElem);
            }
            result.appendChild(divElem);
        });
    }
    result.classList.remove("invisible");
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
};




function prepare(data) {
    const sql = data.sqlQuestions;
    const python = data.pythonQuestions;
    const js = data.javascriptQuestions;

    shuffleArray(sql);
    shuffleArray(python);
    shuffleArray(js);

    quizData = [ ...sql.slice(0,5), ...python.slice(0,5), ...js.slice(0,5) ];
    shuffleArray(quizData);
    quizData.forEach((q, i) => {
        q.id = i+1;
    });
    document.getElementById("questions-amount").innerText = quizData.length;

    populateQuestion();
}

const fetchData = async () => {
    try {
        const res = await fetch("./quizData.json");
        const data = await res.json();
        prepare(data)
    } catch (err) {
        console.log(err);
    }
};

submitBtn.addEventListener("click", () => {
    const answer = document.querySelector('input[name="answer"]:checked')?.value;
    if (answer) {
        quizData[currentQuestion].correct_answer === ~~answer ? score++ : wrongAnswers.push(quizData[currentQuestion]);
        if (currentQuestion < quizData.length-1) {
            answersContainer.innerHTML = "";
            currentQuestion++;
            populateQuestion();
        } else {
            showResults();
        }
    }
});



fetchData();

