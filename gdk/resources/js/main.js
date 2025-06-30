// On-load actions
$(window).on("load", function () {
  $("body").removeClass("preload");
});

function copySnippet(elem) {
  var div = $(elem.parentElement.parentElement);
  text = "";
  div.find("figure").each(function () {
    var currentText = $(this).text();
    text += currentText;
  });
  copyTextToClipboard(text);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
  }
  document.body.removeChild(textArea);
}

function fiddleSnippet(elem, fileName) {
  elem.onclick = null;
  var className = fileName.match(/([^/]*)\.java$/)[1];
  var div = elem.parentElement.parentElement;
  displayFiddleLoadingMessage(div);
  GraalVMFiddle.replace(div, div._snippets, {className: className});
}

function displayFiddleLoadingMessage(elem) {
  var w = elem.clientWidth;
  var h = elem.clientHeight;
  var outer = document.createElement('div');
  outer.style.position = 'relative';
  var inner = document.createElement('div');
  inner.style.position = 'absolute';
  inner.style.left = (w/4) + 'px';
  inner.style.top = (h/3) + 'px';
  inner.style.width = (w/2) + 'px';
  inner.style.height = (h/3) + 'px';
  inner.style.lineHeight = (h/3) + 'px';
  inner.className = 'fiddle-loading-message';
  inner.appendChild(document.createTextNode('Loading...'));
  outer.appendChild(inner);
  elem.prepend(outer);
}

function createTerminal(serverUrl, containerId, terminalId, uid) {
  var appearDuration = 350;
  var revealDuration = 750;
  var bootTerminalDuration = 750;

  $(containerId).animate({
    padding: "8px",
    opacity: 1.0
  }, appearDuration)

  $(terminalId).animate({
    height: "260px"
  }, revealDuration, function () {
    $(terminalId).terminal(function (command) {
      var shell = this;

      if (command !== "") {
        shell.freeze(true);
        var currentPrompt = shell.get_prompt();
        shell.set_prompt("");
        var escapedLine = encodeURIComponent(command);
        var url = serverUrl + "/send-line?uid=" + uid + "&line=" + escapedLine;
        $.get(url).done(function (data) {
          console.log(data);
          data = JSON.parse(data);
          if (data["language"]) {
            currentPrompt = data["language"] + "> ";
          }
          if (data["error"]) {
            shell.echo(data["error"]);
            if (!data["terminate"]) {
              shell.freeze(false);
              shell.set_prompt(currentPrompt);
            }
          } else {
            console.log(data)
            var output = JSON.parse("\"" + data["output"] + "\"");
            shell.echo(output);
            shell.freeze(false);
            shell.set_prompt(currentPrompt);
          }
        }).fail(function (r) {
          shell.echo("Server error code " + r.status + ": " + r.statusText);
          shell.enable();
        })
      } else {
        shell.echo("");
      }
    }, {
      greetings: "GraalVM Shell (type 'js', 'ruby' or 'R' to switch languages)",
      name: "graalvm_shell",
      height: 240,
      prompt: "js> ",
      onInit: function () {
        var shell = this;
        $(terminalId).click(function () {
          console.log("Focused terminal.");
          shell.focus(true);
        });
        shell.disable();
        shell.enable();
      }
    });

    $(terminalId).animate({
      opacity: 1.0
    }, bootTerminalDuration);
  });
}

function establishSessionAndCreateTerminal(serverUrl) {
  console.log("Establishing shell session with " + serverUrl);
  $.get(serverUrl + "/start-session").done(function (data) {
    console.log(data);
    data = JSON.parse(data);
    if (data["error"]) {
      console.error(data["error"]);
    } else {
      console.log("Starting terminal session...");
      createTerminal(serverUrl, "#terminal-container", "#terminal", data["uid"]);
    }
  }).fail(function (r) {
    console.error(r);
  });
}

$(document).ready(function () {

  // Highlightjs init
  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

//Header loading
(document, 'script', 'twitter-wjs');
(function () {
    var topBanner = $('.showcase-banner');
    var header = $('.header');
    var topBannerHeight = topBanner.innerHeight();
    var showed = false;

    $(window).scroll(function () {
      var scrollTop = $(document).scrollTop();

      if (scrollTop > topBannerHeight && !showed) {
        header.addClass('header--filled animated fadeIn');
        showed = true;
      } else if (scrollTop <= topBannerHeight && showed) {
        header.removeClass('header--filled animated fadeIn').addClass('header--filled animated fadeOut');
        setTimeout(function () {
          header.removeClass('header--filled animated fadeOut');
        }, 500);
        showed = false;
      }
    });
  }());

  // Sticky content menu
  (function () {
    var headerHeight = $('.header').innerHeight();
    var sectionHeadingHeight = $('.section-heading').innerHeight();
    var offsetTop = parseInt(headerHeight) + parseInt(sectionHeadingHeight);

    var contentMenuHorixontal = $(".toc-bullets--horizontal");
    var showed = false;

    $(window).scroll(function () {
      var scrollTop = $(document).scrollTop();

      if (scrollTop > offsetTop && !showed) {
        contentMenuHorixontal.addClass('toc-bullets--horizontal-stiky');
        showed = true;
      } else if (scrollTop <= sectionHeadingHeight && showed) {
        contentMenuHorixontal.removeClass('toc-bullets--horizontal-stiky');
        showed = false;
      }
    });
  }());

  // Mobile menu

  if ($('.js-show-menu').length) {
    $(".js-show-menu, .overlay").click(function (e) {
      e.preventDefault();
      $('body').toggleClass('overflow-hidden');
      $(".menu-btn--menu").toggleClass('menu-open').toggleClass('close');
      $('.menu__list').toggleClass('open');
      $('.menu__logo').toggleClass('open');
      $('.menu__launch').toggleClass('open');
      $('.menu').toggleClass('open');
      $('.overlay').fadeToggle();
    });
  }

  if ($(".js-show-sidebar").length) {
    $(".js-show-sidebar, .overlay").click(function (e) {
      e.preventDefault();
      $('body').toggleClass('overflow-hidden');
      $(".menu-btn--sidebar").toggleClass('menu-open');
      $('.sidebar').toggleClass('open');
      $('.overlay').fadeToggle();
    });
  }

  if (window.location.href.toString().split(window.location.host)[1] === '/faq/') {
    var contentWrapp = $('#content-wrapper');

    var allIds = contentWrapp.find($("*[id]:not([id='graalvm---run-any-language-anywhere'])"));

    allIds.addClass('title-faq');
    allIds.nextUntil("h3").hide();

    allIds.attr('tabindex', "0");

    allIds.click(function () {
      showHiddenContent($(this));
    });

    allIds.keypress(function (e) {
      var key = e.which;
      if (key == 13) {
        showHiddenContent($(this));
      }
    });

    function showHiddenContent(element) {
      element.toggleClass("title-faq--opened");
      element.nextUntil("h3").slideToggle();
    }
  }

  (function () {
    var videoId = $('#js-video');
    //play video on hover
    $("body").on('mouseover', '.home-banner__video', function () {
      videoId.get(0).play();
    });

    //pause video on mouse leave
    $("body").on('mouseleave', '.home-banner__video', function () {
      videoId.get(0).pause();
    });
  })()
});

// Sticky sidebar
var sidebar = document.querySelector('.sidebar-wrap');

if (sidebar) {
  var stickySidebar = new StickySidebar(sidebar, {
    topSpacing: 74,
    bottomSpacing: 40
  });

  sidebar.addEventListener('affix.container-bottom.stickySidebar', function (event) {
    window.dispatchEvent(new Event('resize'));
  });
}

// Video popup
var modal = document.getElementById('video-view');
var btnsArray = document.querySelectorAll(".js-popup");
var closeModal = document.getElementById("js-close");
var btn;

[].forEach.call(btnsArray, function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    var videoIndex = this.dataset.video;
    modal.style.display = "flex";
    loadVideo(videoIndex);
  })
});

if (closeModal) {
  closeModal.onclick = function () {
    modal.style.display = "none";
    stopVideo();
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    stopVideo();
  }
};

document.addEventListener('keyup', function (event) {
  if (event.keyCode == 27) {
    modal.style.display = "none";
    stopVideo();
  }
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, lastVideoId = '';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: 'auto',
    width: 'auto',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function loadVideo(id) {
  if (player && id != lastVideoId) {
    player.loadVideoById(id);
    lastVideoId = id;
  } else {
    player.playVideo();
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 1000);
    done = true;
  }
}

function stopVideo() {
  player.pauseVideo();
}

function clearResults() {
  var clearBtn = document.getElementById('clear-btn');

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document.getElementById('module-name').value = '';
      document.getElementById('no-results').style.display = "none";

      var resultsTable = document.querySelectorAll('.results-table .table');
      resultsTable.forEach(function (value) {
        value.style.display = "none";
      });
    });
  }
}

clearResults();

var safVideo = document.getElementById('js-safary-video');
var defVideo = document.getElementById('js-def-video');

if (safVideo && defVideo) {
  if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    defVideo.style.display = 'none';
    safVideo.style.display = 'block';
  } else {
    safVideo.style.display = "none";
    defVideo.style.display = 'block';
  }
}

// Highlight active header menu item
$("a").each(function() {
    if ((window.location.pathname.indexOf($(this).attr('href'))) > -1) {
        $(this).addClass('activeMenuItem');
    }
});

// Set width for Search field input
$('#search-box').keyup(function() {
    $(this).attr('size', $(this).val().length)
});

// Copy to clipboard
const copyButtonLabel = "Copy";
document.addEventListener("DOMContentLoaded", () => {
  const code_blocks = document.querySelectorAll("pre > code");
  code_blocks.forEach((code_block) => {
    if (navigator.clipboard) {
      let button = document.createElement("button");
      button.innerText = copyButtonLabel;
      button.classList.add("copy-button");
      button.addEventListener("click", async (event) => {
        const pre = event.target.parentElement;
        const code = pre.querySelector("code");
        const text = code.innerText.replace(/\s+$/g, ""); // remove trailing empty lines
        await navigator.clipboard.writeText(text);
        const original = event.target.innerText;
        event.target.innerText = "Copied";
        setTimeout(() => event.target.innerText = original, 1000);
      });
      code_block.parentElement.appendChild(button);
    }
  });
});

// Enable jQuery UI Tabs for gradle-maven-tabs
$(function () {
  $(".gradle-maven-tabs").tabs();
});

// Fix Height of Tabs (Gradle/Maven)
function adjustTabHeights() {
  // Handle both .tabs-doc and .gradle-maven-tabs groups
  const allTabGroups = [
    ...document.querySelectorAll(".tabs-doc"),
    ...document.querySelectorAll(".gradle-maven-tabs"),
    ...document.querySelectorAll(".cli-tabs")
  ];

  allTabGroups.forEach(group => {
    //Step 1: Find tab panels
    let tabPanels;
    if (group.classList.contains("tabs-doc")) {
      tabPanels = Array.from(group.querySelectorAll("div[data-value]"))
        .filter(panel => {
          const val = panel.getAttribute("data-value");
          return val !== "cli" && val !== "console";
        });
    } else {
      tabPanels = Array.from(group.querySelectorAll("div[role='tabpanel']"));
    }

    // Skip if less than 2 tabs
    if (tabPanels.length < 2) return;

    // Reset previous styles to avoid min-height accumulation
    tabPanels.forEach(panel => {
      panel.style.minHeight = '';
      panel.querySelectorAll("pre").forEach(pre => {
        pre.style.minHeight = '';
      });
    });

    // Step 2: Temporarily show all panels for measurement
    tabPanels.forEach(panel => {
      panel.dataset._originalDisplay = panel.style.display || '';
      panel.style.display = 'block';
      panel.style.visibility = 'hidden';
    });

    // Step 3: Determine max panel height
    const maxPanelHeight = Math.max(...tabPanels.map(p => p.scrollHeight));

    // Step 4: Determine max height per <pre> index
    const preGroups = [];
    const maxPreCount = Math.max(...tabPanels.map(p => p.querySelectorAll("pre").length));

    for (let i = 0; i < maxPreCount; i++) {
      let maxPreHeight = 0;
      const preAtIndex = [];

      tabPanels.forEach(panel => {
        const pre = panel.querySelectorAll("pre")[i];
        if (pre) {
          preAtIndex.push(pre);
          maxPreHeight = Math.max(maxPreHeight, pre.scrollHeight);
        }
      });

      preGroups.push({ preAtIndex, maxPreHeight });
    }

    // Step 5: Apply final heights
    tabPanels.forEach(panel => {
      panel.style.display = panel.dataset._originalDisplay || '';
      panel.style.visibility = '';
      delete panel.dataset._originalDisplay;

      panel.style.minHeight = maxPanelHeight + "px";
    });

    preGroups.forEach(({ preAtIndex, maxPreHeight }) => {
      preAtIndex.forEach(pre => {
        pre.style.minHeight = maxPreHeight + "px";
      });
    });
  });
}

// Run on page load and resize
window.addEventListener("load", adjustTabHeights);
window.addEventListener("resize", adjustTabHeights);

// JQuery UI Tabs Logic
$(function () {
  function changeTab(tabId) {
    const selectors = [
      "div[id^='tabs-doc']",
      ".gradle-maven-tabs",
      ".cli-tabs"
    ];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(container => {
        $(container).tabs("option", "active", tabId);
      });
    });
  }
  function updateBuildToolQueryParam(buildToolValue) {
    const langValue = new URLSearchParams(window.location.search).get('lang') || 'java';
    window.history.pushState("", window.location.title, `?buildTool=${buildToolValue}&lang=${langValue}`);
  }
  $(document).on('click', 'li.tabs-gradle', () => {
    changeTab(0);
    updateBuildToolQueryParam('gradle');
  });
  $(document).on('click', 'li.tabs-maven', () => {
    changeTab(1);
    updateBuildToolQueryParam('maven');
  });
  const allTabs = [
    "#tabs-doc1", "#tabs-doc2", "#tabs-doc3", "#tabs-doc4", "#tabs-doc5", "#tabs-doc6", "#tabs-doc7",
    "#tabs-doc8", "#tabs-doc9", "#tabs-doc10", "#tabs-doc11", "#tabs-doc12", "#tabs-doc13", "#tabs-doc14",
    "#tabs-doc15", "#tabs-doc16", "#tabs-doc17", "#tabs-doc18", "#tabs-doc19", "#tabs-doc20", "#tabs-doc21",
    "#tabs-doc22", "#tabs-doc23", "#tabs-doc24", "#tabs-doc25", "#tabs-doc26", "#tabs-doc27", "#tabs-doc28",
    "#tabs-doc29", "#tabs-doc30", "#tabs-doc31", "#tabs-doc32", "#tabs-doc33", "#tabs-doc34",
    ".gradle-maven-tabs", ".cli-tabs"
  ];
  $(allTabs.join(',')).tabs({
    activate: function () {
      adjustTabHeights(); // Recalculate on tab change
    }
  });
  function updateTabs() {
    const urlParam = new URLSearchParams(window.location.search);
    const tool = urlParam.get('buildTool');
    if (!!tool) {
      changeTab(tool === 'gradle' ? 0 : 1);
    }
  }

  updateTabs();
});


// TABS.DOC dynamic generator (optional structure)
$(function () {
  const allOptions = {};
  const updateBuildToolQueryParam = (optionName, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(optionName, value);
    window.history.pushState("", window.location.title, "?" + searchParams.toString());
  };
  const changeTab = (optionName, opt) => {
    Array.from(document.querySelectorAll(".tabs-doc"))
      .filter(e => e.getAttribute("data-name") === optionName)
      .forEach(e => $(e).tabs({ active: opt.i }));
    updateBuildToolQueryParam(optionName, opt.value);
  };
  const getOption = (options, value) => {
    const filtered = options.filter(opt => opt.value === value);
    return filtered.length > 0 ? filtered[0] : options[0];
  };
  document.querySelectorAll(".tabs-doc").forEach(container => {
    const optionName = container.getAttribute("data-name");
    const options = Array.from(container.children).map((elem, i) => {
      elem.id = elem.getAttribute("data-value");
      return { label: elem.getAttribute("data-label"), value: elem.getAttribute("data-value"), i };
    });
    const list = $("<ul></ul>");
    const createLink = opt => $(`<a href="#${opt.value}">${opt.label}</a>`).click(() => changeTab(optionName, opt));
    options.map(opt => $(`<li></li>`).append(createLink(opt))).forEach(link => list.append(link));
    $(container).prepend(list);
    allOptions[optionName] = options;
  });
  Object.keys(allOptions).forEach(optionName => {
    const options = allOptions[optionName];
    const urlParams = new URLSearchParams(window.location.search);
    const currentOption = getOption(options, urlParams.get(optionName));
    changeTab(optionName, currentOption);
  });
});

// Build Tool or Lang Filter Logic
$(function () {
  const filterElem = $('#buildtool-filter');
  const langFilterElem = $('#lang-filter');
  if (filterElem.length === 0 && langFilterElem.length === 0) return;
  let selectionBuildTool = 'gradle';
  let selectionLanguage = 'java';
  if (langFilterElem.length > 0) {
    langFilterElem.on('click', (event) => {
      selectionLanguage = event.target.innerHTML;
    });
  }
  if (filterElem.length > 0) {
    filterElem.on('click', (event) => {
      selectionBuildTool = event.target.innerHTML;
    });
  }

  $(document).on('click', 'a', (event) => {
    const href = event.target.getAttribute('href');
    if (['#java', '#kotlin', '#groovy', '#maven', '#gradle'].includes(href)) return;
    if (href && href.indexOf('gdk-modules') > 0) {
      event.preventDefault();
      window.open(`${event.target.href}?buildTool=${selectionBuildTool.toLowerCase()}&lang=${selectionLanguage.toLowerCase()}`, '_blank').focus();
    }
  });
});

// Lang Switch Tabs
$(function () {
  function changeLang(langId) {
    const langs = document.querySelectorAll("div[id*='lang-switch']");
    langs.forEach(lang => {
      $(`#${lang.id}`).tabs('option', 'active', langId);
    });
  }
  function updateLangQueryParam(langValue) {
    const buildToolValue = new URLSearchParams(window.location.search).get('buildTool');
    window.history.pushState("", window.location.title, `?buildTool=${buildToolValue}&lang=${langValue}`);
  }

  $(document).on('click', 'li.tabs-java', () => {
    changeLang(0);
    updateLangQueryParam('java');
  });

  $(document).on('click', 'li.tabs-kotlin', () => {
    changeLang(1);
    updateLangQueryParam('kotlin');
  });

  $(document).on('click', 'li.tabs-groovy', () => {
    changeLang(2);
    updateLangQueryParam('groovy');
  });

  $("#lang-switch1, #lang-switch2, #lang-switch3, #lang-switch4, #lang-switch5, #lang-switch6, #lang-switch7, #lang-switch8, #lang-switch9, #lang-switch10").tabs({
    activate: function () {
      adjustTabHeights();
    }
  });

  function updateTabs() {
    const urlParam = new URLSearchParams(window.location.search);
    const tool = urlParam.get('lang');
    if (!!tool) {
      let lang = 0;
      if (tool === 'kotlin') lang = 1;
      if (tool === 'groovy') lang = 2;
      changeLang(lang);
    }
  }

  updateTabs();
});