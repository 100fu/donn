jQuery.fn.kendoVinciValidator = function () {
    this.data("kendoVinciValidator", new EAP.UI.VinciValidator());

    return this;
};
jQuery.fn.kendoVinciWindow = function () {
    this.data("kendoVinciWindow", new  EAP.UI.VinciWindow());

    return this;
};
jQuery.fn.kendoVinciButtonGroup = function () {
    this.data("kendoVinciButtonGroup", new EAP.UI.VinciButtonGroup());

    return this;
};

jQuery.fn.kendoVinciDatePicker = function () {
    this.data("kendoVinciDatePicker", new EAP.UI.VinciDatePicker());

    return this;
};
jQuery.fn.kendoVinciDateTimePicker = function () {
    this.data("kendoVinciDateTimePicker", new EAP.UI.VinciDateTimePicker());

    return this;
};
jQuery.fn.kendoVinciCalendar = function () {
    this.data("kendoVinciCalendar", new EAP.UI.VinciCalendar());

    return this;
};
jQuery.fn.kendoVinciNumericTextBox = function () {
    this.data("kendoVinciCalendar", new EAP.UI.VinciNumericTextBox());

    return this;
};
jQuery.fn.kendoVinciAutoComplete = function () {
    this.data("kendoVinciAutoComplete", new EAP.UI.VinciAutoComplete());

    return this;
};
jQuery.fn.kendoVinciSearchBox = function () {
    this.data("kendoVinciSearchBox", new EAP.UI.VinciSearchBox());

    return this;
};
jQuery.fn.kendoVinciToolBar = function () {
    this.data("kendoVinciToolBar", new EAP.UI.VinciToolBar());

    return this;
};
intellisense.annotate(jQuery.fn, {
    kendoVinciValidator: function (VinciValidatorOptions) { },
    kendoVinciWindow: function (VinciWindowOptions) { },
    kendoVinciButtonGroup: function (VinciButtonGroupOptions) { },
    kendoVinciDatePicker: function (VinciDatePickerOptions) { },
    kendoVinciDateTimePicker: function (VinciDateTimePickerOptions) { },
    kendoVinciCalendar: function (kendoVinciCalendarOptions) { },
    kendoVinciNumericTextBox: function (kendoVinciNumericTextBoxOptions) { },
    kendoVinciAutoComplete: function (kendoVinciAutoCompleteOptions) { },
    kendoVinciSearchBox: function (kendoVinciSearchBoxOptions) { },
    kendoVinciToolBar: function (kendoVinciSearchBoxOptions) { }
})