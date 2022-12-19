# Obsidian Local Images Plus


Obsidian Local Images is a plugin for [Obsidian](https://obsidian.md/). 

## Installation

- Download latest version from github or the github page of the project.
- Extracct the archive into your obsidian vault (e.g. Myvault/.obsidian/plugins)
- Restart Obsidian.
- Open "Community plugins" dialog and change plugin setting at will.
- Enjoy




The plugin finds all links to external images in your notes, downloads and saves images locally and finally adjusts the link in your note to point to the local image files.

![](README/obsidian-local-images-sep2021.gif)

For example, we initially have a markup in the note like this:

    ![](https://picsum.photos/200/300.jpg)

Local Images plugin will download image 300.jpg, save in **media** subdirectory of the vault, than change the markup so it refer to locally stored image:

    ![](media/300.jpg)

It is useful when you copy paste parts from web-pages, and want to keep images in your vault. Because external links can be moved or expired in future.

![](README/obsidian-local-images-html-sep2021.gif)

Use it with commands:

**Download images locally** -- your active page will be processed.

or

**Download images locally for all your notes** -- will be processed all the pages in your vault, that corresponds to **Include** parameter in the plugin's settings.

Also you can turn on in plugin's settings processing the active page when external links pasted into the page.

The plugin was not tested with mobile version, probably it can work with it too.



**This plugin is in development process, so your ideas and donations are appreciated.**


## Credit

[niekcandaele's](https://github.com/niekcandaele/obsidian-local-images)
[aleksey-rezvov](https://github.com/aleksey-rezvov/obsidian-local-images)


## Development

```
# To build from source
npm run dev
npm run build
```
