var baseUrl = "https://opentdb.com/api.php?",
    correct = 0,
    $loading = $('#spinner').hide();


$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

/**
 * [createdParameters description]
 * @return {[type]} [description]
 */
function createdParameters(){
  var questionAmount = $("#question_amount").val().trim(),
      difficulty = $("#question_difficulty").children("option").filter(":selected").val(),
      category = $("#question_category").children("option").filter(":selected").val();

  // if(questionAmount !== parseInt(questionAmount, 10))
  //   alert("Not a valid number");
  // else if (difficulty === "")
  //   alert("Please select a difficulty");
  // else if (category !== parseInt(category, 10) || category !== "any")
  //   alert("Please select a category");
  // else
  //   alert("Successful wait for game to load");


  var params = "amount="+ questionAmount;
  if(category != "any")
    params += "&category="+ category;
  if(difficulty != "any")
    params += "&difficulty="+ difficulty;

  return params;
}

/**
 * [getQuestions description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function getQuestions(params,callback){

  $.get(baseUrl+params)

  .done(function(data){
    var responseCode = data.response_code;
    if(responseCode === 0)// Successful
      callback(data.results);
    else if(responseCode === 1)//No Results
      alert("No questions found");
    else if(responseCode === 2)//Invalid Parameter
      alert("Invalid Parameter");
    else if(responseCode === 3)//Token Not Found
      alert("Token Not Found");
    else//Token Empty
      alert("Token Empty");
  })

  .fail(function(error){
      console.log(error);
  });
}

/**
 * Displays the question and the answer type for the user.
 * @param  {object} question Question object which has the question,answers,question-type,difficulty
 */
function displayQuestion(question){

  var q = question.question;
  var questionType = question.type;
  var correctionAnswer = question.correct_answer;
  var incorrectAnswers = question.incorrect_answers;
  incorrectAnswers.push(correctionAnswer);

  console.log(question);
  //var answers = que

  $(".question").empty();
  $(".question").html(" "+q);

  if(questionType === "boolean") {
    $(".question-buttons").show();
    $(".question-dropdown").hide();
  } 
  else {
    ("#question_dropdown_answer")
    $(".question-buttons").hide();
    $(".question-dropdown").show();


    $('#question_dropdown_answer').children('option:not(:first)').remove();

    $.each(incorrectAnswers, function (index, value) {
    $('#question_dropdown_answer').append($('<option/>', { 
        value: value,
        text : value 
    }));
}); 
  }
}

/**
 * [runGame description]
 * @param  {[type]} questions [description]
 * @return {[type]}           [description]
 */
function runGame(questions)
{
  if(questions.length > 0){

    var currentQuestion = questions.shift();
    displayQuestion(currentQuestion);

    $("#submitBtn").click(function(e){

      var answer = $('#question_dropdown_answer').val();
      if(answer == "any")
        alert("Please select answer!");
      else
      {
        if(answer == currentQuestion.correct_answer){
          alert("Correct");
          correct++;
          $(".question-counter").empty();
          $(".question-counter").html(" "+correct);
          runGame(questions);
        }
        else
          alert("Incorrect");
          runGame(questions);
      }

    });



    //run(questions);
  }
  else{
    //Game over
  }
}
/**
 * [description]
 * @return {[type]} [description]
 */
(function(){

  "use strict";


  $("#question_form").submit(function(e){
    
    e.preventDefault();

  $(".form-questions").fadeOut("slow");

    var params = createdParameters();
    
    getQuestions(params,function(result){
      
      var questions = result;
      console.log(questions);
      if(questions.length > 0)
      {
        $(".question-container").fadeIn("slow",function(){
            runGame(questions);
        });
      }
   });


  });
})();