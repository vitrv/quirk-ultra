const fs = require('fs')

async function loadparser()
{
  let p = new Parser();

  p.style = new MemoStyle();

  let presets = await fetch_data('./app/data/test.json');
  for (var x in presets.presets){
      load_preset(presets.presets[x], p.library);
  }

  // let presets = await fetch_data('./app/data/canon-1.json');
  //
  //
  // for (var x in presets.presets){
  //    load_preset(presets.presets[x], p.library);
  // }
  //
  // let presets2 = await fetch_data('./app/data/frost-1.json');
  //
  // for (var x in presets2.presets){
  //    load_preset(presets2.presets[x], p.library);
  // }
  //
  // await save_preset(p.library);

  var default_preset = p.library.find((p) => {
    return config.default == p.id;
  });
  if (default_preset == undefined)
  {
    p.config = p.library[0];
  }
  else {
    p.config = default_preset;
  }

  return p;
}

function load_preset(set, library){

  let preset = new Base(set.id, set.name, set.handle, set.acronym, set.hex);
  preset.format = set.format;
  preset.favorite = set.favorite;
  preset.active = set.active;
  preset.ref = set.ref;
  if(set.visibility != null){
    preset.visibility = set.visibility;
  }
  if(set.sampletext != null)
  {
    preset.sampletext = set.sampletext;
  }
  for(var x in set.transformations){
    var n = new RegExp(set.transformations[x][0], 'g');
    preset.transformations.push([n, set.transformations[x][1]]);
  }
  switch (set.case) {
    case ("NONE"):
      preset.case = preset.case;
    break;
    case ("TITLE"):
      preset.case = new TitleCaps();
    break;
    case ("ALL"):
      preset.case = new AllCaps();
    break;
    case ("ALT"):
      preset.case = new AltCaps();
    break;
    case ("ROLL"):
      preset.case = new RollCaps();
    break;
    case ("INV"):
      preset.case = new InvCaps();
    break;
    case ("INVLONG"):
      preset.case = new InvLongCaps();
    break;
    case ("LEPIOZ"):
      preset.case = new Lepioz();
    break;
    default:
      preset.case = preset.case;
    }

  library.push(preset);
}

async function save_preset(library){

  var path = "./app/data/test.json";

  const content = {"presets" : []};
  for (var x in library){
    var set = library[x];
    var entry =  {
          "id": set.id,
          "name":set.name,
          "handle": set.handle,
          "acronym": set.acronym,
          "hex": set.hex,
          "transformations": write_transform(set.transformations),
          "format": set.format,
          "case": write_case(set.case),
          "sampletext": set.sampletext,
          "ref": set.ref,
          "favorite": set.favorite,
          "active": set.active,
          "visibility": set.visibility

    };
    content.presets.push(entry);
  }

  fs.writeFile(path, JSON.stringify(content), err => {
    if (err) {
      console.error(err);
    }
  });

}

function write_transform(transform_set){
  var res = [];
  for(var x in transform_set){
    var ts = transform_set[x];
    var entry = [ts[0].source, ts[1]];
    res.push(entry);
  }
  return res;
}

function write_case(case_obj){

  switch (case_obj.constructor.name) {
    case ('Caps'):
      return "NONE";
    break;
    case ('TitleCaps'):
      return "TITLE";
    break;
    case ('AllCaps'):
      return "ALL";
    break;
    case ('AltCaps'):
      return "ALT";
    break;
    case ('RollCaps'):
      return "ROLL";
    break;
    case ('InvCaps'):
      return "INV";
    break;
    case ('InvLongCaps'):
      return "INVLONG";
    break;
    case ('Lepioz'):
      return "LEPIOZ";
    break;
    default:
      return "NONE";
  }

}

async function fetch_data(path){
  let data = await fetch(path)
  return data.json();

}
