# Obsidian Local Images Plus



Obsidian Local Images Plus is a plugin for [Obsidian](https://obsidian.md/) desktop (the mobile version is still in the plans). 

The plugin searches for all external media links in your notes, downloads and saves them locally and adjusts the links in your notes to point to the local files.

**This plugin is in development process, so your ideas and donations are very appreciated.**


## Installation

- Download the latest version from github or [github page](https://sergei-korneev.github.io/obsidian-local-images-plus) of the project.
- Remove obsidian-local-images plugin to avoid any conflicts.
- Extract the archive into your Obsidian vault (e.g. Myvault/.obsidian/plugins)
- Restart Obsidian.
- Open "Community plugins" dialog and change plugin settings at will.
- Enjoy



Update:

The plugin is in Obsidian store now!


## Usage

Just copy any web content, Word/Open Office content and paste it into your note.

You can also insert any file e.g:

```![mypdf](http://mysite/mypdf.pdf)```

```![mylocalfile](file:///mylinuxdisk/mysong.mp3)```

Files will be copied or downloaded to your attachements folder.

**NOTE: I would not recommend to use this plugin for coping really fat files, since buffered reading from disk not implemented to this date (25 dec 2022)**



Use it with commands mode or in timer mode:

![img](docs/Pasted%20image%2020221219134358.png?raw=true)




```Download images locally``` - your active page will be processed.

or

```Download images locally for all your notes``` - will be processed all the pages in your vault, that corresponds to **Include** parameter in the plugin's settings.

Also you can turn on in plugin's settings processing the active page when external links pasted into the page.

**NOTE: This plugin can change all your notes at once, so you should consider doing backups of your files periodically.**


## Future development

**Some upcoming plugin features will be added in this readme on the course of releasing new versions.**

## Donations

Share your  wishes and ideas about this software or buy me a coffee (or hot chocolate)

[![Buy me a coffee](https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/sergeikorneev)



## Credits

[niekcandaele's](https://github.com/niekcandaele/obsidian-local-images)

[aleksey-rezvov](https://github.com/aleksey-rezvov/obsidian-local-images)


## Build from source
```
npm run build
npm run dev
```
