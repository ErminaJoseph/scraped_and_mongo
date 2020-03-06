$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p>" + data[i].title + "<br />" + data[i].summary+ "<br />" + data[i].link + "</p>");
        $("#articles").append("<button id='leave-comment' data-id=" + data[i]._id + "> Leave a Comment! </button>")
        $("#articles").append("<hr />")
    }
});

$(document).on("click", "#leave-comment", function() {
    $("#comments").empty();
    var commentID = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + commentID
    })
    .then(function(data){
        console.log(data);
        $("#comments").append("<h3>" + data.title + "</h2");
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>"+ "<br />");
        $("#comments").append("<button data-id='" + data._id + "' id='save-note'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#save-note", function() {
    var commentID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + commentID,
        data: {
            title: $("titleinput").val(),
            body: $("bodyinput").val()
        }
    })
    .then(function(data) {
        console.log(data);
        $("comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
})