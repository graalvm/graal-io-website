//Logo location while reduce browser window

const logoMobile = document.querySelector('.menu__row img');

function setMargin() {
  if (window.innerWidth < 768) {
    logoMobile.style.marginLeft = '50px';
  } else {
    logoMobile.style.marginLeft = '0';
  }
}
setMargin();
window.addEventListener('resize', () => {
  setMargin();
});

//Main page graphic location while reduce browser window

const showcaseGraphic = document.querySelector('.showcase-graphic');

function updateBackground() {
  if (showcaseGraphic) {
    if (window.innerWidth < 1080) {
      showcaseGraphic.style.background = "url('/gcn/resources/img/gcn_home_page/back-home-layer.png')  0 0/cover no-repeat, #171923";
    } else {
      showcaseGraphic.style.background = "url('/gcn/resources/img/gcn_home_page/mascoooot2x(min).png') 90% 90%/contain no-repeat, url('/gcn/resources/img/gcn_home_page/back-home-layer.png')  0 0/cover no-repeat, #171923";
    }
  }
}
window.addEventListener('load', updateBackground);
window.addEventListener('resize', updateBackground);