
import { JQGridUtilities } from './tcmcore.jqgrid.Utilities';

export var DatePickerSettings = {
    //format: CurrentDateFormatPHP,
    timepicker: false,
    //formatDate: CurrentDateFormatPHP,
    enterLikeTab: false,
    dayOfWeekStart: 1,
    showApplyButton: true
}

export var DateTimePickerSettings = {
    //format: CurrentDateTimePHP,
    formatTime: 'H:i',
    //formatDate: CurrentDateFormatPHP,
    enterLikeTab: false,
    step: 30,
    dayOfWeekStart: 1,
    showApplyButton: true
}

export var searchDateTmpl = {
    align: "center", sorttype: 'date', formatter: 'date', width: 150,
    search: true, searchOperators: true, formatoptions: { srcformat: "ISO8601Long", newformat: 'Y-m-d H:i' },
    searchoptions: {
        searchOperMenu: true,
        dataInit: function (element) {
            var merge = $.extend(DatePickerSettings, { format: this.p.currentDateFormatPHP, formatDate: this.p.currentDateFormatPHP });
            $(element).datetimepicker(merge);
        },
        // show search options
        sopt: ["ge", "le", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to							
    }
}

export var searchEditDateTmpl = $.extend(true, {}, searchDateTmpl, {
    editable: true,
    editoptions: {
        size: 20,
        dataInit: function (element) {
            var merge = $.extend(DatePickerSettings, { format: this.p.currentDateFormatPHP, formatDate: this.p.currentDateFormatPHP });
            $(element).datetimepicker(merge);
        }
    }
});


export var searchDateTimeTmpl = {
    align: "center", sorttype: 'date', formatter: 'date', width: 150,
    search: true, searchOperators: true, formatoptions: { srcformat: "ISO8601Long", newformat: 'Y-m-d H:i' },
    searchoptions: {        
        searchOperMenu: true,
        // dataInit is the client-side event that fires upon initializing the toolbar search field for a column
        // use it to place a third party control to customize the toolbar
        dataInit: function (element) {
            var merge = $.extend(DateTimePickerSettings, { format: this.p.currentDateTimePHP, formatDate: this.p.currentDateFormatPHP });
            $(element).datetimepicker(merge);
        },
        // show search options
        sopt: ["ge", "le"] // ge = greater or equal to, le = less or equal to, eq = equal to							
    }
}

export var searchEditDateTimeTmpl = $.extend(true, {}, searchDateTimeTmpl, {
    editable: true,
    editoptions: {
        size: 20,
        dataInit: function (element) {
            var merge = $.extend(DateTimePickerSettings, { format: this.p.currentDateTimePHP, formatDate: this.p.currentDateTimePHP });
            $(element).datetimepicker(merge);
        }
    }
});

