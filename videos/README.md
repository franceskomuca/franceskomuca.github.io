Videography helpers
===================

Place a file `assets/videos/index.json` with an array of objects describing videos.
Each object should contain a YouTube id and an optional title:

[
  { "id": "YouTubeID1", "title": "My short film" },
  { "id": "YouTubeID2", "title": "Behind the scenes" }
]

The `videography.html` page will fetch this file and render cards that show the YouTube thumbnail.
Clicking a card opens an embedded player in a lightbox.

To add a video: edit `assets/videos/index.json` and add an entry. No code changes are needed.
