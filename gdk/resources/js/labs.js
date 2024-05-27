window.addEventListener('DOMContentLoaded', (event) => {
    const radio1 = document.getElementById('radio1');
    const radio2 = document.getElementById('radio2');
    const linkButton = document.getElementById('linkButton');

    function setLink() {
        if (radio1.checked) {
            const link = radio1.getAttribute('data-link');
            linkButton.setAttribute('onclick', `window.location.href = "${link}";`);
        } else if (radio2.checked) {
            const link = radio2.getAttribute('data-link');
            linkButton.setAttribute('onclick', `window.location.href = "${link}";`);
        }
    }
    setLink();

    radio1.addEventListener('change', setLink);
    radio2.addEventListener('change', setLink);
});

    