//var color_black = "[color=#000000]";
var color_black = "[color=#404040]";
var close_tag = "[/color]"

var l_bracket = color_black + "[" + close_tag;
var r_bracket = color_black + "]" + close_tag;

var color_tag;
var context_tag;
var handle;
var acro;
var user;
var context_acro;
var context_handle;
var user2;

var p;

var current = 'ONLINE';
var keyverb = 'pester'
var mood = '';

var fileform = '';
var filelink = '';
var filedesc = '';

var statuses = {
  "ONLINE":  msg_online,
  "OFFLINE": msg_offline,
  "IDLE": msg_idle,
  "UNIDLE": msg_offidle,
  "START MSG": msg_start,
  "END MSG": msg_end,
  "SET MOOD": set_mood,
  "MSG REQUEST": msg_request,
  "MSG ACCEPT" : msg_accept,
  "BLOCK" : msg_block,
  "UNBLOCK": msg_unblock,
  "SHARE FILE" : msg_file,
  "DEVICE EXPLODED": msg_explode,
  "MEMO INVITE": msg_invite,
  "MEMO JOIN": msg_join,
  "CHANGE HANDLE": msg_change,
  "CUSTOM": msg_custom
};

var moods = ["CHUMMY", "CHIPPER", "PALSY", "BULLY", "PEPPY", "RANCOROUS", "MYSTIFIED",
"AMAZED", "INSOLENT", "BEMUSED", "PRANKY", "SMOOTH", "PLEASANT", "DISTRAUGHT", "ECSTATIC",
"RELAXED", "DISCONTENT", "DEVIOUS", "SLEEK", "DETESTFUL", "MIRTHFUL", "MANIPULATIVE",
"VIGOROUS", "PERKY", "ACCEPTANT"];


var st_opt = document.getElementById("status-opt");
var ks_opt = document.getElementById("ks-opt");
var mood_opt = document.getElementById("mood-opt");
var file_opt = document.getElementById("file-opt");

//assembles reusable message components
function msg_comp(config, context)
{
  st_opt.style.display = "none";
  ks_opt.style.display = "none";
  mood_opt.style.display = "none";
  file_opt.style.display = "none";

  color_tag = "[color=#" + config.hex + "]";
  context_tag = "[color=#" + context.hex + "]";
  handle = color_tag + config.handle + close_tag;
  context_handle = context_tag + context.sc + close_tag;
  acro = color_tag + config.acronym + close_tag;
  context_acro = context_tag + context.tag + close_tag;
  user = handle + " " + l_bracket + acro + r_bracket;
  user2 = context_handle + " " + l_bracket + context_acro + r_bracket;
}

function list_status(parser){

  p = parser;

  var lib = document.getElementById("status-lib");
  var prev = document.getElementById("status-prev");
  var code = document.getElementById("status-code");


  var ks1 = document.getElementById("keyverb-sel");
  var ks2 = document.getElementById("keyverb-input");

  var m1 = document.getElementById("mood-sel");
  var m2 = document.getElementById("mood-input");

  var f1 = document.getElementById("fileform-input");
  var f2 = document.getElementById("filelink-input");
  var f3 = document.getElementById("filedesc-input");


  let keyverbs = ['pester', 'troll', 'jeer', 'cheer'];

  for (var s in keyverbs) {
    var m = keyverbs[s]+'ing';
    var n = keyverbs[s];
    ks1.options[ks1.options.length] = new Option(m, n);
  }
  ks1.value = 'pester';

  ks1.onchange = function update(){
    keyverb = ks1.value;
    refresh();
  }

  ks2.oninput = function update(){
    keyverb = ks2.value;
    refresh();
  }

  for (var m in moods) {
    m1.options[m1.options.length] = new Option(moods[m], moods[m]);
  }

  m1.onchange = function update(){
    mood = m1.value;
    refresh();
  }

  m2.oninput = function update(){
    mood = m2.value;
    refresh();
  }

  f1.oninput = function update(){
    fileform = f1.value;
    refresh();
  }

  f2.oninput = function update(){
    filelink = f2.value;
    refresh();
  }

  f3.oninput = function update(){
    filedesc = f3.value;
    refresh();
  }


  for (var x in statuses) {
   var preset = document.createElement("DIV");
   preset.classList.add('library-item');
   preset.innerHTML = x;
   preset.onclick = function nav(){
      //display status
      current = this.innerHTML;
      var text = statuses[this.innerHTML].call();
      prev.innerHTML = text[1];
      code.innerHTML = text[0];

   }

   lib.appendChild(preset);

  }
  refresh();

  var cp = document.getElementById("copy-status");
  cp.onclick = function copy_output(){
    copy_stat();
  }
}

function refresh(){
  var prev = document.getElementById("status-prev");
  var code = document.getElementById("status-code");
  var text = statuses[current].call();
  prev.innerHTML = text[1];
  code.innerHTML = text[0];
}

// -- x [XX] is now online! --
function msg_online(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now online! --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now online! --`;

  return res;
}

// -- x [XX] is now offline! --
function msg_offline(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now offline! --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now offline! --`;

  return res;
}

// -- x [XX] is now idle! --
function msg_idle(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now idle! --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now idle! --`;

  return res;
}

// -- x [XX] is no longer idle! --
function msg_offidle(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is no longer idle! --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is no longer idle! --`;

  return res;
}




// -- x [XX] began pestering y [YY] --
function msg_start(){
  msg_comp(p.config, p.context);
  ks_opt.style.display = "block";
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black +
  " began " + keyverb + "ing " + close_tag + user2 +
  color_black + "  --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] \
  began ${keyverb}ing ${p.context.sc} [${p.context.tag}] --`;

  return res;
}


// -- x [XX] ceased pestering y [YY] --
function msg_end(config, context){
  msg_comp(p.config, p.context);
  ks_opt.style.display = "block";
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black +
  " ceased " + keyverb + "ing " + close_tag + user2 +
  color_black + "  --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] \
  ceased ${keyverb}ing ${p.context.sc} [${p.context.tag}] --`;

  return res;
}


// -- x [XX] set their mood to: "???" --
function set_mood(config, context){
  msg_comp(p.config, p.context);
  mood_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " set their mood to " + mood + " --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] set their mood to ${mood} --`;

  return res;
}

// -- x [XX] REQUESTED to pester y [YY] --
function msg_request(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  ks_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " REQUESTED to " + keyverb + " " + user2 + " --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] REQUESTED to ${keyverb} ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] ACCEPTED y [YY]'s request --
function msg_accept(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " accepted " + user2 + "'s request --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] ACCEPTED ${p.context.sc} [${p.context.tag}]'s request --`;

  return res;
}

// -- x [XX] blocked y [YY] --
function msg_block(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " blocked " + user2 + " --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] blocked ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] unblocked y [YY]! --
function msg_unblock(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " unblocked " + user2 + " --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] unblocked ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] shared a file: "???" --
function msg_file(config, context){
  msg_comp(p.config, p.context);
  file_opt.style.display = "block";
  var res = [];
  var fileset = '';
  var paradesc = '';

  if (filelink != '')
    fileset = '[url=' + filelink + ']' + fileform + '[/url]';
  else fileset = fileform;

  if(filedesc != '')
    paradesc = '[br]  [br]' + color_tag + '>' + close_tag + " " + color_black  + filedesc + close_tag;


  res[0] = color_black + "-- " + close_tag + user + color_black + " shared a file: "
  + fileset + "! --" + close_tag + paradesc;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];



  res[1] = `-- ${p.config.handle} [${p.config.acronym}] shared a file: ${fileform} --`

  if (filedesc != '')
    res[1] = res[1] + `<br><br>> ${filedesc}`;


  return res;
}

//-- x [XX]'s device exploded! --
function msg_explode(config, context){
  msg_comp(p.config, p.context);
  //file_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + "'s device exploded! --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}]'s device exploded! --`

  return res;
}

//-- x [XX] invited y [yy] to board: ???
function msg_invite(config, context){
  msg_comp(p.config, p.context);
  //file_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " invited " + user2 + " to board: ??? --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] invited ${p.context.sc} [${p.context.tag}] to board: ??? --`;

  return res;
}

//-- x [XX] responded to memo on board: ??? --
//-- x [XX] responded to memo RIGHT NOW --
//-- x [XX] responded to memo ?? HOURS AGO --
function msg_join(config, context){
  msg_comp(p.config, p.context);
  //file_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " responded to memo RIGHT NOW --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] responded to memo RIGHT NOW --`;

  return res;
}

// -- x [XX] is now y [yy] --
function msg_change(config, context){
  msg_comp(p.config, p.context);
  //file_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " is now " + user2 + " --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] ???? --
// -- x [XX] ??? y [yy] --
function msg_custom(config, context){
  msg_comp(p.config, p.context);
  //file_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " ??? --" + close_tag;

  if(p.context.com != "")
  res[0] = p.context.com + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] ??? --`;

  return res;
}


function copy_stat() {
  var copyText = document.getElementById('status-code');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}
