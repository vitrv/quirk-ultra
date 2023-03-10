/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

//URGENT
//add hex to memo board statuses
//add optional second user to file share and custom statuses
//server requested/accepted


//HIGH PRIORITY
//option to unpin window from being on top
//global system themes
//sample text editor input
//default character setting
//option to hide presets from list
//option to "favorite" presets so they appear on top
//preset editor scrolling
//clear error messages on change preset or edit preset, show unsaved changes
//user manual/readme
//packaging

//LOW PRIORITY
//display preview/ display color parser
//choose loaderfile
//ref image link support
//para editor?
//set default character
//autoescape transform regexes
//test editor backing copy
//advanced options setting?
//adaptive lowercase
//copy preset
//transtimeline support for statuses and pms
//font settings


var parser;
var tab_state = 0;
var textbox = document.getElementById("text");

var parser_n;

function updateOutput() {
   var out = document.getElementById("output");
   out.innerHTML = parser.transform(textbox.value);
   if(parser.config.visibility == true)
     out.style.color = '#' + vis_correct(parser.config.hex);

   else out.style.color = '#' + parser.config.hex;

}

function copy_text() {
  var copyText = document.getElementById("output");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function vis_correct(c) {
  var correction = '404040';
  var hexStr = (parseInt(c, 16) + parseInt(correction, 16)).toString(16);
  while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  return hexStr;
}

function tab_swap() {

  var tab0 = document.getElementById("tab-main");
  var tab1 = document.getElementById("tab-status");
  var tab2 = document.getElementById("tab-preset");
  var tab3 = document.getElementById("tab-settings");


  tab0.style.display = "none";
  tab1.style.display = "none";
  tab2.style.display = "none";
  tab3.style.display = "none";

  switch (tab_state) {
    case (0):
      tab0.style.display = "block";
    break;
    case (1):
      tab1.style.display = "block";
    break;
    case (2):
      tab2.style.display = "block";
    break;
    case (3):
      tab3.style.display = "block";
    break;
    default:
      tab0.style.display = "block";
    }
}

function update_editor(){

  if (parser_n.config.id == null)
  {

    var set = parser.library[0];

    parser_n.config = new Base(set.id, set.name, set.handle, set.acronym, set.hex);
    parser_n.config.case = Object.create(set.case);
    parser_n.config.format = set.format;
    parser_n.config.sampletext = set.sampletext;
    parser_n.config.visibility = set.visibility;
    parser_n.config.ref = set.ref;
    parser_n.config.active = set.active;
    parser_n.config.transformations = set.transformations.map(a => ({ ...a }));

  }


  var id = document.getElementById("id-input");
  id.value = parser_n.config.id;
  var name = document.getElementById("name-input");
  name.value = parser_n.config.name;
  var handle = document.getElementById("handle-input");
  handle.value = parser_n.config.handle;
  var acro = document.getElementById("acro-input");
  acro.value = parser_n.config.acronym;
  var hex = document.getElementById("hex-input");
  hex.value = parser_n.config.hex;

  const index = parser_n.config.format.indexOf("${t}");
  var format1 = parser_n.config.format.slice(0, index);
  var format2 = parser_n.config.format.slice(index+4);


  var prefix = document.getElementById("prefix-input");
  prefix.value = format1;
  var suffix = document.getElementById("suffix-input");
  suffix.value = format2;

  var c = document.getElementById("case-input");
  c.value = case_display(parser_n.config.case);

  var ts = document.getElementById("transform-input");
  ts.innerHTML = '';
  for (var t in parser_n.config.transformations) {
    var row = create_transform_row(parser_n.config.transformations[t][0].source, parser_n.config.transformations[t][1], t);

    ts.appendChild(row);
  }

  update_sampletext();
}

function create_transform_row(a, b, x) {

  var row = document.createElement("DIV");
  const rank = x;

  var _a = document.createElement("input");
  _a.setAttribute("size", "8");
  _a.value = a;
  _a.oninput = function update() {
    parser_n.config.transformations[rank][0]= new RegExp(_a.value, 'g');
    update_sampletext();
  }

  var _b = document.createElement("input");
  _b.setAttribute("size", "8");
  _b.value= b;
  _b.oninput = function update() {
    parser_n.config.transformations[rank][1] = _b.value;
    update_sampletext();
  }

  var arrow = document.createElement("span");
  arrow.innerHTML = " --> ";

  row.appendChild(_a);
  row.appendChild(arrow);
  row.appendChild(_b);

  return row;

}

function update_sampletext(){
  var edit = document.getElementById("sampletext");
  sampletext.innerHTML = parser_n.transform(parser_n.config.sampletext);
  if(parser_n.config.visibility == true)
    sampletext.style.color = '#' + vis_correct(parser_n.config.hex);
  else sampletext.style.color = '#' + parser_n.config.hex;
}

function list_library(){

  var lib = document.getElementById("library");
  lib.innerHTML = '';

  for (var x in parser.library) {
   var preset = document.createElement("DIV");
   preset.classList.add('library-item');
   preset.innerHTML = parser.library[x].id;
   preset.onclick = function nav(){

     let set = parser.library.find((p) => {
       return this.innerHTML == p.id;
     })

     parser_n.config = new Base(set.id, set.name, set.handle, set.acronym, set.hex);
     parser_n.config.case = Object.create(set.case);
     parser_n.config.format = set.format;
     parser_n.config.sampletext = set.sampletext;
     parser_n.config.visibility = set.visibility;
     parser_n.config.ref = set.ref;
     parser_n.config.active = set.active;
     parser_n.config.transformations = set.transformations.map(a => ({ ...a }));

     update_editor();
   }

   lib.appendChild(preset);

  }

}

function case_display(case_obj){
  switch (case_obj.constructor.name) {
    case ('Caps'):
      return "No casing";
    break;
    case ('TitleCaps'):
      return "Title Case";
    break;
    case ('AllCaps'):
      return "ALL CAPS";
    break;
    case ('AltCaps'):
      return "alternating LINES";
    break;
    case ('RollCaps'):
      return "aLtErNaTiNg";
    break;
    case ('InvCaps'):
      return "iNVERTED wORDS";
    break;
    case ('InvLongCaps'):
      return "iNVERTED CAPS";
    break;
    case ('Lepioz'):
      return "LEPIOZ";
    break;
    default:
      return "No casing";
  }

}

function case_factory(str){
  switch (str) {
    case ("No casing"):
      return new Caps();
    break;
    case ("Title Case"):
      return new TitleCaps();
    break;
    case ("ALL CAPS"):
      return new AllCaps();
    break;
    case ("alternating LINES"):
      return new AltCaps();
    break;
    case ("aLtErNaTiNg"):
      return new RollCaps();
    break;
    case ("iNVERTED wORDS"):
      return new InvCaps();
    break;
    case ("iNVERTED CAPS"):
      return new InvLongCaps();
    break;
    case ("LEPIOZ"):
      return new Lepioz();
    break;
    default:
      return new Caps();
  }

}

function refresh_library(){

  var sel = document.getElementById("preset");
  var sel_arg = document.getElementById("arg-preset");
  var sel_st = document.getElementById("st-preset");

  sel.innerHTML = '';
  sel_arg.innerHTML = '';
  sel_st. innerHTML = '';

  sel.options[0] = new Option("select", "select");
  sel_arg.options[0] = new Option("select", "select")
  sel_st.options[0] = new Option("select", "select")


  for (var x in parser.library) {
    sel.options[sel.options.length] = new Option(parser.library[x].id, parser.library[x].id);
    sel_arg.options[sel_arg.options.length] = new Option(parser.library[x].id, parser.library[x].id);
    sel_st.options[sel_st.options.length] = new Option(parser.library[x].id, parser.library[x].id);
  }

  parser.config = parser.library.find((p) => {
    return parser.config.id == p.id;
  })

  if(parser.config == null) parser.config = parser.library[0];

  updateOutput();

}

function valid_id(current_id, new_id){

  for (var x in parser.library) {

    var zid = parser.library[x].id;
    if (zid == new_id && zid != current_id){
      return false;
    }
  }
  return true;
}

window.onload = async function() {
  parser = await loadparser();
  parser_n = new Parser();
  parser_n.style = new MemoStyle();
  tab_swap();
  list_library();
  list_status(parser);

  var opt = document.getElementById("style-opt");
  opt.style.display = "none";
  var opt2 = document.getElementById("style-opt2");
  opt2.style.display = "none";

  var st_tag = document.getElementById("st-tag");
  var st_hex = document.getElementById("st-hex");
  var st_handle = document.getElementById("st-handle");
  var st_opt = document.getElementById("status-opt");

  st_opt.style.display = "none";

  var sel = document.getElementById("preset");
  var sel_arg = document.getElementById("arg-preset");
  var sel_st = document.getElementById("st-preset");

  refresh_library();
  update_editor();

  var sel2 = document.getElementById("style");
  let styles = ['No Style', 'Memo Style', 'Script Style', 'BBScript Style',
  "BBMemo Style", 'PM Style', 'PM Strong Style', 'Discord Style', 'Block Style',
  "PMFreeform Style"]

  for (var s in styles) {
    sel2.options[sel2.options.length] = new Option(styles[s], styles[s]);
  }

  textbox.oninput = function parse() {
    updateOutput();
  }

  var com = document.getElementById("com");
  com.oninput = function update() {
    parser.context.com = com.value;
    refresh();
    updateOutput();
  }

  var com2 = document.getElementById("com2");
  com2.oninput = function update() {
    statcom = com2.value;
    refresh();
    updateOutput();
  }

  var tag = document.getElementById("tag");
  tag.oninput = function update() {
    parser.context.tag = tag.value;
    updateOutput();
  }

  var hex = document.getElementById("hex");
  hex.oninput = function update() {
    parser.context.hex = hex.value;
    updateOutput();
  }

  st_hex.oninput = function update() {
    parser.context.hex = st_hex.value;
    refresh();
  }

  st_tag.oninput = function update() {
    parser.context.tag = st_tag.value;
    refresh();
  }

  st_handle.oninput = function update() {
    parser.context.sc = st_handle.value;
    refresh();
  }

  var free_arg = document.getElementById("bbcode-opt");
  free_arg.oninput = function update() {
    parser.context.hex = free_arg.value;
    updateOutput();
  }

  sel.onchange = function update() {
    parser.config = parser.library[sel.selectedIndex-1];
    refresh();
    updateOutput();
  }

  sel_arg.onchange = function update() {
    var source = parser.library[sel_arg.selectedIndex-1]
    parser.context.hex = source.hex;
    parser.context.tag = source.acronym;
    parser.context.sc = source.handle;
    updateOutput();
  }

  sel_st.onchange = function update() {
    var source = parser.library[sel_st.selectedIndex-1]
    parser.context.hex = source.hex;
    parser.context.tag = source.acronym;
    parser.context.sc = source.handle;
    refresh();
  }

  sel2.onchange = function update() {
    switch (sel2.value) {
      case ('No Style'):
        parser.style = new Style();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("Memo Style"):
        parser.style = new MemoStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("Script Style"):
        parser.style = new ScriptStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("BBScript Style"):
        parser.style = new BBScriptStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("PM Style"):
        parser.style = new PMStyle();
        opt.style.display = "block";
        opt2.style.display = "none";
        break;
      case ("Discord Style"):
        parser.style = new DiscordStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("BBMemo Style"):
        parser.style = new BBMemoStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("PM Strong Style"):
        parser.style = new PMStrongStyle();
        opt.style.display = "block";
        opt2.style.display = "none";
        break;
      case ("Block Style"):
        parser.style = new BlockStyle();
        opt.style.display = "none";
        opt2.style.display = "none";
        break;
      case ("PMFreeform Style"):
        parser.style = new PMFreeformStyle();
        opt.style.display = "none";
        opt2.style.display = "block";
        break;
      default:
        parser.style = new MemoStyle();
        opt.style.display = "none";
        opt2.style.display = "none";

    }
    var header = document.getElementById("styleheader");
    header.innerHTML = parser.style.description_text;
    updateOutput();
  }

  var sel_case = document.getElementById("case-input");
  let cases = ['No casing', 'ALL CAPS', 'Title Case',
  "aLtErNaTiNg", 'alternating LINES', 'iNVERTED CAPS', 'iNVERTED wORDS']
  for (var c in cases) {
    sel_case.options[sel_case.options.length] = new Option(cases[c], cases[c]);
  }

  var copy_button = document.getElementById("copy");
  copy_button.onclick = function copy_output(){
    copy_text();
  }

  var nav0 = document.getElementById("nav-main");
  nav0.onclick = function nav(){
    tab_state = 0;
    tab_swap();
  }

  var nav1 = document.getElementById("nav-status");
  nav1.onclick = function nav(){
    tab_state = 1;
    tab_swap();
  }

  var nav2 = document.getElementById("nav-preset");
  nav2.onclick = function nav(){
    tab_state = 2;
    tab_swap();
  }

  var nav3 = document.getElementById("nav-settings");
  nav3.onclick = function nav(){
    tab_state = 3;
    tab_swap();
  }

  // var id = document.getElementById("id-input");
  // id.onchange = function update() {
  //   parser_n.config.id = id.value;
  // }

  var name = document.getElementById("name-input");
  name.oninput = function update() {
    parser_n.config.name = name.value;
    update_sampletext();
  }

  var handle = document.getElementById("handle-input");
  handle.oninput = function update() {
    parser_n.config.handle = handle.value;
    update_sampletext();
  }

  var acro = document.getElementById("acro-input");
  acro.oninput = function update() {
    parser_n.config.acronym = acro.value;
    update_sampletext();
  }

  var hex_input = document.getElementById("hex-input");
  hex_input.oninput = function update() {
    parser_n.config.hex = hex_input.value;
    update_sampletext();
  }

  var caps = document.getElementById("case-input");
  caps.onchange = function update() {
    parser_n.config.case = case_factory(caps.value);
    update_sampletext();
  }

  var prefix = document.getElementById("prefix-input");
  prefix.oninput = function update() {
    const index = parser_n.config.format.indexOf("${t}");
    var format2 = parser_n.config.format.slice(index+4);

    parser_n.config.format = prefix.value + "${t}" + format2;
    update_sampletext();

  }

  var suffix = document.getElementById("suffix-input");
  suffix.oninput = function update() {
    const index = parser_n.config.format.indexOf("${t}");
    var format1 = parser_n.config.format.slice(0, index);

    parser_n.config.format = format1 + "${t}" + suffix.value;
    update_sampletext();
  }

  var tf_add = document.getElementById("add-transform-row");
  tf_add.onclick = function update() {
    parser_n.config.transformations.push([new RegExp("", 'g'), ""]);
    update_editor();
  }

  var tf_del = document.getElementById("del-transform-row");
  tf_del.onclick = function update() {
    parser_n.config.transformations.pop();
    update_editor();
  }

  var psave = document.getElementById("save-preset");
  psave.onclick = function save(){

    var rank = parser.library.findIndex((p) => {
      return parser_n.config.id === p.id;
    })
    var source_id = document.getElementById("id-input");
    var err_msg = document.getElementById("id-error");
    var save_msg = document.getElementById("msg-save");
    err_msg.innerHTML = "";
    save_msg.innerHTML = "";


    if(!valid_id(parser_n.config.id, source_id.value)) {
      err_msg.innerHTML = `ERROR: ID '${source_id.value}' already taken.`;
      return;
    }

    var source = parser_n.config;

    parser.library[rank] = new Base(source_id.value, source.name, source.handle, source.acronym, source.hex);
    var set = parser.library[rank];
    set.case = Object.create(source.case);
    set.format = source.format;
    set.sampletext = source.sampletext;
    set.ref = source.ref;
    set.active = source.active;
    set.transformations = source.transformations.map(a => ({ ...a }));

    parser_n.config.id = source_id.value;

    save_preset(parser.library);
    refresh_library();
    list_library();

    save_msg.innerHTML = "Saved!";


  }

  var pdel = document.getElementById("del-preset");
  pdel.onclick = function del(){

    parser.library = parser.library.filter((p) => {
      return parser_n.config.id != p.id;
    })
    parser_n.config.id = null;
    save_preset(parser.library);
    list_library();
    refresh_library();
    update_editor();


  }

  var pnew = document.getElementById("new-preset");
  pnew.onclick = function create_new(){
    let n = new Base('UNTITLED', 'UNTITLED', 'anonymous', '??', 'ffffff')
    parser.library.push(n);
    parser_n.config = n;

    list_library();
    refresh_library();
    update_editor();
  }


}
