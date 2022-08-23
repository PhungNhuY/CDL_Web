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


//load select state
listOfState = [];
//load state
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


function startTest(){
    
    document.getElementById("start_test_container").style.display = "none";
    document.getElementById("question_container").style.display = "block";
    //get state
    state = document.getElementById("state").value;
    numberOfQuestion = 0;
    data = [];
    currentQuestion = 0;

    // load xong -> gen ans
    loadJSON(function(json) {
        json.questions.forEach(element => {
            if(element.state == state){
                data.push(element);
                numberOfQuestion++;
            }
        });
        gen_ans(currentQuestion);
    });
}


//display the ans
function gen_ans(id){
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

    answer1.setAttribute('onclick', 'choose(1)');
    answer2.setAttribute('onclick', 'choose(2)');
    answer3.setAttribute('onclick', 'choose(3)');
    answer4.setAttribute('onclick', 'choose(4)');

    explanation_content.innerText = data[id].explanation;
    explanation.style.display = 'none';

    for(i=1;i<=4;i++){
        document.getElementById("abcd_"+i).style.backgroundColor = '#b9b9b9';
        document.getElementById("abcd_"+i).style.color = 'black';
        document.getElementById("answer"+i).style.border = '1px solid #b9b9b9';
        document.getElementById("answer"+i).style.backgroundColor = 'white';
    }

    if(data[id].userChoose != null && data[id].userChoose != ''){
        choose(data[id].userChoose);
    }
}


//show ans after user clicked
function choose(number){
    //wrong color
    document.getElementById("abcd_"+number).style.backgroundColor = '#FF4E34';
    document.getElementById("answer"+number).style.border = '1px solid #FF4E34';
    document.getElementById("answer"+number).style.backgroundColor = '#FFEBE8';
    document.getElementById("abcd_"+number).style.color = "white";
    //correct color
    correctAns = data[currentQuestion].answerCorrect;
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
    
    data[currentQuestion].userChoose = number;
}


//go to the next question
function next(){
    currentQuestion += 1;
    if(currentQuestion<numberOfQuestion){
        gen_ans(currentQuestion);
    }else{
        document.getElementById("question_container").style.display = "none";
        document.getElementById("summary").style.display = "block";
        score = 0;
        for(i=0;i<50;i++){
            if(data[i].answerCorrect == data[i].userChoose){
                score+=1;
            }
        }
        document.getElementById("score").innerText = score + '/' + numberOfQuestion;
        if(score<(numberOfQuestion*80/100)){
            document.getElementById('circle_score').style.backgroundColor = '#FF4E34'
            document.getElementById('congra').innerText = "Insufficinet to pass";
            document.getElementById('congra_content').innerText = "We're almost there\nGive a quick once-over to ensure you get it right the next time";
        }else{
            document.getElementById('congra').innerText = "Congraturations";
            document.getElementById('congra_content').innerText = "Excellent work\nYou'll have your driver's license in no time!";
        }
    }
}


//back to previous question
function back(){
    if(currentQuestion>0){
        currentQuestion -= 1;
        gen_ans(currentQuestion);
    }
}


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