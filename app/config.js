class Config {
  constructor() {
    this.pinned = true;
    this.dark_mode = true;
    this.default = 'KALIAS';
    this.path = '/app/data/lib.json';
    this.sys_color = '404040';
    this.debug = true;
    this.show_secret_settings = true;

   }

  async load_config()
  {
    let file = await fetch('./app/data/config.json');
    var data = await file.json();
    this.pinned = data.pinned_to_top;
    this.dark_mode = data.dark_mode
    this.default = data.default_preset;
    this.path = data.data_location;
    this.sys_color = data.system_msg_color;
    this.debug = data.debug;
    this.show_secret_settings = data.show_secret_settings;

  }

    save_config(){

    }


}
