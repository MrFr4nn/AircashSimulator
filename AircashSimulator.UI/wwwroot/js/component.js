app.component('loadMore', {
    template: `<center>
                    <p class="input-group" style="width:180px" ng-if="$ctrl.totalLoaded >= 10">
                        <span class="input-group-btn">
                            <button ng-click="$ctrl.load()" class="btn btn-default"><i class="fa fa-angle-double-down" aria-hidden="true"></i> Load more</button>
                        </span>
                    </p>
                </center>`,
    bindings: {
        out: '<',
        totalLoaded: '<'
    },
    controller: function () {
        this.pageSize = 10;
        this.load = function () {
            this.out(this.pageSize);
        };
    }
});