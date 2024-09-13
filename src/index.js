const amd = $.fn.select2.amd;

amd.define('custom-results-adapter',
  ['select2/utils', 'select2/results'], function (Utils, Results) {

    function ResultsAdapter($element, options, dataAdapter) {
      ResultsAdapter.__super__.constructor.call(this, $element, options, dataAdapter);
    }

    Utils.Extend(ResultsAdapter, Results);

    Results.prototype.getDefaultOptions = function () {
      const options = [];

      const showSelected = this.options.get('showSelected', false);
      const showPlaceholder = this.options.get('showPlaceholder', false);

      const placeholder = this.placeholder;

      if (placeholder && showPlaceholder) {
        var option = this.option(placeholder);
        options.push(option);
      }


      if (showSelected) {


        const self = this;

        this.data.current(function (selected) {
          selected.forEach(function ({ id, text }) {

            var option = self.option({ id, text });
            options.push(option);
          });
        });

      }

      return options;
    }

    Results.prototype.clear = function () {
      this.$results.empty();
      const options = this.getDefaultOptions();

      this.$results.append(options);
    }

    Results.prototype.append = function (data) {
      this.hideLoading();

      var $options = [];
      var selectedOptions = [];


      this.data.current(function (selected) {
        selectedOptions = selected.map(function (option) {
          return option.id;
        })
      });

      if (data.results == null || data.results.length === 0) {
        if (this.$results.children().length === 0) {
          this.trigger('results:message', {
            message: 'noResults'
          });
        }

        return;
      }

      data.results = this.sort(data.results);

      for (var d = 0; d < data.results.length; d++) {
        var item = data.results[d];

        const showSelected = this.options.get('showSelected', false);
        if (selectedOptions.includes(item.id) && showSelected) {
          continue;
        }

        var $option = this.option(item);

        $options.push($option);
      }

      this.$results.append($options);
    }

    return ResultsAdapter;
  }
)