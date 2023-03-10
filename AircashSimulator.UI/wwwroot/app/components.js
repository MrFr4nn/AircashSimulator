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
app.component('jsonformatter', {
    template: '<div class="jsonFormatter">{{$ctrl.data}}</div>',
    bindings: {
        data: '='
    },
    controller: function () {
        $ctrl = this;
        
        $(document).ready(function () {
            $('.jsonFormatter').jsonFormatter();
        });
    }
});