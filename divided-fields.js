(function($){
  $.fn.dividedFields = function(options){
    var sourceField = $(this);
    var settings = $.extend({}, $.fn.dividedFields.defaults, options);
    var fieldsObj = { };

    function init() {
      fieldsObj.values = [];

      $.each($(sourceField).val().split(","), function(index, element) {
        var values = element.split("-");
        fieldsObj.values.push({ firstValue: values.shift(), lastValue: values.shift()});
      });

      $(settings.container).append(Mustache.to_html(
          $(settings.fieldsTemplate).html(),
          fieldsObj,
          { fieldPartial: $(settings.fieldPartial).html() }
      ));

      $.each($(settings.inputConainter, settings.container), function(index, element) {
        settings.afterCreate.call(this, element);
      });
    };

    function generateSource() {
      var source = "";
      $.each($("> div", settings.container), function(index, element) {
        var range = $(".first input", element).val() + "-" + $(".last input", element).val();
        source += (range + ",");
      });
      return source.substring(0, source.length - 1);
    };

    $("body").on("click", settings.addBtn, function(event) {
      event.preventDefault();
      var element = $(Mustache.to_html($(settings.fieldPartial).html())).appendTo(settings.container);
      settings.afterCreate.call(this, element);
    });

    $(settings.container).on("change", "input", function(event) {
      $(sourceField).val(generateSource());
    });

    $(settings.container).on("click", settings.removeBtn, function(event) {
      event.preventDefault();
      $(this).parents(settings.inputConainter).remove();
      $(sourceField).val(generateSource());
    });

    init();
  };

  $.fn.dividedFields.defaults = {
    rangeCharacter: "-",
    newFieldCharacter: ",",
    afterCreate: function(element) { }
  };
}(jQuery));

