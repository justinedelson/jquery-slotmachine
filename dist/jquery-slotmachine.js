/*! jQuery Slot Machine Plugin - v0.1.0 - 2013-01-24
* https://github.com/justinedelson/jquery-slotmachine
* Copyright (c) 2013 Justin Edelson; Licensed MIT */

(function($) {
  var CONTAINER_CLASS = "slotMachine-scroll-container",
      INNER_CLASS = "slotMachine-inner",
      IMAGE_CLASS = "slotMachine-image",
      slotMachines = [];

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
        cloneImages = function() {
          innerContainer.find("." + IMAGE_CLASS).each(function(idx, e) {
            $(e).clone().appendTo(innerContainer);
          });
        };

    while (bottomOverflow < 0) {
      cloneImages();
      totalHeight = getTotalImageHeight(container);
      bottomOverflow = totalHeight - availableHeight + newTop;
    }

    if (newTop > 0) {
      var reversedImages = innerContainer.find("." + IMAGE_CLASS).toArray().reverse();
      $.each(reversedImages, function(idx, e) {
        $(e).clone().prependTo(innerContainer);
      });
      newTop = newTop - totalHeight;
    }

    innerContainer.css("top", newTop);
  }

  function scroll(increment) {
    if (!increment) { increment = 1; }
    $.each(slotMachines, function(idx, e) {
      scrollContainer(e, increment, idx % 2 !== 0);
    });
  }

  function convertToSlotMachine(container, obj) {
      var containerWidth = obj.width,
        containerHeight = obj.height,
        halfContainerWidth = containerWidth / 2,
        leftContainer = $('<div/>'),
        sourceId = container.attr("id"),
        rightContainer,
        leftInner = $('<div/>').addClass(INNER_CLASS).css({"position" : "relative"}),
        rightInner = leftInner.clone();

        leftContainer.addClass(CONTAINER_CLASS).height(containerHeight).width(halfContainerWidth).css({ "overflow" : "hidden", "display" : "inline-block", 'border-style' : "" });

        rightContainer = leftContainer.clone();

        leftContainer.append(leftInner);
        rightContainer.append(rightInner);

        if (sourceId) {
          leftContainer.attr("data-sourceId", sourceId);
          rightContainer.attr("data-sourceId", sourceId);
        }

    container.find('img').each(function(idx, e) {
      var img = $(e);
      $("<div/>").addClass(IMAGE_CLASS).css({
        "background-image" : "url(" + img.attr("src") +")",
        "height" : px(img.attr("height")),
        "width" : px(containerWidth)
      }).appendTo(leftInner);
      $("<div/>").addClass(IMAGE_CLASS).css({
        "background-image" : "url(" + img.attr("src") +")",
        "background-position" : px("-" + halfContainerWidth),
        "height" : px(img.attr("height")),
        "width" : px(containerWidth)
      }).appendTo(rightInner);
      img.remove();
    });
    container.append(leftContainer);
    container.append(rightContainer);

    slotMachines.push(leftContainer);
    slotMachines.push(rightContainer);

    if (obj.initial) {
      scrollContainer(leftContainer, obj.initial, false);
      scrollContainer(rightContainer, obj.initial, true);
    }

  }

    $.fn.slotMachine = function(obj) {
      return this.each(function(idx, e) {
        convertToSlotMachine($(e), obj);

      });
  };

  (function(){
    var tempScrollTop = 0, currentScrollTop = 0;

    $(window).scroll(function() {
      var delta = 0;
      currentScrollTop = $(window).scrollTop();
      delta = currentScrollTop - tempScrollTop;
      if (delta !== 0) {
        scroll(5 * delta);
      }
      tempScrollTop = currentScrollTop;
    });
  })();
})(jQuery);
