proxer-local-status
===================

A chrome extension for proxer.me to display whether or not you have an anime/manga locally (hard drive / cd / dvd).

Features
========
- Chrome Sync
- Displays in anime/manga list and on every anime/manga page
- Easy toggle
- EN / DE

Development
============
Simply clone this repository to anywhere you like
```
git clone https://github.com/kumpelblase2/proxer-local-status
```
In chrome go to `Settings` -> `Extensions`. Here enable `Developer mode` to enable loading of unpackaged extensions. Then click on `Load unpackaged extension` and select the folder of the repository.

Installation
============
Download one of the relases from the [release page](https://github.com/kumpelblase2/proxer-local-status/releases). Then go to `Settings` -> `Extensions` and drag the downloaded file into the window.

Usage
=====
When you go to your anime list in your control panel and got to your `Animes` (or `Mangas`) page, you should have a new column in the tables and a new action for your animes/mangas. ![Example](img/example.png)
The leftmost indicator displays whether or not you have the anime on your disk.
- `-` : Not on disk
- `X` : On Disk

On the right there's a new action: `[ Local ]` / `[ Not local ]` These actions allow you to toggle whether or not you have it saved as local or not.


TODO
====
- ~~Display local status on info/details page~~
- Display local status on connections page
