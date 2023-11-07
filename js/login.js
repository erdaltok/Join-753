    function init() {
        let logo = document.getElementById('logo');
        document.body.classList.add('animate');
        
        show();
    }

    function show() {
        setTimeout(function () {
            let element = document.getElementById("animation");
            if (element) {
                element.style.display = "flex";
            }
        }, 1000);
    }

    function guestLogin() {
        window.location.href = "index.html";
    }