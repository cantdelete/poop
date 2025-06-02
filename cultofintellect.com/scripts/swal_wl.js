function whitelist() {
    return;
    var key;
    var username;
    var password;
    var email_address;
    var confirm_password;
    var blacklisted;

    Swal.mixin({
        confirmButtonText: "Next",
        progressSteps: ["1", "2", "3", "4", "5", "6"],
        reverseButtons: true,
        inputAttributes: {
            required: true,
        },
        allowOutsideClick: false,
        imageUrl: "/images/logo/dx9ware_logo3.png",
        imageWidth: 300,
        validationMessage: `This field is required.`,
        showLoaderOnConfirm: true,
        cancelButtonText: "Restart",
        preConfirm: (input) => {
            // KEY VALIDATION
            if (Swal.getQueueStep() == 1) {
                key = input;
                return $.post(
                    `/dx9ware/assets/wl.php`,
                    { checkKey: true, key: input },
                    function (result) {
                        if (result == "InvalidKey") {
                            Swal.showValidationMessage(`Invalid Key!`);
                        } else if (result == "MissingKey") {
                            Swal.showValidationMessage(
                                `You need to enter a key.`
                            );
                        } else if (result == "error") {
                            Swal.showValidationMessage(`Unexpected error1.`);
                        }
                    }
                );
            }

            // USERNAME VALIDATION
            else if (Swal.getQueueStep() == 2) {
                username = input;
                if (username.length > 20 || username.length < 3) {
                    return Swal.showValidationMessage(
                        "Username must be greater than 3 characters, and less than 20 characters."
                    );
                }
                var pattern = new RegExp("^[A-Za-z][A-Za-z0-9_]{2,19}$");
                if (!username.match(pattern)) {
                    return Swal.showValidationMessage(
                        "The username does not meet the requested format. The username must only contain English alphanumeric characters"
                    );
                }
            }

            //EMAIL
            else if (Swal.getQueueStep() == 3) {
                email_address = input;
            }

            // PASSWORD
            else if (Swal.getQueueStep() == 4) {
                password = input;
            }

            // CONFIRM PASSWORD VALIDATION
            else if (Swal.getQueueStep() == 5) {
                confirm_password = input;
                if (password != confirm_password) {
                    return Swal.showValidationMessage(
                        "This password does not match."
                    );
                }
            }
        },
    })
        .queue([
            {
                title: "Begin?",
                text: "Would you like to begin the whitelist process? You must have purchased before doing this.",
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: `I haven't bought yet.`,
                confirmButtonText: "Begin!",
                width: 600,
            },
            {
                input: "text",
                title: "Key",
                text: 'Enter the key that was given to you at checkout. It will be inside an email from "Cult of Intellect". The key is a long string of both letters, numbers and symbols starting with "DX9WARE".',
                showCancelButton: true,
                width: 600,
            },
            {
                input: "text",
                title: "Username",
                html: "Enter your desired Cult of Intellect account username.",
                showCancelButton: true,
                width: 600,
            },
            {
                input: "text",
                title: "Email Address",
                html: "Enter your email address.<br><br>This email address will be used for password reset functionality.<br><span class='text-danger'>Ensure this email address is valid. You will be unable to use DX9WARE until this is confirmed as a valid address.</span>",
                showCancelButton: true,
                width: 600,
            },
            {
                input: "password",
                title: "Password",
                html: `Enter your desired Cult of Intellect account password.<br><br>
                The password should meet the below requirements.<br>
                • A minimum of <span class="text-danger">8</span> <span class="text-info">characters</span><br>
                • A minimum of <span class="text-danger">1</span> <span class="text-info">lowercase</span> character<br>
                • A minimum of <span class="text-danger">1</span> <span class="text-info">uppercase</span> character<br>
                • A minimum of <span class="text-danger">1</span> <span class="text-info">number</span>`,
                showCancelButton: true,
                width: 600,
            },
            {
                input: "password",
                title: "Confirm Password",
                html: `Please re-enter your desired account password.`,
                showCancelButton: true,
                width: 600,
            }
        ])
        .then((result) => {
            if (result.value) {
                Swal.fire({
                    title: `Review`,
                    html: `Please ensure these results are correct.
                <br><br>
                <strong>Key:</strong><code> ${key}</code><br><br>
                <strong>Username:</strong><code> ${username}</code><br><br>
                <strong>Password:</strong><code> ${password}</code><br><br>
                <br><br>
                <div id="recaptcha" class="row justify-content-center"></div>`,
                    showConfirmButton: true,
                    confirmButtonText: "I'm ready to whitelist!",
                    showDenyButton: true,
                    denyButtonText: "Restart",
                    showLoaderOnConfirm: true,
                    didOpen: function () {
                        grecaptcha.render("recaptcha", {
                            sitekey: "6LdwF7oZAAAAAK3A22-eQ9l9nQvEAFxglvi6-6Cg",
                        });
                    },
                    preConfirm: () => {
                        if (grecaptcha.getResponse().length === 0) {
                            return Swal.showValidationMessage(
                                "Please verify that you are not a robot."
                            );
                        }

                        if (blacklisted == true) {
                            return Swal.fire(
                                `Blacklisted!`,
                                `You are blacklisted from dx9ware. Sorry.`,
                                `error`
                            );
                        }

                        return $.post(
                            baseURL + "dx9ware/whitelist",
                            {
                                key: key,
                                username: username,
                                password: password,
                                email_address: email_address,
                                confirm_password: confirm_password,
                                response: grecaptcha.getResponse(),
                            },
                            function (result) {
                                return Swal.fire({
                                    title: result.title,
                                    html: result.description,
                                    icon: result.icon,
                                    width: 700,
                                });
                            }
                        ).fail((result) => {
                            const response = result.responseJSON;
                            return Swal.fire({
                                title: response.title,
                                html: response.description,
                                icon: response.icon,
                                confirmButtonText: "Retry?",
                            }).then((result) => {
                                if (result.isConfirmed) return whitelist();
                            });
                        });
                    },
                }).then((result) => {
                    if (result.isDenied) {
                        return whitelist();
                    }
                });
            }
        });
}
