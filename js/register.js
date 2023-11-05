    function init() {
        let logo = document.getElementById('logo');
        document.body.classList.add('animate');
        show();
    }

    function show() {
        setTimeout(function () {
            let element = document.getElementById("animation","sing-up");
            if (element) {
                element.style.display = "flex";
            }
        }, 1000);
    }