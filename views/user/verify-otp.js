<!DOCTYPE html>
<html lang="zxx">
<head>
    <meta charset="UTF-8" />
    <meta name="description" content="Male_Fashion Template" />
    <meta name="keywords" content="Male_Fashion, unica, creative, html" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Male-Fashion</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" type="text/css" />
    <link rel="stylesheet" href="css/elegant-icons.css" type="text/css" />
    <link rel="stylesheet" href="css/magnific-popup.css" type="text/css" />
    <link rel="stylesheet" href="css/nice-select.css" type="text/css" />
    <link rel="stylesheet" href="css/owl.carousel.min.css" type="text/css" />
    <link rel="stylesheet" href="css/slicknav.min.css" type="text/css" />
    <link rel="stylesheet" href="css/style.css" type="text/css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"/>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: "Nunito Sans", sans-serif;
            overflow: hidden;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .login_wrap {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            border-radius: 5px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .heading_s1 h3 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .otp-timer {
            display: inline-block;
            margin-left: 10px;
            font-size: 14px;
            position: relative;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            line-height: 60px;
            text-align: center;
            background: #f2f2f2;
            border: 2px solid #ddd;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        #timerValue {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #333;
            line-height: 60px;
        }
        #timerValue.expired {
            font-size: 14px;
            color: red;
        }
        .btn-primary {
            background-color: #007bff;
            border: none;
            width: 100%;
            margin-top: 10px;
            display: block;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
        .btn-secondary {
            width: 100%;
            background-color: #6c757d;
            border: none;
            margin-top: 10px;
            display: block;
        }
        .btn-secondary:hover {
            background-color: #5a6268;
        }
        .alert-danger {
            margin-top: 15px;
            text-align: center;
        }
        .text-center {
            text-align: center;
            margin-top: 15px;
        }
        .text-muted {
            color: #6c757d;
            text-align: center;
        }
        .pt-25 {
            padding-top: 25px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="login_wrap">
        <div class="padding_eight_all bg-white">
            <div class="heading_s1">
                <h3>Email Verification Page</h3>
            </div>
            <form id="otpForm" action="/verify-otp" method="post" onsubmit="return validateOTPForm()">
                <div class="form-group">
                    <label for="otp">Enter OTP:</label>
                    <input type="text" id="otp" name="otp" class="form-control" required maxlength="6" pattern="\d*" />
                </div>
                <button type="submit" class="btn btn-primary">Verify Email</button>
                <div class="form-group text-center">
                    <div id="otpTimer" class="otp-timer">
                        <span id="timerValue">60</span>
                    </div>
                    <button type="button" class="btn btn-secondary">Resend OTP</button>
                </div>
                <% if (locals.message && message.length > 0) { %>
                <div class="alert alert-danger"><%= message %></div>
                <% } %>
            </form>
            <div class="text-muted text-center pt-25">
                Already verified? <a href="/login">Login now</a>
            </div>
        </div>
    </div>
</div>
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    document.getElementById("otp").focus();

    let timer = 60;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            document.getElementById("timerValue").textContent = timer;
            if (timer <= 0) {
                clearInterval(timerInterval);
                document.getElementById("timerValue").classList.add("expired");
                document.getElementById("timerValue").textContent = "Expired";
                document.getElementById("otp").disabled = true;
            }
        }, 1000);
    }
    startTimer();
function validateOTPForm(){
    const otpInput = document.getElementById("otp").value;
    $.ajax({
        type:"POST",
        url:"verify-otp",
        data:{otp:otpInput},
        success:function(response){
            if(response.success){
                Swal.fire({
                    icon:"success",
                    title:"OTP verified successfully",
                    showConfirmButton:false,
                    timer:1500,
                }).then(()=>{
                    window.location.href = response.redirectUrl;
                })
            }else{
                Swal.fire({
                    icon:"error",
                    title:"Error",
                    text:response.message,
                })
            }
        },
        error:function(){
            Swal.fire({
                icon:"error",
                title:"invalid OTP"
                text : "Try again"
            })
        }
    })
    return false
}
</script>
<%- include("../../views/partials/user/footer") %>
</body>
</html>

