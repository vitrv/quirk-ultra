class Config {
  constructor() {
    this.pinned = true;
    this.dark_mode = true;
    this.default = 'KALIAS';
    this.data_location = '';
    this.sys_color = '404040';

    async function load_config()
    {
      let file = await fetch('./app/data/config.json').json();

    }

    function save_config(){

    }


  }
}
