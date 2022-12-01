app.component('loadMore', {
    template: `<center>
                    <p class="input-group" style="width:180px">
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
            console.log(this.pageSize);
            this.out(this.pageSize);
        };
    }
});