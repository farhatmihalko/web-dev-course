var stat = {
  userLength: 0
};

var getUserList = function(){
  return space.get('users');
};

var getUserNameHolder = function(){
  return $('.user-name span');
};

var run = function(name){
  getUserNameHolder().text(name);

  if(!space.get('users'))
    space.set('users', []);

  var tmp = space.get('users');
  tmp.push({
    name: name,
    time: (+ new Date())
  });

  space.set('users', tmp);

  showOtherUsers(name);
  updateUserList();
};

var renderUserNameInSpan = function(name){
  return '<div><span class="user-name-bold">' + name + '</span></div>';
};

var getUserNamesDiv = function(){
  return $('.other-users');
};

var clearOtherUsers = function(){
  getUserNamesDiv().html('');
};

var showOtherUsers = function(name){
  var users = space.get('users');

  stat.userLength = users.length;

  var div = getUserNamesDiv();
  for(var i = 0; i < users.length; i++){
    div.append(renderUserNameInSpan(users[i].name + users[i].time));
  }
};

var updateUserList = function(){
  setInterval(function(){
    console.log('Tick');
    clearOtherUsers();
    showOtherUsers();
  }, 2000);
};

var space = {
  get: function(key){
    return JSON.parse(localStorage.getItem(key));
  },

  set: function(key, val){
    var tmp = JSON.stringify(val);
    localStorage.setItem(key, tmp);
  },

  remove: function(key){
    localStorage.removeItem(key);
  },

  clear: function(){
    localStorage.clear();
  }
};

$(document).ready(function(){
  var name = prompt('Please enter your name');
  run(name);
});
