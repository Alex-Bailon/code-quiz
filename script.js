// All veriables needed
let quizintro = document.getElementById("quizintro")
let start = document.getElementById("start")
let quiz = document.getElementById("quiz")
let question = document.getElementById("question")
let choiceA = document.getElementById("A")
let choiceB = document.getElementById("B")
let choiceC = document.getElementById("C")
let lettimer = document.getElementById("timer")
let progress = document.getElementById("progress")
let scoreDiv = document.getElementById("scoreContainer")
let playerScore = document.getElementById("playerScore")
let nameInput = document.getElementById("nameText")
let highScore = document.getElementById("highScore")
let scoreOutput = document.getElementById("highScoreOutput")
let reset = document.getElementById("reset")
// questions array to easy add all questions that are wanted
let questions = [
    {
        question: 'What does CSS stand for?',
        choiceA: 'Casading Style Sheet',
        choiceB: 'Casading Select Sheets',
        choiceC: 'Correcting Style Sheet',
        correct: 'A'
    },
    {
        question: 'What dose HTML stand for?',
        choiceA: 'Hyper Type Markup Language',
        choiceB: 'Hyper Text Markup Language',
        choiceC: 'Home Text Markup Language',
        correct: 'B'
    },
    {
        question: 'What does HTTPS stand for?',
        choiceA: 'Hypertext Transfer Protocol Source',
        choiceB: 'Home Text Transfer Source',
        choiceC: 'Hypertext Transfer Protocol Secure',
        correct: 'C'
    }
];

let lastQuestion = questions.length - 1
let runningQuestion = 0
let score = 0
var totalTime = 60 * 1000 //time in minutes (multiply by number of minutes wanted)
var penaltyTime = 20 * 1000 //penalty in seconds for getting question wrong
var tickTime = 1000
let scoreRenderCount = 0
let scorePerCent = 0
let highScoresArray = []

init()
start.addEventListener("click", startQuiz)
//function to start quiz
function startQuiz(){
    quizintro.style.display = "none"
    quiz.style.display = "block"
    renderQuestion()
    var myInterval = setInterval(tick, tickTime)
    formatTime(totalTime)
    
}
// function so that next question will output when one question is answered
function renderQuestion(){
    let q = questions[runningQuestion]
    question.innerHTML = "<p>" + q.question + "</p>" 
    choiceA.innerHTML = q.choiceA
    choiceB.innerHTML = q.choiceB
    choiceC.innerHTML = q.choiceC
}
// function to check the answer that user selects
function checkAnswer(answer){
    if( answer == questions[runningQuestion].correct){
        score++;
    }
    else{
        totalTime -= penaltyTime
        formatTime(totalTime)
    }
    if(runningQuestion < lastQuestion){
        runningQuestion++
        renderQuestion()
    }
    else{
        scoreRender()
    }
}
// function will end quiz and show the user scores. This function has a count var to ensure it doesnt run
// since it could end once user finish questions or when timer is up.
function scoreRender(){
    quiz.style.display = "none"
    scoreDiv.style.display = "block"
    
    scorePerCent = Math.round(100 * score/questions.length)
    
    playerScore.innerHTML += scorePerCent +"%"
    scoreRenderCount++
    return scorePerCent
}
// Next two functions are for the timer to run and show as MM:SS format
function formatTime(ms) {
    var minutes = Math.floor(ms / 60000)
    var seconds = ms % 60000
    seconds /= 1000
    if(seconds < 10) {
        seconds = "0" + seconds
    }
    var timerEl = document.getElementById("timer")
    timerEl.textContent = `${ minutes }:${ seconds }`
    if (minutes <= 0 && seconds <= "00" && scoreRenderCount == 0){
        scoreRender()
    }
}
function tick() {
	totalTime -= tickTime
	formatTime(totalTime)
    
}
// function to retrive the highscoresArray from local storage
function init() {
    var retrive = JSON.parse(localStorage.getItem("highScoresArray"))
    if (retrive !== null) {
    highScoresArray = retrive
  }
}
// Submit event listener to go to the highscores if user enters their name.
nameForm.addEventListener("submit", function(event){
    event.preventDefault()
    var nameText = nameInput.value.trim()
    // If statement if user leaves form blank
    if (nameText == ''){
        return
    }
    scoreDiv.style.display = "none"
    highScore.style.display = "block"
    highScoresArray.push({playerName: nameText, playerScore: scorePerCent}) // stores playername and score in array
    localStorage.setItem("highScoresArray", JSON.stringify(highScoresArray)) // stores array into local storage
    // function to reorganize array in order from highest score to lowest
    function compare(a, b) {
        const playerA = a.playerScore
        const playerB = b.playerScore
        let comparison = 0
        if (playerA > playerB) {
          comparison = 1
        } else if (playerA < playerB) {
          comparison = -1
        }
        return comparison * -1
    }
    highScoresArray.sort(compare)
    // outputs top 3 scores from array. If there arent at least 3 scores in array it will break tp avoid error in console
    for (let i = 0; i < highScoresArray.length; i++){
        if (i > 2){
            break;
        }
        else{
        scoreOutput.innerHTML += "<p>" + highScoresArray[i].playerName + ": "+ highScoresArray[i].playerScore + "%" + "</p>"
        }
    }    
})
// reset button to reset highscore array to blank
reset.addEventListener('click', function(){
    highScoresArray = []
    localStorage.setItem("highScoresArray", JSON.stringify(highScoresArray))
    scoreOutput.innerHTML = ''
})

if (window.innerWidth < 500){
    alert("For a better user experience, please switch to landscape mode.")
}

