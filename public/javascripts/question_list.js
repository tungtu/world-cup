var questionData = [];

// DOM Ready =============================================================
$(document).ready(function () {

	var time = {hours: "", minutes: ""};
	var seconds = 0;

	// Populate the question table on intial load
	fillQuestions(time);

	//Timer
	var timer = setInterval(function () {

		document.getElementById("time").innerHTML = time.hours + " hrs " + time.minutes + " mins " + (seconds) + " secs";

		//Trigger submit on completion of time
		if (time.hours == 0 && time.minutes == 0 && seconds == 0) {
			clearInterval(timer);
			document.getElementById("formResponse").submit();
		}

		seconds--;

		if (seconds == -1) {
			seconds = 59;
			time.minutes -= 1;

			if (time.minutes == -1) {
				time.minutes = 59;
				time.hours -= 1;
			}
		}
	}, 1000);

	// Question link click
	$('#questionList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// slight update to account for browsers not supporting e.which
	function disableF5(e) {if ((e.which || e.keyCode) == 116){e.preventDefault();}};
	// To disable f5
	$(document).bind("keydown",  function(e){disableF5(e);alert('F5 is disabled !');});
	$(document).on("keydown", disableF5);

});

// Functions =============================================================

// Fill Question List
function fillQuestions(time) {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/take_exam/list?exam_code=' + exam_code, function (data) {
		// Question Content
		questionData = data.questions;
		examData = data.exam;

		//Exam time data
		time.hours = examData.duration_hours;
		time.minutes = examData.duration_minutes;


		$qno = 1;
		// For each item in our JSON, add a question link and answer select box
		$.each(questionData, function (k,v) {
			if($qno === 1){
				tableContent += '<tr>';
				tableContent += '<td><a href="#" class="linkshowuser btn btn-default q-default" rel="' + $qno + '">' + $qno + '</a></td>';

				tableContent += '<td><select name=' + v._id + '><option value=" "> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></td>';
				tableContent += '</tr>';
			}
			else {
				tableContent += '<tr>';
				tableContent += '<td><a href="#" class="linkshowuser btn btn-default" rel="' + $qno + '">' + $qno + '</a></td>';

				tableContent += '<td><select name=' + v._id + '><option value=" "> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></td>';
				tableContent += '</tr>';
			}
			$qno += 1;
		});

		// Inject the whole content string into our existing HTML table
		$('#questionList table tbody').html(tableContent);

		questionInit();
	});
};

// Show Question
function showUserInfo(event) {

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve question number from link rel attribute
	var qno = $(this).attr('rel') - 1;
	$('.linkshowuser').addClass('btn-default').removeClass('btn-success');
	$(this).removeClass('btn-default').addClass('btn-success');

	// Get corresponding Question
	var questionObject = questionData[qno];

	//Populate Question Box
	$('#question').text(questionObject.question);
	$('#optionA').text(': '+ questionObject.optionA);
	$('#optionB').text(': '+ questionObject.optionB);
	$('#optionC').text(': '+ questionObject.optionC);
	$('#optionD').text(': '+ questionObject.optionD);
	$('#number').html('Question ' + (qno + 1) + ' : ');
};

function questionInit(){
	$('.q-default').click();
}
