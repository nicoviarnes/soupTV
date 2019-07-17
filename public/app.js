/* SoupTV
 * front-end
 * ==================== */

// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#soupMenu").empty();
  $.getJSON("/soups", function(data) {
    // For each note...
    if (data) {
      for (var i = 0; i < data.length; i++) {
        $("#soupMenu").append(
          `<tr class='data-entry' data-id=${data[i]._id}>
            <td class="soup-name" style="width: 33%; padding: 10px 30px 10px 30px">${
              data[i].soupItem
            }<br><p class="soup-ingredients">${data[i].soupIngredients}</p></td>
          </tr>`
        );
      }
    }
  });
}

setInterval(function() {
  $("#date").text(moment().format("dddd, MMMM Do, YYYY"));
}, 1000);

function getEdit() {
  // Empty any results currently on the page
  $("#soupEditMenu").empty();
  $.getJSON("/soups", function(data) {
    // For each note...
    if (data) {
      for (var i = 0; i < data.length; i++) {
        // ...populate #results with a p-tag that includes the note's title and object id
        $("#soupEditMenu").append(
          `<tr class='data-entry' data-id=${data[i]._id}>
            <td><strong>${data[i].soupItem}</strong><br><p>${
            data[i].soupIngredients
          }</p></td>
            <td><button class='btn btn-danger delete' data-id='${
              data[i]._id
            }'>X</button></td>
          </tr>`
        );
      }
    }
  });
}

// // Runs the getResults function as soon as the script is executed
getResults();
getEdit();

setInterval(() => {
  console.log("getting results in 60 seconds");
  getResults();
}, 60000);

// When the #make-new button is clicked
$(document).on("click", "#addSoup", function() {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  console.log($("#soupItem").val(), $("#soupItem").data("ing"));
  let ingredients;
  if ($("#soupIngredients").val()) {
    ingredients = $("#soupIngredients").val();
  } else {
    ingredients = $("#soupItem option:selected").data("ing");
  }
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      soupItem: $("#soupItem").val(),
      soupIngredients: ingredients,
      created: Date.now()
    }
  })
    // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
      console.log(data);
      // Add the title and delete button to the #results section
      $("#soupEditMenu").append(
        `<tr class='data-entry' data-id=${data._id}>
          <td class="soup-name">${data.soupItem}<p class="soup-ingredients">${
          data.soupIngredients
        }</p></td>
          <td class="soup-price">$${data.soupPrice}</td>
          <td><span class=delete>X</span></td>
        </tr>`
      );
      // Clear the note and title inputs on the page
      $("#soupItem").val("");
      $("#soupPrice").val("");
      getResults();
      getEdit();
    });
});

// When the #clear-all button is pressed
$("#clear-all").on("click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function(response) {
      $("#soupMenu").empty();
      $("#soupEditMenu").empty();
      getResults();
      getEdit();
    }
  });
});

// When user clicks the delete button for a note
$(document).on("click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this)
    .parent()
    .parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#soupItem").val("");
      $("#soupPrice").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='addSoup'>Submit</button>");
      getResults();
      getEdit();
    }
  });
});

setInterval(function() {
  $(".clock").html(moment().format("h:mm A"));
}, 1000);
