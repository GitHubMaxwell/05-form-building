'use strict';

let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function () {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function (e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function (e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') { //if the text that in the a tag has this
      $(this).parent().find('*').fadeIn(); //fadein the ALL the parent content of this specific a tag
      $(this).html('Show Less &larr;'); //and then change the a tag text of the clicked a tag to show less
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      }, 200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// DONE/COMMENT: Where is this function called? Why?
// this function is called in the new.html page because
articleView.initNewArticlePage = () => {

  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  //the name of this page infers do something to setup the enviornment/ console log to see where its shows up to see if its being called / copy paste the function name in toehr JS files to see if its there / its neve rbeing asked to run / where should we put it bottom of new page html in the script tags/
  $('.tab-content').show(); //tab navigation

  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#article-json').on('focus', function () {
    $(this).select();

    //we need to use the jQuery "this" $('this') to select SPECIFICALLY what element the event happens on inside the form field
  });

  // DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-article').on('change', 'input, textarea', articleView.create);

  //added id to form because just targeting form opens this function up to EVERY form event even if its not on this page like the index page
};

articleView.create = () => {
  // DONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  //we dont want to remove the ENTIRE section ('#articles') we want to remove whats INSIDE/CHILDREN the section / .REMOVE() versus .EMPTY() methods
  $('#articles > *').remove(); //removes ALL direct children of the #articles

  // DONE: Instantiate an article based on what's in the form fields:

  // let article = {};
  // article.title = $('#title').val();
  // article.category = $('#category').val();
  // article.author = $('#author').val();
  // article.authorUrl = $('#authorUrl').val();
  // article.publishedOn = $('#publishedOn').val();
  // article.body = $('#body').val();
  let date = new Date();
  let newDate = date.toLocaleDateString();
  //object literal form
  let article = {
    title: $('#title').val(),
    category: $('#category').val(),
    author: $('#author').val(),
    authorUrl: $('#authorUrl').val(),
    publishedOn: newDate,
    body: $('#body').val(),
  };
  //as we type in the form the article object adds the new data in / but we have to clear it so that you can make and edit the single article thats in the preview in real time / everytime we leave the form fields
  //use that object to make a new article

  let newArticle = new Article(article);
  //have to do this because it gives the new object to the toHtml method in article.js to handlebars in order to render it up on the page

  // DONE: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').append(newArticle.toHtml());


  // TODO: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each();

  // DONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:

  $('#article-json').val(JSON.stringify(article));
  // what value should we assign / that newly created article's data needs to be put
  // if you see object object that you didnt JSON stringify
  //json beautifier.com paste output to it and it will change it over

};

// DONE/COMMENT: Where is this function called? Why?
// this function is called in the index.html page in order to trigger all these functions BUT not the initNewArticlePage() function
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml())); // problem here?
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};