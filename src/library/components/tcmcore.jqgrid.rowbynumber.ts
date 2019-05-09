//import $ from 'jquery/dist/jquery';
declare var $: any;
$.jgrid.extend({
    getGridRowByNumber: function (rownumber) {
        var row;
        this.each(function () {
            try {
                var i = this.rows.length;
                while (i--) {
                    if (rownumber.toString() == this.rows[i].rowIndex) {
                        row = this.rows[i];
                        break;
                    }
                }
            } catch (e) {
                row = $(this.grid.bDiv).find("#" + $.jgrid.jqID(rownumber));
            }
        });
        return row;
    },
});