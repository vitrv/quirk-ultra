var system_color = '404040';
var color_tag;
var context_tag;

var color_black;
var close_tag;
var l_bracket;
var r_bracket;
var mem_tag;

var handle;
var acro;
var user;
var context_acro;
var context_handle;
var user2;

var statcom = '';

var p;

var current = 'ONLINE';
var keyverb = 'pester'
var mood = '';

var fileform = '';
var filelink = '';
var filedesc = '';

var device_act = 'exploded!';

var board_name = '???';

var custom_text = '';

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
  "BOARD CREATE": msg_board,
  "MEMO OPEN": msg_memo,
  "MEMO INVITE": msg_invite,
  "MEMO JOIN": msg_join,
  "CHANGE HANDLE": msg_change,
  "SERVER REQUEST": serv_req,
  "SERVER ACCEPT": serv_accept,
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
var dev_opt = document.getElementById("dev-opt");
var memo_opt = document.getElementById("memo-opt");
var cust_opt = document.getElementById("cust-opt");

//assembles reusable message components
function msg_comp(config, context)
{
  color_black = "[color=#"+ system_color + "]";
  close_tag = "[/color]"
  l_bracket = color_black + "[" + close_tag;
  r_bracket = color_black + "]" + close_tag;
  mem_tag = "[color=#" + system_color + "]";

  st_opt.style.display = "none";
  ks_opt.style.display = "none";
  mood_opt.style.display = "none";
  file_opt.style.display = "none";
  dev_opt.style.display = "none";
  memo_opt.style.display = "none";
  cust_opt.style.display = "none";

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

  system_color = config.sys_color;
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

  var dv = document.getElementById("dev-input");

  var mem = document.getElementById("memo-input");
  var memc = document.getElementById("color-input");

  var cust = document.getElementById("cust-input");


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

  dv.oninput = function update(){
    if(dv.value == '')
      device_act = 'exploded!';
    else
      device_act = dv.value;

    refresh();
  }

  mem.oninput = function update(){
    if(mem.value == '')
      board_name = '???';
    else
      board_name = mem.value;

    refresh();
  }

  memc.oninput = function update(){
    if(memc.value == '')
      mem_tag = "[color=#"+ system_color + "]";
    else
      mem_tag = "[color=#" + memc.value + "]";
    refresh();
  }

  cust.oninput = function update(){
    custom_text = cust.value;
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
  var cp2 = document.getElementById("copy-prev");
  cp2.onclick = function copy_output(){
    copy_stat2();
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
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now online --" + close_tag;

  if(statcom!= "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now online --`;

  return res;
}

// -- x [XX] is now offline! --
function msg_offline(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now offline --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now offline --`;

  return res;
}

// -- x [XX] is now idle! --
function msg_idle(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is now idle --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now idle --`;

  return res;
}

// -- x [XX] is no longer idle! --
function msg_offidle(){
  msg_comp(p.config, p.context);
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " is no longer idle --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is no longer idle --`;

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

  if(statcom != "")
  res[0] = statcom + " " + res[0];

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

  if(statcom != "")
  res[0] = statcom + " " + res[0];

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

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] set their mood to ${mood} --`;

  return res;
}

// -- x [XX] REQUESTED to pester y [YY] --
function msg_request(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  ks_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " REQUESTED to " + keyverb + " " + close_tag + user2 + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] REQUESTED to ${keyverb} ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] ACCEPTED y [YY]'s request --
function msg_accept(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " accepted " + close_tag + user2 + color_black + "'s request --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] ACCEPTED ${p.context.sc} [${p.context.tag}]'s request --`;

  return res;
}

// -- x [XX] blocked y [YY] --
function msg_block(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " blocked " + close_tag + user2 + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] blocked ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] unblocked y [YY]! --
function msg_unblock(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];
  res[0] = color_black + "-- " + close_tag + user + color_black + " unblocked " + close_tag + user2 + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] unblocked ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] shared a file: "???" --
// -- x [XX] shared a file with y [yy]: "???" --
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

  if(statcom != "")
  res[0] = statcom + " " + res[0];



  res[1] = `-- ${p.config.handle} [${p.config.acronym}] shared a file: ${fileform} --`

  if (filedesc != '')
    res[1] = res[1] + `<br><br>> ${filedesc}`;


  return res;
}

//-- x [XX]'s device exploded! --
function msg_explode(config, context){
  msg_comp(p.config, p.context);
  dev_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + "'s device "  + device_act + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}]'s device ${device_act} --`

  return res;
}

//-- x [XX] created a board: ??? --
function msg_board(config, context){
  msg_comp(p.config, p.context);
  memo_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " created a board: "+ board_name + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] created a board: ${board_name} --`;

  return res;
}

//-- x [XX] opened a memo on board: ??? --
function msg_memo(config, context){
  msg_comp(p.config, p.context);
  memo_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " opened a memo on board: "+ close_tag + mem_tag + board_name + close_tag + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] opened a memo on board: ${board_name} --`;

  return res;
}

//-- x [XX] invited y [yy] to board: ???
function msg_invite(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  memo_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " invited " + close_tag + user2 + color_black + " to board: "+ close_tag + mem_tag + board_name + close_tag + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] invited ${p.context.sc} [${p.context.tag}] to board: ${board_name} --`;

  return res;
}

//-- x [XX] responded to memo on board: ??? --
//-- x [XX] responded to memo RIGHT NOW --
//-- x [XX] responded to memo ?? HOURS AGO -- (only for transtimeline function)
function msg_join(config, context){
  msg_comp(p.config, p.context);
  memo_opt.style.display = "block";
  var res = [];

  if (board_name != "???")
    res[0] = color_black + "-- " + close_tag + user + color_black + " responded to memo on board: " + close_tag + mem_tag + board_name + close_tag + color_black + " --" + close_tag;

  else res[0] = color_black + "-- " + close_tag + user + color_black + " responded to the memo RIGHT NOW --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  if (board_name != "???")
    res[1] = `-- ${p.config.handle} [${p.config.acronym}] responded to memo on board: ${board_name} --`;
  else res[1] = `-- ${p.config.handle} [${p.config.acronym}] responded to the memo RIGHT NOW --`;

  return res;
}

// -- x [XX] is now y [yy] --
function msg_change(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " is now " + close_tag + user2 + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] is now ${p.context.sc} [${p.context.tag}] --`;

  return res;
}

// -- x [XX] requested to server y [yy] --
function serv_req(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " requested to server " + close_tag + user2 + color_black + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] requested to server ${p.context.sc} [${p.context.tag}] --`;

  return res;
}


// -- x [XX] accepted y [yy]'s request' --
function serv_accept(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  var res = [];

  res[0] = color_black + "-- " + close_tag + user + color_black + " accepted " + close_tag + user2 + color_black + "'s request --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  res[1] = `-- ${p.config.handle} [${p.config.acronym}] accepted ${p.context.sc} [${p.context.tag}]'s request' --`;

  return res;
}

// -- x [XX] ???? --
// -- x [XX] ??? y [yy] --
function msg_custom(config, context){
  msg_comp(p.config, p.context);
  st_opt.style.display = "block";
  cust_opt.style.display = "block";
  var res = [];

  if (p.context.sc != '')
  res[0] = color_black + "-- " + close_tag + user + color_black + " " + custom_text + " " + close_tag + user2 + color_black + " --" + close_tag;

  else res[0] = color_black + "-- " + close_tag + user + color_black + " " + custom_text + " --" + close_tag;

  if(statcom != "")
  res[0] = statcom + " " + res[0];

  if (p.context.sc != '')
  res[1] = `-- ${p.config.handle} [${p.config.acronym}] ${custom_text} ${p.context.sc} [${p.context.tag}] --`;

  else res[1] = `-- ${p.config.handle} [${p.config.acronym}] ${custom_text} --`;

  return res;
}


function copy_stat() {
  var copyText = document.getElementById('status-code');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}


function copy_stat2() {
  var copyItem = document.getElementById('status-prev');
  navigator.clipboard.writeText(copyItem.outerText);
}
