# Obsidian Local Images Plus



Obsidian Local Images Plus is a plugin for [Obsidian](https://obsidian.md/) desktop (the mobile version is still in the plans). 

The plugin searches for all external media links in your notes, downloads and saves them locally and adjusts the links in your notes to point to the local files.



## Installation

- Download the latest version from [GitHub](https://github.com/Sergei-Korneev/obsidian-local-images-plus) / [GitHub page](https://sergei-korneev.github.io/obsidian-local-images-plus) / or install from "Obsidian Community Plugins". [Read release notes](https://github.com/Sergei-Korneev/obsidian-local-images-plus/releases).
- Remove obsidian-local-images plugin to avoid any conflicts.
- Extract the archive into your Obsidian vault (e.g. Myvault/.obsidian/plugins)
- Restart Obsidian.
- Open "Community plugins" dialog and change plugin settings at will.
- Enjoy



## Usage

Just copy any web content, Word/Open Office content and paste it into your note.


![img](docs/exampleimage.gif?raw=true)

Use it in the command mode or in the timer mode (toggle "on paste processing" option in the settings):


**NOTE: An interval 5 sec or above is recommended. if you have old settings saved change it manually**


![img](docs/Pasted%20image%2020221219134358.png?raw=true)




```Download all media files``` - your active page will be processed.

or

```Download media files for all your notes``` - will be processed all the pages in your vault, that corresponds to **Include** parameter in the plugin's settings.



**NOTE: This plugin can change all your notes at once, so you should consider doing backups of your files periodically.**

You can also insert any file e.g:

```![mypdf](http://mysite/mypdf.pdf)```

```![mylocalfile](file:///mylinuxdisk/mysong.mp3)```

Files will be copied or downloaded to your attachements folder.

![img](docs/examplepdf.gif?raw=true)

**NOTE: I would not recommend to use this plugin for copying really big files, since buffered reading from disk not implemented yet.**



Starting from version 0.14.5 attachment names are generated according to MD5, therefore they are pretty unique within the vault.        

This means you can place an attachement file anywhere within your vault, replace the absolute path in a tag with the file name and Obsidian will still show it in your note.
 



## Donations

Share your  wishes and ideas about this software or buy me a coffee (or hot chocolate)



<a href="https://www.buymeacoffee.com/sergeikorneev"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=sergeikorneev&button_colour=5F7FFF&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>



## Credits

[niekcandaele's](https://github.com/niekcandaele/obsidian-local-images)

[aleksey-rezvov](https://github.com/aleksey-rezvov/obsidian-local-images)


## Build from source
```
npm run build
npm run dev
```
