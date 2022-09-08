//-------------init---------------
document.getElementById("btn_start_test").setAttribute('onclick', 'startTest()');

number_of_question = document.getElementById("number_of_question");
question = document.getElementById("question");

question_image = document.getElementById("question_image");

answer1 = document.getElementById("answer1");
answer_content_1 = document.getElementById("answer_content_1");

answer2 = document.getElementById("answer2");
answer_content_2 = document.getElementById("answer_content_2");

answer3 = document.getElementById("answer3");
answer_content_3 = document.getElementById("answer_content_3");

answer4 = document.getElementById("answer4");
answer_content_4 = document.getElementById("answer_content_4");

explanation = document.getElementById("explanation");
explanation_content = document.getElementById("explanation_content");

numberOfQuestion = 0;
currentQuestion = -1;
var data = [];
state = 1;
listOfState = [];


//load data to state select tag
statePath = 'assets/json/states.json'
function loadState(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', statePath, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
}
loadState(function(json) {
    stateSelect = document.getElementById("state");
    json.states.forEach(element => {
        option = document.createElement("option");
        option.text = element.name;
        option.value = element.id;
        stateSelect.add(option);
    });
});


//load json file from assets
path = 'assets/json/questions.json'
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
}



//display the ans
function gen_ans(id){
    currentQuestion = id;
    if(id==0){
        document.getElementById("back").style.display = "none";
        document.getElementsByClassName("move")[0].style.justifyContent = "flex-end";
    }else{
        document.getElementById("back").style.display = "block";
        document.getElementsByClassName("move")[0].style.justifyContent = "space-between";
    }
    number_of_question.innerText = id+1;
    question.innerText = data[id].question;

    if(data[id].image_name != null && data[id].image_name != ''){
        question_image.src = './assets/img/question/'+data[id].image_name;
    }else{
        question_image.src = "";
    }

    answer_content_1.innerText = data[id].answer1;
    answer_content_2.innerText = data[id].answer2;
    answer_content_3.innerText = data[id].answer3;
    answer_content_4.innerText = data[id].answer4;

    answer1.setAttribute('onclick', `choose(1, ${id})`);
    answer2.setAttribute('onclick', `choose(2, ${id})`);
    answer3.setAttribute('onclick', `choose(3, ${id})`);
    answer4.setAttribute('onclick', `choose(4, ${id})`);

    explanation_content.innerText = data[id].explanation;
    explanation.style.display = 'none';

    for(i=1;i<=4;i++){
        document.getElementById("abcd_"+i).style.backgroundColor = '#e5e5e5';
        document.getElementById("abcd_"+i).style.color = 'black';
        document.getElementById("answer"+i).style.border = '1px solid #b9b9b9';
        document.getElementById("answer"+i).style.backgroundColor = 'white';
    }

    //show border in current question cell
    for(let i=0;i<numberOfQuestion;i++){
        document.getElementById(`cell_${i}`).style.border = "none";
    }
    document.getElementById(`cell_${id}`).style.border = "2px solid blue";

    //set onclick for cell
    document.getElementById(`cell_${id}`).setAttribute('onclick', `gen_ans(${id})`);

    //Show results if the question has been answered
    if(data[id].userChoose != null && data[id].userChoose != ''){
        choose(data[id].userChoose, id);
    }

    //hide next button if question has not been answered
    if(data[id].userChoose == undefined){
        document.getElementById("next").style.display = "none";
    }else{

    }
}


//show ans after clicked
function choose(number, idQuestion){
    //wrong color
    document.getElementById("abcd_"+number).style.backgroundColor = '#FF4E34';
    document.getElementById("answer"+number).style.border = '1px solid #FF4E34';
    document.getElementById("answer"+number).style.backgroundColor = '#FFEBE8';
    document.getElementById("abcd_"+number).style.color = "white";
    //correct color
    correctAns = data[idQuestion].answerCorrect;
    document.getElementById("abcd_"+correctAns).style.backgroundColor = '#34B493';
    document.getElementById("answer"+correctAns).style.border = '1px solid #34B493';
    document.getElementById("answer"+correctAns).style.backgroundColor = '#DBF1E4';
    document.getElementById("abcd_"+correctAns).style.color = "white";
    //show explanation
    explanation.style.display = 'flex';
    //disable click 
    answer1.setAttribute('onclick', '');
    answer2.setAttribute('onclick', '');
    answer3.setAttribute('onclick', '');
    answer4.setAttribute('onclick', '');

    data[idQuestion].userChoose = number;

    //handle Progress
    let currentCell = document.getElementById(`cell_${idQuestion}`);
    if(number == data[idQuestion].answerCorrect){
        currentCell.setAttribute('class', 'thisCell cellCorrect');
    }else{
        currentCell.setAttribute('class', 'thisCell cellWrong');
    }

    //show next button
    document.getElementById("next").style.display = "block";

    //set onclick for next cell
    if(idQuestion<numberOfQuestion-1){
        document.getElementById(`cell_${idQuestion+1}`).setAttribute('onclick', `gen_ans(${idQuestion+1})`);
    }
}


function showSummary(){
    document.getElementById("main_test_area").style.display = "none";
    document.getElementById("summary").style.display = "block";
    score = 0;
    for(i=0;i<numberOfQuestion;i++){
        if(data[i].answerCorrect == data[i].userChoose){
            score+=1;
        }
    }
    document.getElementById("score").innerText = score + '/' + numberOfQuestion;
    if(score<(numberOfQuestion*80/100).toFixed()){
        document.getElementById('circle_score').style.backgroundColor = '#FF4E34'
        document.getElementById('congra').innerText = "Insufficinet to pass";
        document.getElementById('congra_content').innerText = "We're almost there\nGive a quick once-over to ensure you get it right the next time";
    }else{
        document.getElementById('congra').innerText = "Congraturations";
        document.getElementById('congra_content').innerText = "Excellent work\nYou'll have your driver's license in no time!";
    }
}


//go to the next question
function next(){
    currentQuestion += 1;
    if(currentQuestion<numberOfQuestion){
        gen_ans(currentQuestion);
    }else{
        showSummary();
    }
}


//back to previous question
function back(){
    if(currentQuestion>0){
        currentQuestion -= 1;
        gen_ans(currentQuestion);
    }
}


function startTest(){
    //hide start_test_container
    document.getElementById("start_test_container").style.display = "none";
    document.getElementById("main_test_area").style.display = "flex";
    //get state
    state = document.getElementById("state").value;
    numberOfQuestion = 0;
    data = [];
    currentQuestion = 0;
    menuProgress = document.getElementById('atCell');

    // load xong -> gen ans
    loadJSON(function(json) {
        let i = 0;
        json.questions.forEach(element => {
            if(element.state == state){
                data.push(element);
                numberOfQuestion++;
                //gen progress
                i++;
                let cell = document.createElement("div");
                cell.innerText = i;
                cell.setAttribute('class', 'thisCell');
                cell.setAttribute('id', `cell_${i-1}`);
                menuProgress.appendChild(cell);
            }
        });

        //show length of test
        document.getElementById("testLength").innerText = i;

        //calculate the number of mistakes allowed
        document.getElementById('numberOfMistakes').innerText = (i/5).toFixed();
        gen_ans(currentQuestion);
    });
}

// startTest();