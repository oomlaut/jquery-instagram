# Instagram jQuery plugin 

A simple jQuery plugin to show a list of Instagram photos.

[![endorse](http://api.coderwall.com/oomlaut/endorsecount.png)](http://coderwall.com/oomlaut)

## Usage

Import the script

```html
<script src="jquery.instagram.js"></script>
```

Insert an empty `div` in the code

```html
<div id="instagram_feed"></div>
```

Run the plugin

```javascript
$(function() {
  $("#instagram_feed").instagram({
      type: "tag",
      q: "love",
      {
        clientId: 'YOUR-CLIENT-ID-HERE'
      }
  });
});
```

## Authentication

You can obtain a client id registering a new Instagram API client app at http://instagr.am/developer/register/

## Options

### type

Choose the type of query you are looking to perform

### q

The actual query to be performed and assembled

### params

Parameters required by the Instagram API for various request types

### image_size

The default size to load thumbnails
