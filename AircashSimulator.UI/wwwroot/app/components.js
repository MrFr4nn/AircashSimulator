app.component('datePicker', {
    template: `<p class="input-group" ng-class="{'has-error': (!$ctrl.date && !$ctrl.isOptional)}">
                        <span class= "input-group-btn" >
                            <button type="button" class="btn btn-default" ng-click="$ctrl.open($event)"><i class="fa fa-calendar"></i></button>
                        </span>
                        <input placeholder="{{$ctrl.format}}" ng-model="$ctrl.date" ng-change="$ctrl.setDate()" type="text" class="form-control" uib-datepicker-popup="{{$ctrl.format}}" max-date="$ctrl.maxDate" is-open="$ctrl.isOpened" datepicker-options="$ctrl.dateOptions" close-text="Close" ng-required="!$ctrl.isOptional"/>
                  </p >`,
    bindings: {
        out: '<',
        date: '<',
        obj: '<',
        isOptional: '<',
        maxDate: '<'
    },
    controller: function () {
        var $ctrl = this;

        this.dateOptions = {
            startingDay: 1
        };

        this.format = 'yyyy-MM-dd';
        this.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.isOpened = true;
        };

        this.setDate = function () {
            this.out(this.date, this.obj);
        };
    }
});
app.component('phoneNumberInput', {
    template: `<div class="mb-2 input-group">
                    <select ng-change="$ctrl.onInputChanged()" name="country" class= "form-control form-control-lg p-0 text-center" style="border-radius: 5px !important;"
                            ng-options="item.country for item in $ctrl.countries"
                            ng-model="$ctrl.selectedCountry"  ng-required="true" >
                    </select >
                    <span class="input-group-addon" style="visibility: hidden"></span>
                    <input ng-model="$ctrl.selectedCountry.code" class="form-control form-control-lg p-0 text-center" name="countryCode" ng-disabled="true" style="border-radius: 5px 0px 0px 5px !important;">
                    <input ng-change="$ctrl.onInputChanged()" ng-model="$ctrl.phonenumber" class="form-control form-control-lg w-50" name="phone" type="number" placeholder="{{translationsCashier.cashier_phone_number_input_label}}"  ng-required="true">
                </div>`,
    bindings: {
        output: "=",
    },
    controller: function () {
        var $ctrl = this;

        this.countries = [{ country: "AT", code: "+43" }, { country: "BE", code: "+32" }, { country: "BG", code: "+359" }, { country: "HR", code: "+385" },
        { country: "CY", code: "+357" }, { country: "CZ", code: "+420" }, { country: "DK", code: "+45" }, { country: "EE", code: "+372" }, { country: "FI", code: "+358" },
        { country: "FR", code: "+33" }, { country: "DE", code: "+49" }, { country: "GR", code: "+30" }, { country: "HU", code: "+36" }, { country: "IS", code: "+354" },
        { country: "IE", code: "+353" }, { country: "IT", code: "+39" }, { country: "LV", code: "+371" }, { country: "LI", code: "+423" }, { country: "LT", code: "+370" },
        { country: "LU", code: "+352" }, { country: "MT", code: "+356" }, { country: "NL", code: "+31" }, { country: "PL", code: "+48" }, { country: "PT", code: "+351" },
        { country: "RO", code: "+40" }, { country: "SK", code: "+421" }, { country: "SI", code: "+386" }, { country: "ES", code: "+34" }, { country: "SE", code: "+46" }];
        
        this.selectedCountry = this.countries[3];

        this.onInputChanged = function () {
            this.output = (this.selectedCountry.code + "" + this.phonenumber).replace("+", "");
        };
    }

});
//jsonformatter does not work with ng-hide, replece ng-hide with ng-if
app.component('jsonformatter', {
    template: '<div class="jsonFormatter">{{$ctrl.data}}</div>',
    bindings: {
        data: '='
    },
    controller: function () {
        $ctrl = this;

        var options = {
            collapsible: false
        }

        $(document).ready(function () {
            $('.jsonFormatter').jsonFormatter(options);
        });
    }
});
app.component('countryPicker', {
    template: `<select ng-change="$ctrl.onChangedVal()" name="country" class= "form-control p-0 text-center" style="border-radius: 5px !important;"
                            ng-options="country.countryCode+'('+country.countryName+')' for country in $ctrl.countries"
                            ng-model="$ctrl.output"  ng-required="true" >
                    </select >`,
    bindings: {
        output: '=',
        defaultCountry: '<'
    },
    controller: function () {
        $ctrl = this;

        this.$onChanges = function (changes) {
            if (changes.defaultCountry.currentValue) {
                this.output = this.countries.find(x => x.countryCode == changes.defaultCountry.currentValue);
                this.defaultCountry = "";
            }
        };

        this.$onInit = function () {
            this.countries = [
                { countryCode: "AT", countryName: "Austria" }, { countryCode: "BE", countryName: "Belgium" }, { countryCode: "BG", countryName: "Bulgaria" },
                { countryCode: "HR", countryName: "Croatia" }, { countryCode: "CY", countryName: "Cyprus" }, { countryCode: "CZ", countryName: "Czech Republic" },
                { countryCode: "DK", countryName: "Denmark" }, { countryCode: "EE", countryName: "Estonia" }, { countryCode: "FI", countryName: "Finland" },
                { countryCode: "FR", countryName: "France" }, { countryCode: "DE", countryName: "Germany" }, { countryCode: "GR", countryName: "Greece" },
                { countryCode: "HU", countryName: "Hungary" }, { countryCode: "IS", countryName: "Iceland" }, { countryCode: "IE", countryName: "Ireland" },
                { countryCode: "IT", countryName: "Italy" }, { countryCode: "LV", countryName: "Latvia" }, { countryCode: "LI", countryName: "Liechtenstein" },
                { countryCode: "LT", countryName: "Lithuania" }, { countryCode: "LU", countryName: "Luxembourg" }, { countryCode: "MT", countryName: "Malta" },
                { countryCode: "NL", countryName: "Netherlands" }, { countryCode: "PL", countryName: "Poland" }, { countryCode: "SE", countryName: "Sweden" },
                { countryCode: "PT", countryName: "Portugal" }, { countryCode: "RO", countryName: "Romania" }, { countryCode: "SK", countryName: "Slovakia" },
                { countryCode: "SI", countryName: "Slovenia" }, { countryCode: "ES", countryName: "Spain" }, { countryCode: "UA", countryName: "Ukraine" },
                { countryCode: "BA", countryName: "Bosnia and Herzegovina" }, { countryCode: "RS", countryName: "Serbia" }
            ];

            this.output = this.countries[3];

            this.onChangedVal = function () {
                this.defaultCountry = "";
            };
        }

    }
});
app.component('currencyidPicker', {
    template: `<select ng-change="$ctrl.onChangedVal()" name="country" class= "form-control p-0 text-center" style="border-radius: 5px !important;"
                            ng-options="currency.name+'('+currency.code+')' for currency in $ctrl.currencies"
                            ng-model="$ctrl.output"  ng-required="true" >
                    </select >`,
    bindings: {
        output: '=',
        defaultCurrency: '<'
    },
    controller: function () {
        $ctrl = this;

        this.$onChanges = function (changes) {
            if (changes.defaultCurrency.currentValue) {
                this.output = this.currencies.find(x => x.code == changes.defaultCurrency.currentValue);
                this.defaultCurrency = 0;
            }
        };

        this.$onInit = function () {
            this.currencies = [
                { name: "HRK", code: 191 },
                { name: "EUR", code: 978 },
                { name: "BAM", code: 977 },
                { name: "CHF", code: 756 },
                { name: "RON", code: 946 }
            ];

            this.output = this.currencies[1];

            this.onChangedVal = function () {
                this.defaultCurrency = 0;
            };
        }

    }
});