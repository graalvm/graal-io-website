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
    // console.log('Copying text command was ' + msg);
  } catch (err) {
    // console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}

function fiddleSnippet(elem, fileName) {
  elem.onclick = null; // do not call this function on the same elem again
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

        // window.addEventListener("keydown", function(e) {
        //   if (e.keyCode == 32 && e.target == document.body) {
        //     // $(terminalId).keydown()[0].focus();
        //     // e.preventDefault();
        //   }
        // });
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

  //Slick slider init
    (function () {
      $('.video-carousel').slick({
        dots: true,
        accessibility: true,
        responsive: [
          {
            breakpoint: 900,
            settings: {
              arrows: false,
              adaptiveHeight: true
            }
          }
        ],
        customPaging: function(slider, i) {
          var thumb = $(slider.$slides[i]).data('thumb');
          return '<a><img src="' + thumb + '"></a>';
        }
      });
    }());

// function setActive(lang) {
//   $(lang).toggleClass('active');
// }

// $(".card #lang").click(function(){
//   var element = $(this).parent(".card");
//   element.removeClass("logo text-center").addClass("logo text-center active");
// });

// $('#lang').on('click', function(e){
//     $(this).parent()
//     .toggleClass('logo text-center')
//     .toggleClass('logo text-center active');
//
// });

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
      // $(this).toggleClass("title-faq--opened");
      // $(this).nextUntil("h3").slideToggle();
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

  // (function() {
  //   var video = $("#js-video");
  //   video.width(450);
  //   video.height(450);
  //   var largeScreenRes = 1600;
  //
  //   $(window).on('resize', function() {
  //     var windowWidth = $(window).innerWidth();
  //     if (windowWidth >= largeScreenRes) {
  //       video.width(650);
  //       video.height(650);
  //       console.log(windowWidth);
  //     } else {
  //       video.width(450);
  //       video.height(450);
  //     }
  //   });
  // })();


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


// if (window.location.href.toString().split(window.location.host)[1] === '/docs/faq/') {
//   var content = document.getElementById('content-wrapper');
//   var allID = content.querySelectorAll('*[id]:not([id="graalvm---run-any-language-anywhere"])');
//   var header = content.querySelector('[id]');
//
//   var nextUntil = function (elem, selector) {
//     var siblings = [];
//     elem = elem.nextElementSibling;
//     while (elem) {
//       if (elem.matches(selector)) break;
//       siblings.push(elem);
//       elem = elem.nextElementSibling;
//     }
//
//     return siblings;
//
//   };
//
//   function wrap(el, wrapper) {
//     el.parentNode.insertBefore(wrapper, el);
//     wrapper.appendChild(el);
//   }
//
//   allID.forEach(function(item, value) {
//     item.classList.add('title-faq');
//     item.nextElementSibling.style.display = 'none';
//
//     item.addEventListener('click', function () {
//       this.classList.toggle('title-faq--opened');
//       this.nextElementSibling.classList.toggle('visible');
//     })
//   });
// }

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

// Search Feature

// III. Display the results
(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var result = results[i];
        var item = store[result.ref];

        var li = document.createElement("li");
        var link = document.createElement("a");
        var linkTitle = document.createElement("h3");
        var linkText = document.createElement("p");

        link.href = item.url;
        linkTitle.textContent = item.title;
        linkText.textContent = item.content.substring(0, 150);

        linkTitle.dataset.field = 'title';
        linkText.dataset.field = 'content';

        // Append an ellipsis if the link text needed to be truncated.
        if (item.content.length > 150) {
          linkText.insertAdjacentHTML('beforeend', '&hellip;');
        }

        link.appendChild(linkTitle);
        li.appendChild(link);
        li.appendChild(linkText);

        Object.keys(result.matchData.metadata).forEach(function (term) {
          Object.keys(result.matchData.metadata[term]).forEach(function (fieldName) {
            var field = li.querySelector('[data-field=' + fieldName + ']'),
                positions = result.matchData.metadata[term][fieldName].position

            wrapper(field, positions)
          })
        })

        searchResults.appendChild(li);
      }
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

 // I. Get the search term
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  // II. Perform the search
  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    var synonyms = new Map([
      // Synonyms for GraalVM JavaScript related terms.
      ['js', ['javascript']],
      ['javascript', ['js']],

      // Synonyms for TruffleRuby related terms.
      ['ruby', ['truffleruby']],
      ['truffleruby', ['ruby']],

      // Synonyms for FastR related terms.
      ['r', ['fastr']],
      ['fastr', ['r']],

      // Synonyms for Sulong related terms.
      ['llvm', ['sulong']],
      ['sulong', ['llvm']]
    ]);

    var normalizeGraalNames = function (builder) {

      // Match common terms to Graal-specific equivalents.
      var synonymMapper = function (token) {
        var toUpdate = synonyms.get(token.toString());

        if (toUpdate) {
          var mappedSynonyms = toUpdate.map(function(str) {
            return token.clone(function() { return str });
          });

          mappedSynonyms.push(token); // A token should always match against its original value, too.

          return mappedSynonyms;
        }

        return token;
      }

      // Register the pipeline function so the index can be serialized.
      lunr.Pipeline.registerFunction(synonymMapper, 'normalizeGraalNames')

      // Add the pipeline function to the indexing pipeline.
      builder.pipeline.before(lunr.stemmer, synonymMapper)
    };

    // Initalize lunr with the fields it will be searching on.
    // Boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 10 });
          this.field('content');
          this.use(normalizeGraalNames);
          this.metadataWhitelist = ['position'];
          for (var key in window.store) {
              this.add({
                  'id': key,
                  'title': window.store[key].title,
                  'content': window.store[key].content
              });
          }
      });

      if (searchTerm.toLowerCase() == "ruby") {
        searchTerm += " truffleruby";
      }

    var results = idx.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, window.store);
  }
})();

// IV. Highlight matching words
/**
 * Represents the location of a match within a
 * larger string. Extracted from a lunr.Index~Result.
 *
 * @typedef {number[]} MatchLocation
 * @property {number} 0 - Starting index of the match
 * @property {number} 1 - Length of the match
 */

/**
 * Highlights text within a dom element.
 *
 * Specifically this is designed to work with the output
 * positions of terms returned from a lunr search.
 */
 // @param {HTMLElement} element - the element that contains text to highlight.
 // @param {MatchLocation[]} matches - the list of matches to highlight.
function wrapper(element, matches) {

  var nodeFilter = {
    acceptNode: function (node) {
      if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
        return NodeFilter.FILTER_SKIP
      }
      return NodeFilter.FILTER_ACCEPT
    }
  }

  var index = 0,
      matches = matches.sort(function (a, b) { return a[0] - b[0] }).slice(),
      previousMatch = [-1, -1]
      match = matches.shift(),
      walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        nodeFilter,
        false
      )

  while (node = walker.nextNode()) {
    if (match == undefined) break
    if (match[0] == previousMatch[0]) continue

    var text = node.textContent,
        nodeEndIndex = index + node.length;

    if (match[0] < nodeEndIndex) {
      var range = document.createRange(),
          tag = document.createElement('mark'),
          rangeStart = match[0] - index,
          rangeEnd = rangeStart + match[1];

      tag.dataset.rangeStart = rangeStart
      tag.dataset.rangeEnd = rangeEnd

      range.setStart(node, rangeStart)
      range.setEnd(node, rangeEnd)
      range.surroundContents(tag)

      index = match[0] + match[1]

      // The next node will now actually be the text we just wrapped, so
      // we need to skip it
      walker.nextNode()
      previousMatch = match
      match = matches.shift()
    } else {
      index = nodeEndIndex
    }
  }
}

//Highlight active header menu item
$("a").each(function() {
    if ((window.location.pathname.indexOf($(this).attr('href'))) > -1) {
        $(this).addClass('activeMenuItem');
    }
});

// Set width for Search field input
$('#search-box').keyup(function() {
    $(this).attr('size', $(this).val().length)
});

//Copy to clipboard button
const copyButtonLabel = "Copy";

// select code blocks in pre blocks
let code_blocks = document.querySelectorAll("pre > code");

code_blocks.forEach((code_block) => {
  // only add a button if browser supports Clipboard API
  if (navigator.clipboard) {
    let button = document.createElement("button");
    button.innerText = copyButtonLabel;
    button.addEventListener("click", copyCode);
    code_block.parentElement.appendChild(button);
  }
});

async function copyCode(event) {
  const button = event.srcElement;
  const pre = button.parentElement;
  let code = pre.querySelector("code");
  let text = code.innerText;
  await navigator.clipboard.writeText(text);

  button.innerText = "Copied";

  setTimeout(()=> {
  button.innerText = copyButtonLabel;
  },1000)
}

// jQuery Tabs Widget
// Toggling between Maven/Gradle
$(function() {
  function changeTab(tabId) {
    const elems = document.querySelectorAll("div[id*='tabs-doc']");
    elems.forEach(elem => {
      $(`#${elem.id}`).tabs('option', 'active', tabId);
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

  $("#tabs-doc1, #tabs-doc2, #tabs-doc3, #tabs-doc4, #tabs-doc5, #tabs-doc6, #tabs-doc7, #tabs-doc7, #tabs-doc8, #tabs-doc9, #tabs-doc10, #tabs-doc11, #tabs-doc12, #tabs-doc13, #tabs-doc14, #tabs-doc15, #tabs-doc16, #tabs-doc17, #tabs-doc18, #tabs-doc19, #tabs-doc20, #tabs-doc21, #tabs-doc22, #tabs-doc23, #tabs-doc24, #tabs-doc25, #tabs-doc26, #tabs-doc27, #tabs-doc28, #tabs-doc29, #tabs-doc30, #tabs-doc31, #tabs-doc32, #tabs-doc33, #tabs-doc34").tabs();

  function updateTabs() {
    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    const tool = urlParam.get('buildTool');
    if (!!tool) {
      changeTab(tool === 'gradle' ? 0 : 1);
    }
  }
  updateTabs();
});

$(function() {
  const allOptions = {};

  const updateBuildToolQueryParam = (optionName, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(optionName, value)
    window.history.pushState("", window.location.title, "?" + searchParams.toString());
  }

  const changeTab = (optionName, opt) => {
    Array.from(document.querySelectorAll(".tabs-doc"))
        .filter(e => e.getAttribute("data-name") === optionName)
        .forEach(e => $(e).tabs({ active: opt.i }));
    updateBuildToolQueryParam(optionName, opt.value);
  }

  const getOption = (options, value) => {
    const filtered = options.filter(opt => opt.value === value);
    return filtered.length > 0 ? filtered[0] : options[0];
  }

  document.querySelectorAll(".tabs-doc").forEach(container => {
    const optionName = container.getAttribute("data-name");
    const options = Array.from(container.children).map((elem, i) => {
      elem.id = elem.getAttribute("data-value");
      return {label: elem.getAttribute("data-label"), value: elem.getAttribute("data-value"), i};
    });

    const list = $("<ul></ul>");
    const createLink = opt => $(`<a href="#${opt.value}">${opt.label}</a>`).click(() => changeTab(optionName, opt));
    const links = options.map(opt => $(`<li></li>`).append(createLink(opt)))
        .forEach(link => list.append(link));
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

// Build Tool Filter and Language Tool Filter for all Guides
$(function() {
  const filterElem = $('#buildtool-filter');
  const langFilterElem = $('#lang-filter');

  if (filterElem === undefined && langFilterElem == undefined) {
    return;
  }

  var selectionBuildTool = 'gradle';
  var selectionLanguage = 'java';

  if (langFilterElem === undefined) {
    return;
  }

  $(langFilterElem).on('click', (event) => {
    selectionLanguage = event.target.innerHTML;
  });

  $(filterElem).on('click', (event) => {
    selectionBuildTool = event.target.innerHTML;
  });

  $(document).on('click', 'a', (event) => {
    const elemHref = event.target.getAttribute('href');
    if (elemHref === '#java' || elemHref === '#kotlin' || elemHref === '#groovy' ||
      elemHref === '#maven' || elemHref === '#gradle') {
      return;
    }
    if (elemHref.indexOf('gdk-modules') > 0) {
      event.preventDefault();
      window.open(`${event.target.href}?buildTool=${selectionBuildTool.toLowerCase()}&lang=${selectionLanguage.toLowerCase()}`, '_blank').focus();
    }
  });
});

// Toggling between Java/Kotlin/Groovy
$(function() {
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

  $("#lang-switch1, #lang-switch2, #lang-switch3, #lang-switch4, #lang-switch5, #lang-switch6, #lang-switch7, #lang-switch8, #lang-switch9, #lang-switch10").tabs();

  function updateTabs() {
    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    const tool = urlParam.get('lang');
    console.log(tool);
    if (!!tool) {
      let lang=0;
      if(tool==='kotlin'){
        lang=1;
      }
      if(tool==='groovy'){
        lang=2;
      }
      changeLang(lang);
    }
  }
  updateTabs();
});