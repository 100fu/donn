mono.edit.JsonBox = function () {
  	this._dataList = new Array();
  	this._dataMap = {};
    
    // this._dataBoxChangeDispatcher = new TGL.EventDispatcher();
    // this._dataPropertyChangeDispatcher = new TGL.EventDispatcher();
}

mono.extend(mono.edit.JsonBox,Object,{
	  add : function(data){
        if (!data) {
            return;
        }
        if (arguments.length === 1) {
            index = -1;
        }
        var id = data.getId();
        if (this._dataMap.hasOwnProperty(id)){
            throw "Data with ID '" + id + "' already exists";
        }
        this._dataList.add(data);
        this._dataMap[id] = data;
        // this._dataBoxChangeDispatcher.fire({
        //     kind : 'add',
        //     data : data,
        //     source : this
        // });
        // data.addPropertyChangeListener(this.handleDataPropertyChange, this);
	  },

    contains : function(data) {
        if (data) {
            return this._dataMap[data.getId()] === data;
        }
        return false;
    },

	  remove : function(data){
        if (!data) {
            return;
        }
        this._dataList.remove(data);
        var id = data.getId();
        delete this._dataMap[id];

        // this._dataBoxChangeDispatcher.fire({
        //     kind : 'remove',
        //     data : data,
        //     source : this
        // });
       // data.removePropertyChangeListener(this.handleDataPropertyChange, this);
	  },

  	getDataById : function(id){
        return this._dataMap[id];
  	},

	  removeById : function(id){
        var data = this.getDataById(id);
        this.remove(data);
	  },

    getDatas : function(){
        return this._dataList;
    },

    clear : function(l) {
        if (this._dataList.size() > 0) {
            var datas = this._dataList.toList();
            // datas.forEach(function(data) {
            //     data.removePropertyChangeListener(this.handleDataPropertyChange, this);
            // }, this);
            this._dataList.clear();
            this._dataMap = {};
            // this._dataBoxChangeDispatcher.fire({
            //     kind : 'clear',
            //     datas : datas
            // });

        }
    },

    toJson : function(filter){
       var jsonObject = [];
       var datas = this._dataList;
       // return JSON.stringify(array);
       datas.forEach(function(data){

            var dataObject = {
              'type' : data.type,
            };
           data.serializeJson(data, dataObject);
           if(!filter || filter(data)){
               jsonObject.push(dataObject);
           }
       });
       return JSON.stringify(jsonObject);
    },

    // fromJson : function(json){
    //    var datas = JSON.parse(json);

    //    for (var i = 0; i < datas.length; i++) {
    //       var dataObject = datas[i];
    //       var type = "mono.edit.data.JsonObject";
    //       if (dataObject.id != null) {
    //         // remove old data
    //         if (dataObject.action === "remove") {
    //           this.removeById(dataObject.id);
    //           continue;
    //         }
    //         // update old data
    //         data = this.getDataById(dataObject.id);
    //         // create new data
    //         if (!data) {
    //           data = TGL.newInstance(type,dataObject.id);
    //         }
    //       } else {
    //         var parameters = {};
    //         data = TGL.newInstance(type);
    //       }
    //       data.deserializeJson(data, dataObject);
    //       this.add(data);
    //     }
    // },

    // handleDataPropertyChange : function(e) {
    //     var data = e.source;
    //     this.onDataPropertyChanged(data, e);
    //     this._dataPropertyChangeDispatcher.fire(e);
    // },

    // onDataPropertyChanged : function(data, e) {
    // },

    // addDataBoxChangeListener : function(listener, scope, ahead) {
    //     this._dataBoxChangeDispatcher.add(listener, scope, ahead);
    // },
    // removeDataBoxChangeListener : function(listener, scope) {
    //     this._dataBoxChangeDispatcher.remove(listener, scope);
    // },

    // addDataPropertyChangeListener : function(listener, scope, ahead) {
    //     this._dataPropertyChangeDispatcher.add(listener, scope, ahead);
    // },
    // removeDataPropertyChangeListener : function(listener, scope) {
    //     this._dataPropertyChangeDispatcher.remove(listener, scope);
    // },
});