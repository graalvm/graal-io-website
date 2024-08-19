window.addEventListener('DOMContentLoaded', (event) => {
  const buttons = document.querySelectorAll('.linkButton');
  buttons.forEach(button => {
      const radio1 = button.closest('.box').querySelector('input[type="radio"][id="radio1"]');
      const radio2 = button.closest('.box').querySelector('input[type="radio"][id="radio2"]');
      button.addEventListener('click', (e) => {
          e.preventDefault();
          let link;
          if (radio1.checked) {
              link = radio1.getAttribute('data-link');
          } else if (radio2.checked) {
              link = radio2.getAttribute('data-link');
          }
          if (link) {
              window.open(link, '_blank');
          }
      });
  });
});
 