/*! jQuery Slot Machine Plugin - v0.1.0 - 2013-03-28
* https://github.com/justinedelson/jquery-slotmachine
* Copyright (c) 2013 Justin Edelson; Licensed MIT */

/*global window: false, jQuery: false */
 (function($) {
     var CONTAINER_CLASS = "slotMachine-scroll-container",
         INNER_CLASS = "slotMachine-inner",
         IMAGE_CLASS = "slotMachine-image",
         scrollers = [];

     function px(i) {
         return i + "px";
     }

     function getTotalImageHeight(container) {
         var totalHeight = 0;
         container.find("." + INNER_CLASS).find("." + IMAGE_CLASS).each(function(idx, e) {
             totalHeight = totalHeight + $(e).height();
         });
         return totalHeight;
     }

     function scrollContainer(container, increment, goingDown) {
         var innerContainer = container.find("." + INNER_CLASS).first(),
             availableHeight = container.height(),
             totalHeight = getTotalImageHeight(container),
             currentTop = innerContainer.css("top") === "auto" ? 0 : parseInt(innerContainer.css("top"), 10),
             newTop = goingDown ? currentTop + increment : currentTop - increment,
             bottomOverflow = totalHeight - availableHeight + newTop,
             topUnderflow = totalHeight - availableHeight - newTop,
             appender = function(idx, e) {
                 $(e).clone(true).appendTo(innerContainer);
             },
             prepender = function(idx, e) {
                 $(e).clone(true).prependTo(innerContainer);
             },
             reversedImages;

         while (bottomOverflow < 0) {
             innerContainer.find("." + IMAGE_CLASS).slice(0, container.data("linksCount")).each(appender);
             totalHeight = getTotalImageHeight(container);
             bottomOverflow = totalHeight - availableHeight + newTop;
         }

         if (newTop > 0) {
             reversedImages = innerContainer.find("." + IMAGE_CLASS).slice(0, container.data("linksCount")).toArray().reverse();
             $.each(reversedImages, prepender);
             newTop = newTop - totalHeight;
         }

         innerContainer.css("top", newTop);
     }

     function doScroll(increment) {
         if (!increment) { increment = 1; }
         $.each(scrollers, function(idx, e) {
             scrollContainer(e, increment, idx % 2 !== 0);
         });
     }

     function convertToScroller(container, obj) {
         var containerWidth = obj.width,
             containerHeight = obj.height,
             halfContainerWidth = containerWidth / 2,
             leftContainer = $('<div/>'),
             sourceId = container.attr("id"),
             rightContainer,
             leftInner = $('<div/>').addClass(INNER_CLASS).css({"position" : "relative"}),
             rightInner = leftInner.clone(),
             onclick = obj.onclick || function() { return true; },
             links = container.find('a'),
             linkCount = links.size();


         leftContainer.addClass(CONTAINER_CLASS).height(containerHeight).width(halfContainerWidth).css({ "overflow" : "hidden", "display" : "block", 'border-style' : "", "float" : "left" });

         rightContainer = leftContainer.clone();

         leftContainer.append(leftInner);
         leftContainer.data("linksCount", linkCount);
         rightContainer.append(rightInner);
         rightContainer.data("linksCount", linkCount);

         if (sourceId) {
             leftContainer.attr("data-sourceId", sourceId);
             rightContainer.attr("data-sourceId", sourceId);
         }

         links.each(function(idx, e) {
             var a = $(e),
                 img = $(e).find('img').first();
                     
             $("<div/>").addClass(IMAGE_CLASS).css({
                 "background-image" : "url(" + img.attr("src") +")",
                 "cursor" : "pointer",
                 "height" : px(img.attr("height")),
                 "width" : px(containerWidth)
             }).click(a, onclick).appendTo(leftInner);
             $("<div/>").addClass(IMAGE_CLASS).css({
                 "background-image" : "url(" + img.attr("src") +")",
                 "cursor" : "pointer",
                 "background-position" : px("-" + halfContainerWidth),
                 "height" : px(img.attr("height")),
                 "width" : px(containerWidth)
             }).click(a, onclick).appendTo(rightInner);
         });
         container.after(leftContainer);
         leftContainer.after(rightContainer);
         container.remove();

         scrollers.push(leftContainer);
         scrollers.push(rightContainer);

         if (obj.initial) {
             scrollContainer(leftContainer, obj.initial, false);
             scrollContainer(rightContainer, obj.initial, true);
         }

     }

     $.fn.slotMachine = function(obj) {
         return this.each(function(idx, e) {
             convertToScroller($(e), obj);
         });

     };

     (function(){
         var tempScrollTop = 0,
             currentScrollTop = 0,
             didFirstScroll = false;
         

         $(window).scroll(function() {
             var delta = 0;
             currentScrollTop = $(window).scrollTop();
             delta = currentScrollTop - tempScrollTop;

             //console.log(tempScrollTop, currentScrollTop, delta);
             if (didFirstScroll && delta !== 0) {
                 doScroll(5 * delta);
             }
             didFirstScroll = true;
             tempScrollTop = currentScrollTop;
         });
     }());
 }(jQuery));
