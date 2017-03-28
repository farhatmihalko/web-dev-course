var uploadItem = function(canvas, item){
  var cnt = canvas.getContext('2d');
  var parent = $(canvas).parent();
  var fileReader = new FileReader();

  fileReader.onload = function(e){
    var img = new Image();
    img.src = e.target.result;
    img.onload = function(){
      var left = (parseInt(parent.css('width'))-img.width)/2;
      var top  = (parseInt(parent.css('height'))  -img.height)/2;
      top < 0 ? top = 0: top = top;
      left < 0 ? left = 0 : left = left;
      // $(canvas).css({
      //   marginLeft : left,
      //   marginTop  : top
      // });
      canvas.width  = img.width;
      canvas.height = img.height;
      cnt.drawImage(img, 0, 0, img.width, img.height);
    };
  };

  fileReader.readAsDataURL(item);
};

var filters = {
  inverse: function(imgData){
    var sp = imgData;
    var ll = function(vl){
      return 255 - vl;
    };
    for(var i = 0; i < imgData.length; i+=4){
      sp[i] = ll(sp[i]);
      sp[i+1] = ll(sp[i+1]);
      sp[i+2] = ll(sp[i+2]);
    }
    return sp;
  },

  noise: function(imgData){
    var sp = imgData;
    var coefficient = 0.02;
    var ll = function(vl){
      var g_VALUE = Math.random()*100;
      if(g_VALUE <= coefficient*100){
        if(Math.floor(Math.random()*25) == 2)
          return 255;
        else
          return vl;
      }
      return vl;
    };

    for(var i = 0; i < imgData.length; i+=4){
      sp[i] = ll(sp[i]);
      sp[i+1] = ll(sp[i+1]);
      sp[i+2] = ll(sp[i+2]);
    }
    return sp;
  },

  treshold: function(imgData){
    var sp = imgData;
    var ll = function(vl){
    	return vl>128?0:255;
    };
    for(var i = 0; i < imgData.length; i+=4){
      var mean = (sp[i] + sp[i+1] + sp[i+2])/3;
      sp[i] = ll(mean);
      sp[i+1] = ll(mean);
      sp[i+2] = ll(mean);
    }
    return sp;
  }
};

var draw = function(canvas, imgData){
  var cont = canvas.getContext('2d');
  var currImgData = cont.getImageData(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < currImgData.data.length; i += 4){
    currImgData.data[i]   = imgData[i];
    currImgData.data[i+1] = imgData[i+1];
    currImgData.data[i+2] = imgData[i+2];
  }
  cont.putImageData(currImgData, 0, 0);
};

var process = function(filterCallback, canvas){
  var imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  var tmp = filterCallback(imgData.data);
  draw(canvas, tmp);
};

var run = function(canvas){
  $('.dropzone').on('dragleave', function(e){
    $(this).removeClass('dragging');
    return false;
  })
  .on('drop', function(e){
    $(this).addClass('dropped');

    var originalEvent = e.originalEvent;
    var dataTransfer  = originalEvent.dataTransfer;
    var files = dataTransfer.files || [];

    // for(var i = 0; i < files.length; i++)
    //   uploadItem(canvas, files[i]);

    uploadItem(canvas, files[0]);

    return false;
  })
  .on('dragover', function(e){
    $(this).addClass('dragging');
    return false;
  });

  var isDrawing = false;
  var oldX = null,
    oldY = null;

  var drawPoint = function(x, y){
    // How we get context?
    var context = $('canvas')[0].getContext('2d');
    context.lineJoin = "round";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(oldX || x, oldY || y);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();

    oldX = x;
    oldY = y;
  };

  canvas.height = 200;
  canvas.width = 300;

  $(canvas).on('mousedown', function(e){
    isDrawing = true;
    drawPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  }).on('mouseup', function(e){
    isDrawing = false;
    drawPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    oldX = null;
    oldY = null;
  }).on('mousemove', function(e){
    if(isDrawing){
      drawPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    }
  });
};

$(document).ready(function(){
  var canvas = $('#canvas');
  run(canvas[0]);

  // Когда пользователь нажимает на кнопку
  $('.js-button-action').click(function(){
    var filter = $(this).data('filter');
    process(filters[filter], $('#canvas')[0]);
  });
});
