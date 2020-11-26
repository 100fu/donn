var $JsonObject = JsonObject = function (params) {
    // mono.PropertyChangeDispatcher.call(this);
     params = params || {};
     this.id = params.id 
     this.name = params.name;
    
}

var a=$.extend(JsonObject,{

    getId: function () {
        return this.id;
    },
})

var aa = new JsonObject();
aa.getid();

