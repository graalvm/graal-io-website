// ________Filters on the "hands-on-labs" page___________
$(".hol-filter-item").click(function() {
    console.log('1')
    $(this).addClass("active-filter").siblings().removeClass("active-filter");
  });

  $(document).ready(function () {
    function filterItems(moduleHolFilterValue) {
      let filterString = `.${moduleHolFilterValue}`
      if (moduleHolFilterValue !== "all"){
        filterString += `.${moduleHolFilterValue}`
      }
      $(".hol-box")
          .not(filterString)
          .hide("1000");
      $(".hol-box")
          .filter(filterString)
          .show("1000");
    }

    $(".hol-filter-item").click(function () {
        const moduleHolFilterValue = $(".hol-filter-item.module-filter.active-filter").attr("data-filter");
        filterItems(moduleHolFilterValue)
         window.history.pushState("", window.location.title, `?module=${moduleHolFilterValue}`);
    });
    function setFilters() {
      const params = new URLSearchParams(window.location.search);
      const moduleHolFilterValue =params.get('module') || 'all';

      const moduleHolFilterElement = $(`.module-filter[data-filter=${moduleHolFilterValue}]`);
      moduleHolFilterElement.addClass("active-filter").siblings().removeClass("active-filter");

      filterItems(moduleHolFilterValue);
    }
    setFilters();
  });
  // ________end of the "hands-on-labs" page___________

  // ________Filters on the "guides" page (for Get Started page filters included)___________

$(document).ready(function () {
    function filterItems(buildtoolFilterValue,moduleFilterValue,cloudFilterValue) {
      let filterString = `.${buildtoolFilterValue}`
      if (cloudFilterValue !== "all"){
        filterString += `.${cloudFilterValue}`
      }
      if (moduleFilterValue !== "all"){
        filterString += `.${moduleFilterValue}`
      }
      $(".guides-box")
          .not(filterString)
          .hide("1000");
      $(".guides-box")
          .filter(filterString)
          .show("1000");
    }

    function setFilters() {
      const params = new URLSearchParams(window.location.search);
      const moduleFilterValue =params.get('module') || 'all';
      const cloudFilterValue =params.get('cloud') || 'oci';
      const buildtoolFilterValue = params.get('buildTool') || 'gradle';

      const cloudFilterElement = $(`.cloud-filter[data-filter=${cloudFilterValue}]`);
      cloudFilterElement.each(function(){
        $(this).addClass("active-filter").siblings().removeClass("active-filter");
      });

      const buildtoolFilterElement = $(`.buildtool-filter[data-filter=${buildtoolFilterValue}]`);
      buildtoolFilterElement.each(function(){
        $(this).addClass("active-filter").siblings().removeClass("active-filter");
      });

      const moduleFilterElement = $(`.module-filter[data-filter=${moduleFilterValue}]`);
      moduleFilterElement.each(function(){
        $(this).addClass("active-filter").siblings().removeClass("active-filter");
      });

      filterItems(buildtoolFilterValue,moduleFilterValue,cloudFilterValue);
    }

  function onChangeFilter(){
    const moduleFilterValue = $(".filter-item.module-filter.active-filter").attr("data-filter");
    const cloudFilterValue = $(".filter-item.cloud-filter.active-filter").attr("data-filter");
    const buildtoolFilterValue = $(".filter-item.buildtool-filter.active-filter").attr("data-filter");
    filterItems(buildtoolFilterValue,moduleFilterValue,cloudFilterValue)
     const langValue = new URLSearchParams(window.location.search).get('lang') || 'java';
  let queryString = '?';
  if(buildtoolFilterValue){
    queryString+=`buildTool=${buildtoolFilterValue}&`
  }
  if(moduleFilterValue){
    queryString+=`module=${moduleFilterValue}&`
  }
  if(cloudFilterValue){
    queryString+=`cloud=${cloudFilterValue}&`
  }
  if(langValue){
    queryString+=`lang=${langValue}&`
  }
     window.history.pushState("", window.location.title, queryString);
  setFilters();
  }
  $(".filter-item").click(function() {
    const filter = $(this).attr("data-filter")
    $('.'+this.className.split(' ').join('.')+`[data-filter=${filter}]`).each(function(){
      console.log(this);
      $(this).addClass("active-filter").siblings().removeClass("active-filter");
    });
    onChangeFilter();
  });

    setFilters();
  });
  // ________end of the "guides" page___________
