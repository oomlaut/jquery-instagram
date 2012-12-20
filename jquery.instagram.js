/*
 * Instagram jQuery plugin
 * v0.2.1
 * http://potomak.github.com/jquery-instagram/
 * Copyright (c) 2012 Giovanni Cappellotto
 * Licensed MIT
 */

(function ($){
  $.fn.extend({
    instagram: function(options, callback) {
      var that = this;
      var defaults = {
          url: null
          , apiEndpoint: "https://api.instagram.com"
          , v: "/v1"
          , type: false
          , query: {
              tag: "/tags/{{q}}/media/recent"
              , tag_search: "/tags/search"
              , search: "/media/search"
              , user: "/users/{{q}}/media/recent"
              , location: "/locations/{{q}}/media/recent"
              , popular: "/media/popular"
            }
          , q: null
          , params: {}
            /* options:
              params.access_token
              params.client_id
              params.count //defaults to 20
              params.distance
              params.lat
              params.lng
              params.max_id
              params.max_timestamp
              params.min_id
              params.min_timestamp
              params.q //overridden if settings.q is not null
              */
          , image_size: "thumbnail"
          , onLoad: null
          , onComplete: null
        };

      return this.each(function(){
        //perform for each of the elements passed in
        var settings = $.extend(true, defaults, options);
        var methods = {
          el: null,
          init: function($el){
            this.el = $el;
            if(settings.url == null) {
              settings.url = this.composeRequestURL();
            }

            settings.q = settings.q.replace(" ", "_");
            this.bindLoadEvent();
            this.loadStream();
            if($.isFunction(callback)) { callback(); }
          },
          composeRequestURL: function() {
            //TODO: store the next_url and next_id on the element as data
            var url = settings.apiEndpoint;
            url += settings.v;

            //load predefined pattern, replacing token with query
            if(typeof settings.query[settings.type] != "undefined"){
              url += settings.query[settings.type].replace("{{q}}", settings.q)
              if(settings.type.search("search") != -1 && settings.q != null) { settings.params.q = settings.q; }
            } else {
              url += settings.query.popular;
            }

            // construct querystring from parameters
            if(settings.params != null) {
              url += "?" + $.param(settings.params)
            }

            return url;
          },
          bindLoadEvent: function(){
            var context = this;
            context.el.bind("loadMore", function(){
              context.loadStream();
            });
          },
          loadStream: function(){
            var context = this;
            if(!context.el.hasClass("instagram_loading") && !context.el.hasClass("instagram_stream_end_reached")) {
              context.el.addClass('instagram_loading');
              var loadingIndicator = context.createLoadingIndicator().appendTo(context.el);
              $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: settings.url,
                success: function (res) {
                  // TODO: report successful responses that contain error messaging
                  var length = typeof res.data != 'undefined' ? res.data.length : 0;
                  var limit = settings.show != null && settings.show < length ? settings.show : length;
                  
                  if (typeof res.data != 'undefined' && res.data.length > 0) {
                    $.each(res.data, function(i,v){
                      // TODO: animate each one in on load
                      context.el.append(context.createPhotoElement(v));
                    });
                    if(typeof res.pagination.next_url != "undefined"){
                      settings.url = res.pagination.next_url;
                    } else {
                      context.el.addClass("instagram_stream_end_reached").append(context.createEndIndicator());
                    }
                  }
                  else {
                    context.el.append(context.createEmptyPlaceholder());
                  }
                },
                error: function(){
                  // TODO: report errors
                },
                complete: function(){
                  $(loadingIndicator).remove();
                  context.el.removeClass("instagram_loading");
                }
              }); //end ajax
            }// endif
          },
          createEmptyPlaceholder: function() {
            return $('<div>', {
              "class": 'instagram-placeholder',
              html: "<p>No photos for this query.</p>"
            });
          },
          createEndIndicator: function(){
            return $("<div>", {
              "class": "instagram-endIndicator",
              text: "End of stream reached."
            })
          },
          createLoadingIndicator: function(){
            return $("<div>", {
              "class": "instagram-loadingIndicator",
              text: "Loading more photos..."
            });
          },
          createPhotoElement: function(data) {
            return $('<div>', {
                "class": 'instagram-placeholder'
                , id: data.id
              }).append(
                $('<a>', {
                  href: data.images.standard_resolution.url //data.link
                  , rel: "external"
                }).append(
                    $('<img>', {
                      "class": "instagram-image"
                      , src: data.images[settings.image_size].url
                    })
                  )
              );
          }
        }; //end methods

        methods.init($(this));

      }); //end each
    } //end instagram
  });
})(jQuery);
