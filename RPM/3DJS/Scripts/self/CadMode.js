// var sys = sys || {};
var $CadMode = sys.CadMode = function (params,index) {
    params = params || {};
    this.id=index;
    this.SubClasses=params.properties.SubClasses;
    this.Text=params.properties.Text;
    this.geometryType=params.geometry.Type;
    if(this.geometryType.startsWith("GeometryCollection"))
    {        
        this.coordinates=params.geometry.geometries;
    }else
    { this.coordinates=params.geometry.coordinates;}  

}