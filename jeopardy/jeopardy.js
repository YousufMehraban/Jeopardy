// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const categoriesNum = 6
const clueNum = 5
let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
    const res = await axios.get('https://jservice.io/api/categories?count=100')
    categoriesID = res.data.map(function(val){
        return val.id
    })
    return _.sampleSize(categoriesID, 6)
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    const res = await axios.get(`https://jservice.io/api/category/?id=${catId}`)
    const category = res.data
    const allClues = res.data.clues
    let ramdomClues = _.sampleSize(allClues, 5)
    let clues = ramdomClues.map(function(clue){
        return({answer: clue.answer,
        question: clue.question,
        showing: null})
    })
    return {title: category.title, clues}

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const $head = $("#head")
    $head.empty()
    const $tr = $("<tr>")
    for (let th = 0; th < categoriesNum; th++){
        // let IDS = await getCategoryIds()
        // $tr.append($("<th>").text((await getCategory(IDS)).title))
        $tr.append($("<th>").text(categories[th].title))
    }
    $head.append($tr)

    const $body = $("#body")
    $body.empty()
    for (let row = 0; row < clueNum; row++){
        let $tr = $("<tr>")
        for (let td = 0; td < categoriesNum; td++){
        $tr.append($("<td>").attr("id", `${td}-${row}`).text("?"))
        }
    $body.append($tr)
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;
    // console.log(categories)

    let [categoryID, clueID] = id.split('-')
    let clue = categories[categoryID].clues[clueID]
    // console.log(clue)
    
    let message;

    if (!clue.showing){
        message = clue.question
        clue.showing = 'question'
    } else if (clue.showing === 'question'){
        message = clue.answer
        clue.showing = 'answer'
    } else {return};

    // let txt = document.querySelector(`#${categoryID}-${clueID}`)
    let txt = document.getElementById(`${categoryID}-${clueID}`)
    txt.innerText = message
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const IDs = await getCategoryIds()

    categories = []
    for (let ID of IDs){
        categories.push(await getCategory(ID))
    }

    fillTable()
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

$("#start-button").on('click', setupAndStart)
// $("#table-container").on("click", "td", handleClick);


$(function () {
    setupAndStart();
    $("#table-container").on("click", "td", handleClick);
  }
);