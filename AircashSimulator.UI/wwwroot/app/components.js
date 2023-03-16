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
                    <input ng-change="$ctrl.onInputChanged()" ng-model="$ctrl.phonenumber" class="form-control form-control-lg w-50" name="phone" type="number" placeholder="Enter phone number"  ng-required="true">
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