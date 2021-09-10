//add an eventListener to the from
const form = document.querySelector('#flashForm'); // select form
const questionInput = document.querySelector('#questionInput'); // select question input box from form
const answerInput = document.querySelector('#answerInput'); // select answer input box from form
const itemList = document.querySelector('.itemList');
const addQuestionBtn = document.querySelector('#addQuestion');
const closeBtn = document.querySelector("#close-btn")
const feedback = document.querySelector('.feedback');
const clearButton = document.querySelector('#clear-list');

let flashItems = [];

addQuestionBtn.addEventListener("click", function(){
    document.querySelector('.formContainer').classList.toggle("showItem");
});

closeBtn.addEventListener("click", function(){
    document.querySelector('.formContainer').classList.remove("showItem");
});

const showFeedback = function(status, classAdded){
    feedback.innerHTML = status;
    feedback.classList.add("showItem", classAdded);
    setTimeout(()=>{feedback.classList.remove("showItem")}, 2000);
};

const handleItem = function (itemQuestion, itemAnswer) {

    const items = itemList.querySelectorAll('.item');

    items.forEach(function (item) {

        if (item.querySelector('.flash-content').textContent === itemAnswer) {
            // delete event listener
            item.querySelector('.delete-item').addEventListener('click', function () {
                // debugger;
                itemList.removeChild(item);

                flashItems = flashItems.filter(function (item) {
                    return (item.question !== itemQuestion) && (item.answer !== itemAnswer);
                });

                showFeedback('item deleted successfully', 'alert-success');
            });

            //edit event listener
            item.querySelector('.edit-item').addEventListener('click', function(){
                questionInput.value = itemQuestion;
                answerInput.value = itemAnswer;
                itemList.removeChild(item);

                flashItems = flashItems.filter(function(item){
                    return (item.question !== itemQuestion) && (item.answer !== itemAnswer);
                });
            });

            //show/hide eventlistener
            item.querySelector('.toggleAnswer').addEventListener('click', function (e){
                e.preventDefault();
                item.querySelector('.flash-content').classList.toggle("showItem");
            });
        }
    })
}

const removeItem = function (item) {
    console.log(item);
    const removeIndex = (flashItems.indexOf(item));
    console.log(removeIndex);
    flashItems.splice(removeIndex, 1);
}

const getList = function (flashItems) {
    itemList.innerHTML = '';

    flashItems.forEach(function (item) {
        itemList.insertAdjacentHTML('beforeend', `<div class="col-lg-3 item border border-dark py-3 m-1 bg-white"><h3 class="flash-header">${item.question}</h3><p class="hide flash-content">${item.answer}</p><p><a href="#" class="toggleAnswer">Show/Hide Answer</a></p><button class="btn btn-outline-success float-left flash-button edit-item">EDIT</button><button class="btn btn-outline-warning float-right flashbutton delete-item">DELETE</button></div>`);

        handleItem(item.question, item.answer);
    });
}

const getLocalStorage = function () {

    const todoStorage = localStorage.getItem('flashItems');
    if (todoStorage === undefined || todoStorage === null) {
        flashItems = [];
    } else {
        flashItems = JSON.parse(todoStorage);
        getList(flashItems);
    }
}

const setLocalStorage = function (flashItems) {
    localStorage.setItem('flashItems', JSON.stringify(flashItems));
}

const validateInput = function (question, answer){
    let isValid = true;

    feedback.innerHTML = '';
    if(question === "" && answer == ""){
        feedback.classList.add('showItem', 'alert-danger');
        feedback.innerHTML += '<p>please Provide a question and answer</p>';
        isValid = false;
    }else if(question === ""){
        feedback.classList.add('showItem', 'alert-danger');
        feedback.innerHTML = '<p>no question was supplied</p>';
        isValid = false;
    }else if(answer === ""){
        feedback.classList.add('showItem', 'alert-danger');
        feedback.innerHTML += '<p>answer has not been supplied</p>';
        isValid = false;
    }else{
        isValid = true;
    }

    setTimeout(() => {
        feedback.classList.remove('showItem', 'alert-danger');
    }, 3000)

    return isValid;
}
// get local storage from page
getLocalStorage();

//add an item to the List, including to local storage
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const questionValue = questionInput.value;
    const answerValue = answerInput.value;

    //trimmed data entries
    const trimmedQuestionValue = questionValue.trim(questionValue);
    const trimmedAnswerValue = answerValue.trim(answerValue);

    const isValid = validateInput(trimmedQuestionValue, trimmedAnswerValue);

    if(isValid){
        flashItems.push({question: trimmedQuestionValue,  answer: trimmedAnswerValue});
        setLocalStorage(flashItems);
        getList(flashItems);
    }           

    questionInput.value = '';
    answerInput.value= '';
});

//clear all items from the list
clearButton.addEventListener('click', function () {
    flashItems = [];
    localStorage.clear();
    getList(flashItems);
});