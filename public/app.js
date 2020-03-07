$.getJSON("/articles", function(data) {
    console.log(data[0]);
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p id='article-headline'>" + data[i].title + "</p>" + "<p id='article-summary'>" + data[i].summary +  
        "</p>" + "<p id='article-link'>" + data[i].link + "</p>");
        $("#articles").append("<button id='leave-comment' data-id=" + data[i]._id + "> Leave a Comment! </button>")
        $("#articles").append("<hr />")
    }
});

$.getJSON("/saved-comments", function(data) {
    console.log("test");
    for (var i = 0; i < data.length; i++) {
        if (data[i].comment != null) {
            $("#saved-comments-div").append("<p id='article-headline'>" + data[i].title + "</p>");
            $("#saved-comments-div").append("<p>" + data[i].comment.title + "</p>");
            $("#saved-comments-div").append("<p>" + data[i].comment.body + "</p>");
            $("#saved-comments-div").append("<button id='delete-comment' data-id=" + data[i].comment._id + "> Delete! </button>")
            $("#saved-comments-div").append("<hr />")
        }
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
        $("#comments").append("<h3>" + data.title + "</h3>");
        $("#comments").append("<input id='titleinput' name='title' >" + "<br />");
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>" + "<br />");
        $("#comments").append("<button data-id='" + data._id + "' id='save-comment'>Post Comment!</button>");

        if (data.comment) {
            $("#titleinput").val(data.comment.title);
            $("#bodyinput").val(data.comment.body);
        }
    });
});

$(document).on("click", "#save-comment", function() {
    var saveID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + saveID,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .then(function(saving) {
        console.log(saving);
        $("#comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#delete-comment", function() {
    var deleteID = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/saved-comments/" + deleteID
    })
    .then(function(deleted) {
        console.log(deleted);
        location.reload(true);
    });
});