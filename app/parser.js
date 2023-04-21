class Parser {
  constructor() {
    this.config = {};
    this.library = [];
    this.style = {};
    this.context = {
      com: "",
      tag: "",
      hex: "",
      sc: ""
    };
  }

  transform(text) {
    let lineArr = text.split("\n")
    let com = "";
    if(this.context.com != "") com = this.context.com + " ";

    lineArr.forEach((item, i) => {
      let t = this.config.case.transform(i, item);
      lineArr[i] = this.config.transform(t, this.context);

    });

    this.style.stylize(lineArr, this.config, this.context);


    return com + lineArr.join("\n");
  }
}


class Base {
  constructor(id, name, handle, acronym, hex) {
    this.id = id;
    this.name = name;
    this.handle = handle;
    this.acronym = acronym;
    this.hex = hex;
    this.transformations = [];
    this.format = "${t}";
    this.case = new Caps();
    this.sampletext = "The quick brown fox jumps over the lazy dog."
    this.ref = "";
    this.favorite = false;
    this.active = true;
    this.visibility = false;
  }


  transform(line, context) {
    let t = line;
    this.transformations.forEach((item, i) => {
      if(item[0].source != "(?:)") {
        t = t.replace(item[0], item[1]);
      }
    });

    t = this.format.replace(new RegExp('\\${t}', 'g'), t);
    return t;
  }

}
