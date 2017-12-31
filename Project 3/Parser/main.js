//From https://github.com/EvanHahn/ScriptInclude
include = function()
{
  function f()
  {
    var a = this.readyState;
    (!a || /ded|te/.test(a)) && (c--, !c && e && d())
  }

  var a = arguments,
    b = document,
    c = a.length,
    d = a[c - 1],
    e = d.call;
  e && c--;

  for (var g, h = 0; c > h; h++)
    g = b.createElement("script"),
    g.src = arguments[h],
    g.async = !0,
    g.onload = g.onerror = g.onreadystatechange = f,
    (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};

serialInclude = function(a)
{
  var b = console,
      c = serialInclude.l;

  if (a.length > 0)
    c.splice(0, 0, a);
  else
    b.log("Done!");

  if (c.length > 0)
  {
    if (c[0].length > 1)
    {
      var d = c[0].splice(0, 1);

      b.log("Loading " + d + "...");

      include(d, function() {
        serialInclude([]);
      });
    }
    else
    {
      var e = c[0][0];

      c.splice(0, 1);

      e.call();
    };
  }
  else
    b.log("Finished.");
};

serialInclude.l = new Array();

function getUrlVars()
{
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function(m,key,value) {
    vars[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js',
        'MyGraphNode.js', 'MyGraphLeaf.js', 'MyInterface.js',
        '../Leafs/Triangle.js', '../Leafs/Rectangle.js', '../Leafs/Tube.js',
        '../Leafs/Sphere.js', '../Leafs/Cylinder.js', '../Leafs/Circle.js',
        '../Leafs/Patch.js', '../Animations/Animation.js',
        '../Animations/LinearAnimation.js', '../Animations/CircularAnimation.js',
        '../Animations/BezierAnimation.js', '../Animations/ComboAnimation.js',
        '../GameLogic/gamelogic.js', '../GameLogic/CameraTransition.js',
        '../GameLogic/userPlay.js',

main=function()
{
  // Standard application, scene and interface setup
  var app = new CGFapplication(document.body);
  var myInterface = new MyInterface();
  var myScene = new XMLscene(myInterface);

  myScene.setUpdatePeriod(42);

  app.init();

  app.setScene(myScene);
  app.setInterface(myInterface);

  myInterface.setActiveCamera(myScene.camera);

  // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
  // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

  var filename;

  if(localStorage.getItem('background') == 1){
    filename = getUrlVars()['file'] || "GameBoard.xml"
  }
  else{
      filename = getUrlVars()['file'] || "Bar.xml"
  }

  console.log(localStorage.background);

  localStorage.removeItem('background');

  // create and load graph, and associate it to scene.
  // Check console for loading errors
  var myGraph = new MySceneGraph(filename, myScene);

  // start
  app.run();

  runClock(myScene);
}

]);


function runClock(scene){
    
    this.scene = scene;
    
    let timer = document.getElementById('timer');
    let player1score = document.getElementById('player-1-score');
    let player2score = document.getElementById('player-2-score');

    timer.innerHTML = '0 : 00';

    let counter = 0;
    let seconds = 0;
    let minutes = 0;

    function timeAlert()
    {
      counter++;

      seconds = Math.floor(counter % 60);

      minutes = Math.floor(counter / 60);

      if(seconds < 10)
        timer.innerHTML = minutes + ' : 0' + seconds;
      else
         timer.innerHTML = minutes + ' : ' + seconds;

       player1score.innerHTML = this.scene.game.gameMatrix[22].length;
       player2score.innerHTML = this.scene.game.gameMatrix[23].length;
    }

    setInterval(timeAlert, 1000);
}
