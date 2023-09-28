$(document).ready(function () {
    const checkbox = $("#checkbox");
    const submitButton = $("#submitButton");
    const divInfo = $("#info");
    const flecompltDiv = $(".flecomplt");
    const flestDiv = $(".flest");

    // Hide the containers initially
    flecompltDiv.hide();
    flestDiv.hide();

    // Add a click event listener to the checkbox
    checkbox.click(function () {
        // Check if the checkbox is now checked
        if (checkbox.prop("checked")) {
            // Enable the submit button
            submitButton.prop("disabled", false);
        } else {
            // If the checkbox is unchecked, disable the submit button
            submitButton.prop("disabled", true);
        }
    });
    // Wait for 20 seconds (20000 milliseconds) before enabling the checkbox
    setTimeout(function () {
        checkbox.prop("disabled", false);
    }, 20);

    // Add a click event listener to the "Complaint Status" link
    $("#complaintStatus").click(function (event) {
        // Prevent the default behavior of following the link
        event.preventDefault();
        // Hide the "info" and "flecomplt" divs
        divInfo.hide();
        flecompltDiv.hide();
        // Show the "flest" div
        flestDiv.show();
    });
    submitButton.click(function () {
        // Hide div with id "info"
        divInfo.hide();
        // Show div with class "flecomplt"
        flecompltDiv.show();
    });
    // Add a click event listener to the "File Complaint" link
    $("#fileComplaint").click(function (event) {
        // Prevent the default behavior of following the link
        event.preventDefault();
        // Show the "info" div
        divInfo.show();
        // Hide the "flecomplt" and "flest" divs
        flecompltDiv.hide();
        flestDiv.hide();
        // Perform your action for "File Complaint" here
        // For example, you can redirect to a specific URL or show a modal
    });
});


    function showSuccessMessage(message, complaintNumber) {
        // Create the success modal element
        const successModal = document.createElement("div");
        successModal.className = "success-modal";
    
        // Add content to the success modal
        successModal.innerHTML = `
            <h2>${message}</h2>
            <p>Your complaint number is: ${complaintNumber}</p>
            <p>Redirecting to Google.com in <span id="countdown">30</span> seconds...</p>
        `;
    
        // Append the success modal to the document body
        document.body.appendChild(successModal);
    
        // Countdown timer to redirect after 30 seconds
        let countdown = 30;
        const countdownElement = document.getElementById("countdown");
        const countdownTimer = setInterval(function() {
            countdownElement.textContent = countdown; // Update the countdown element
            if (countdown <= 0) {
                clearInterval(countdownTimer);
                successModal.remove(); // Remove the success modal
    
                // Redirect to Google.com and clear history
                window.location.replace("https://www.google.com");
    
                // The form reset code here will not run due to page redirection
            }
            countdown--;
        }, 1000);
    }
    
    // Function to reset the form and hide success message
    function resetForm() {
        const form = document.getElementById("complaintForm");
        form.reset();
    }
    
    const fileInput = document.getElementById("file_upload");
    const fileList = document.getElementById("fileList");
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    
    fileInput.addEventListener("change", function (event) {
        const selectedFiles = event.target.files;
    
        // Clear the previous file list
        fileList.innerHTML = "";
    
        for (const file of selectedFiles) {
            if (file.size > maxFileSize) {
                alert("File size should be less than 10MB.");
                // Clear the file input to remove the invalid file
                fileInput.value = "";
                return; // Prevent form submission or further processing
            }
    
            // Replace spaces with underscores in the file name
            const fileNameWithoutSpaces = file.name.replace(/\s/g, "_");
    
            // Create a list item for each selected file
            const listItem = document.createElement("li");
            listItem.textContent = fileNameWithoutSpaces;
    
            // Add a button to remove the file
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", function () {
                // Remove the file from the list and clear the input
                listItem.remove();
                const index = Array.from(fileInput.files).indexOf(file);
                if (index !== -1) {
                    const newFiles = Array.from(fileInput.files);
                    newFiles.splice(index, 1);
                    fileInput.files = new FileList(newFiles, fileInput);
                }
            });
    
            listItem.appendChild(removeButton);
            fileList.appendChild(listItem);
        }
    });
    

    
    function populateYears() {
            const departmentSelect = document.getElementById("dept");
            const yearSelect = document.getElementById("year");
            const selectedDepartment = departmentSelect.value;
            const departments = {
                baf: ["FYBAF", "SYBAF", "TYBAF"],
                bbi: ["FYBBI", "SYBBI", "TYBBI"],
                bcom: ["FYBCom", "SYBCom", "TYBCom"],
                bscit: ["FYBScIT", "SYBScIT", "TYBScIT"],
                bmm: ["FYBMM", "SYBMM", "TYBMM"],
                bms: ["FYBMS", "SYBMS", "TYBMS"],
            };
            yearSelect.innerHTML = "<option value=''>Select a Year</option>";
            yearSelect.disabled = !(selectedDepartment in departments);
            if (selectedDepartment in departments) {
                const yearList = departments[selectedDepartment];
                for (const year of yearList) {
                    const option = new Option(year, year);
                    yearSelect.appendChild(option);
                }
            }
    }
    
// Regular expression pattern to allow only specific characters
const allowedCharsPattern = /^[a-zA-Z0-9,.\-_()\/@:&?\\% ]*$/;

// Function to validate and restrict input
function validateAndRestrictInput(inputElement) {
    inputElement.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        if (!allowedCharsPattern.test(inputValue)) {
            // If input contains disallowed characters, remove them
            const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9,.\-_()\/@:&?\\% ]/g, '');
            event.target.value = sanitizedValue;
        }
    });
}

// Apply the validation and restriction to all input fields in the form
const formInputs = document.querySelectorAll('#complaintForm input, #complaintForm textarea, #complaintForm select');
formInputs.forEach(input => {
    validateAndRestrictInput(input);
});
   
    function refreshCaptcha() {
        const captchaImg = document.getElementById("captchaImg");
        if (captchaImg) {
            captchaImg.src = "captcha.php?" + new Date().getTime();
        }
    }
    
    function validateForm() {
        const departmentSelect = document.getElementById("dept");
        const yearSelect = document.getElementById("year");
        const committeeSelect = document.getElementById("cmite");
        const incidentDescriptionTextarea = document.getElementById("incident_description");
        const involvedInput = document.getElementById("involved");
        const incidentDateInput = document.getElementById("incdnt_date");
        const captchaInput = document.getElementById("captchaInput");

        const inputsToValidate = [
            { element: departmentSelect, message: "Please select a department." },
            { element: yearSelect, message: "Please select a year." },
            { element: committeeSelect, message: "Please select a committee." },
            { element: incidentDescriptionTextarea, message: "Please enter the incident description." },
            { element: involvedInput, message: "Please enter the individual/organization involved." },
            { element: incidentDateInput, message: "Please select the incident date." },
            { element: captchaInput, message: "Please enter the CAPTCHA." },
        ];

        for (const input of inputsToValidate) {
            if (input.element.value.trim() === "") {
                alert(input.message);
                return false;
            }
        }

        return true;
}


        
    document.getElementById("complaintForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        if (validateForm()) {
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const message = "Complaint submitted successfully!";
                    const complaintNumber = data.complaintNumber;
                    showSuccessMessage(message, complaintNumber);
                } else {
                    alert(data.message);
                }
            })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while submitting the form.');
                });
        
                // Reset the form after form submission
                resetForm();
        
                // Use the History API to replace the current state, so the user cannot go back to the form
                window.history.replaceState(null, null, window.location.href);
        }
    });
        
    // Initialize the form and other functionalities on DOM content load
    document.addEventListener("DOMContentLoaded", function () {
        resetForm();
        populateYears();
    });
