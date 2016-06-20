var form = document.getElementsByTagName('form')[0];
var blog_name = document.getElementsByName('blog_name')[0].value;
var post_title = document.getElementsByName('post_title')[0].value;

document.addEventListener('DOMContentLoaded', function(e){
  var spinner = document.getElementById('comments-loading-spinner');

  function commentsAreDown(){
    spinner.remove();
    var msg = document.getElementById('comments-loading-message');
    addClass(msg, 'ghost');
    msg.innerHTML = "comments are down";
  }

  if(blog_name.trim() == '' || post_title.trim() == ''){
    commentsAreDown();
    return;
  }

  fetchComments(blog_name, post_title,
    function(comments){
      spinner.parentElement.remove();
      unhide(document.getElementById('comment-form'));
      populateComments(comments);
      if(comments.length == 0){
        document.getElementById('comment-form').children[0].remove();
      }
    },
    commentsAreDown
  );
});

form.addEventListener('submit', function(e){
  var form = this;
  e.preventDefault();
  if(blog_name.trim() == '' || post_title.trim() == '') return;

  var data = {
    email: form.email.value,
    name: form.name.value,
    body: form.body.value,
    is_bot: form.is_bot.checked,
    blog_key: blog_name,
    post_key: post_title
  };

  var xhr = new XMLHttpRequest();
  var spinner = document.getElementById('form-spinner');
  var button = document.getElementById('submit-button');
  var container = document.getElementById('comment-form');
  var message = document.getElementById('comment-submit-message');

  if(form.is_bot.checked){
    container.innerHTML = '<p class="error">No bots.</p>';
    return;
  }

  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      hide(spinner);
      if (xhr.status == 200) {
        container.innerHTML = '<p class="success">Please check for a confirmation email.</p>';
      } else {
        unhide(message);
        message.innerHTML = 'The post failed :(';
      }
    }
  }
  xhr.open('POST', form.action);
  xhr.setRequestHeader(
    'Content-Type',
    'application/json'
  );
  xhr.send(JSON.stringify(data));

  hide(button);
  unhide(spinner);
});

function fetchComments(blog_key, post_key, cb, errorCb){
  var xhr = new XMLHttpRequest();
  if(!errorCb) errorCb = function(){ };
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      if (xhr.status == 200) cb(JSON.parse(xhr.responseText));
      else errorCb();
    }
  }
  xhr.open('GET', 'http://evanr.info/comments/'+blog_key+'/'+post_key);
  xhr.send(null);
}

function hide(elem){
  addClass(elem, 'hidden');
}

function unhide(elem){
  elem.className = elem.className.replace(/\bhidden\b/, '');
}

function addClass(elem, cl){
  elem.className = elem.className + ' ' + cl;
}

function htmlEncode(x){
  return x
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function commentElement(comment){
  var text = htmlEncode(comment.body).replace(/\n/g, '<br>');
  var raw = flat([
    '<div class="comment">',
      '<div>',
        '<div class="avatar"><img src="', htmlEncode(comment.avatar_url), '"></div>',
        '<div>',
          '<div class="name">',htmlEncode(comment.name),'</div>',
          '<div class="date">',htmlEncode(comment.formatted_date),'</div>',
        '</div>',
      '</div>',
      '<hr>',
      '<div class="body"><p>',text,'</p></div>',
    '</div>'
  ]).join('');
  var elem = document.createElement('DIV');
  elem.innerHTML = raw;
  return elem.children[0];
}

function flat(tree){
  if(typeof tree == 'string') return tree;
  else return ([]).concat.apply([], tree.map(function(x){ return flat(x); }));
}

function populateComments(comments){
  var container = document.getElementById('comments-list');
  for(var i = 0; i < comments.length; i++){
    var elem = commentElement(comments[i]);
    container.appendChild(elem);
  }
}
