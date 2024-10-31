# Quickstart

Download and extract the zip file in releases and run "Quirk Ultra.exe" to start. That's it.

The GUI looks like this:

![a1](https://github.com/user-attachments/assets/3407212a-f339-4cec-aec1-b27d53bd200b)

1. Dropdown menu of all currently loaded character presets.
2. Dropdown menu of all formatting styles
3. Click and drag bar. The app is always pinned to the top of all open windows by default, but can be minimized and closed by right clicking here
4. Enter text to be formatted here.
5. Preview pane.
6. Command input. Anything entered here will be prefixed before the entire message and formatting, which makes it useful for adding PARP commands or Tupperbox triggers.
7. Copies to the user's clipboard for easy copy and pasting.

Click here to make your own custom preset, or edit an existing one
![a2](https://github.com/user-attachments/assets/1e3a289b-e1c0-4d4c-a774-dfb33a6bb2ae)

The rest of the preset editor works much like PARP.

A known bug right now is that the characters `>` `<` and `&` cause problems when used as quirk replacements. A workaround is to use the following HTML entity codes instead:
`>` - `&gt;`

`<` - `&lt;`

`&` - `&amp;`

Further advanced and experimental settings can be configured in "app/app/data/config.json" but I will leave this to be explored by the more code savvy.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
