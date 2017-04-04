var run = function(){
  var link = Marionette.View.extend({
    tagName: 'li',
    template: _.template("<a href='<%-path%>'><%-path%> <span>x</span></a>"),

    ui: {
      remove: 'span'
    },

    events: {
      'click @ui.remove': 'remove'
    },

    remove: function(){
      console.log('I was clicked')
      return false;
    }
  });

  var messageView = Marionette.View.extend({
    tagName: 'div',
    template: '#message-view',
    ui: {
      remove: '.remove'
    },
    events: {
      'click @ui.remove': function(){
        console.log('I was clicked');
      }
    }
  });

  var messages = Marionette.CollectionView.extend({
    tagName: 'div',
    childView: messageView
  });

  var messagesData = new Backbone.Collection([
    { message: 'Hi farhat' },
    { message: 'Hi timur' }
  ]);

  var dialogs = Marionette.View.extend({
    template: '#dialog',
    regions: {
      messages: '.messages'
    },
    ui: {
      input: 'input[type="text"]',
      submit: 'button'
    },
    events: {
      'click @ui.submit': function(){
        var text = this.ui.input.val();

        this.getChildView('messages')
          .collection
          .push({ message: text });
        this.ui.input.val('');
      }
    },
    onRender: function(){
      this.showChildView('messages', new messages({
        collection: messagesData
      }));
    }
  });


  (new dialogs({
    // collection: messagesData,
     el: '.messages-container'
  })).render();

  var listView = Marionette.CollectionView.extend({
    tagName: 'ul',
    childView: link
  });

  // var container = Backbone.Collection.extend({});

  // var list = new Backbone.Collection([
  //   {path: 'http://google.com'},
  //   {path: 'http://mojotech.com'}
  // ]);

  // (new listView({
  //   collection: list,
  //   el: '.link-area'
  // })).render();
};

var l = function(){
  var view = Marionette.View.extend({
    template: '#message',

    ui: {
      remove: 'button'
    },

    events: {
    }
  });

  var container = Marionette.CollectionView.extend({
    childView: view,
    tagName: 'div'
  });

  var dic = new Backbone.Collection([
    { message: 'The first message' },
    { message: 'The second message' }
  ]);

  window.dic = dic;

  $('.sender button').on('click', function(){
    var text = $('.sender input').val();
    if(text){
      dic.push({
        message: text
      });
      $('.sender input').val('');
    }
  });

  (new container({
    el: '.test-container',
    collection: dic
  })).render();

  // (new view({
  //   el: '.test-container'
  // })).render();
};

$(document).ready(function(){
  // run();
  l();
});
