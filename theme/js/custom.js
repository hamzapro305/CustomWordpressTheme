const uploadFile = (File) => {
    return new Promise((res, rej) => {
        if (File) {
            var formData = new FormData();
            formData.append("action", "upload_media");
            formData.append("file", File);

            // Make AJAX request only when the file input value changes
            $.ajax({
                url: window.ajaxUrl,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response);
                    if (response.success) {
                        res(response.data.attachment_id);
                    } else {
                        console.error(
                            "Error uploading media: " + response.data
                        );
                    }
                },
                error: function (xhr, status, error) {
                    console.error("AJAX error:", error);
                    rej(null);
                },
            });
        }
    });
};

$(document).ready(function () {
    $("#create-submission").submit(function (e) {
        e.preventDefault(); // Prevent default form submission
        var formData = new FormData($(this)[0]); // Get form data
        formData.append("action", "handle_create_post");
        
        const File = formData.get("file");
        
        uploadFile(File).then((attachment_id) => {
            formData.append("attachment_id", attachment_id); 
            $.ajax({
                url: window.ajaxUrl, // URL to submit the form data
                type: "POST", // Method (POST in this case)
                data: formData, // Form data
                processData: false, // Prevent jQuery from automatically processing the data
                contentType: false, // Prevent jQuery from automatically setting the content type
                success: function (response) {
                    // Handle success response
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    // Handle error
                    console.error(xhr.responseText);
                },
            });
        }).catch(() => {
            console.log("error")
        })
    });

    // get buy votes button
    $('#test-button').click(function() {
        var votes = 10; // Example: Number of votes
        
        // AJAX request to get buy votes button
        $.ajax({
            url: window.ajaxUrl, // AJAX endpoint URL (passed from PHP)
            type: 'POST',
            data: {
                action: 'get_buy_votes_button', // Action hook to trigger the correct function
                votes: votes // Number of votes
            },
            success: function(response) {
                // Handle successful response
                console.log(response);
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(xhr.responseText);
            }
        });
    });

});

const fun = (votes) => {
    return new Promise((res, rej) => {
        $.ajax({
            url: window.ajaxUrl, // AJAX endpoint URL (passed from PHP)
            type: 'POST',
            data: {
                action: 'get_buy_votes_button', // Action hook to trigger the correct function
                votes: votes // Number of votes
            },
            success: function(response) {
                // Handle successful response
                console.log(response);
                res(response);
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(xhr.responseText);
                rej(xhr.responseText);
            }
        });
    })
}