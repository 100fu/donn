var $JsonObject = mono.JsonObject = function (params) {
    // mono.PropertyChangeDispatcher.call(this);
    params = params || {};
    this.id = params.id
    this.name = params.name;
    this.type = params.type;
    this.radius = params.radius;
    this.color = params.color;
    this.width = params.width;
    this.height = params.height;
    this.depth = params.depth;
    this.translates = params.translates;
    this.translate = params.translate;
    this.rotate = params.rotate;
    this.data = params.data;
    this.positionY = params.positionY;
    this.client = params.client;
    this.children = params.children;

    this.getId= function () {
        return this.id;
    };

    this.getRadius= function () {
        return this.radius;
    };

    this.setRadius= function (radius) {
        var oldValue = this.radius;
        if (oldValue != radius) {
            this.radius = radius;
           // this.firePropertyChange("radius", oldValue, radius);
        }
    };

    this.getColor= function () {
        return this.color;
    };

    this.setColor= function (color) {
        var oldValue = this.color;
        if (oldValue != color) {
            this.color = color;
           // this.firePropertyChange("color", oldValue, color);
        }
    };

    this.getWidth= function () {
        return this.width;
    };

    this.setWidth= function (width) {
        var oldValue = this.width;
        if (oldValue != width) {
            this.width = width;
           // this.firePropertyChange("width", oldValue, width);
        }
    };

    this.getHeight= function () {
        return this.height;
    };

    this.setHeight= function (height) {
        var oldValue = this.height;
        if (oldValue != height) {
            this.height = height;
           // this.firePropertyChange("height", oldValue, height);
        }
    };

    this.getDepth= function () {
        return this.depth;
    };

    this.setDepth= function (depth) {
        var oldValue = this.depth;
        if (oldValue != depth) {
            this.depth = depth;
           // this.firePropertyChange("depth", oldValue, depth);
        }
    };

    this.getPositionY= function () {
        return this.positionY;
    };

    this.setPositionY= function (positionY) {
        var oldValue = this.positionY;
        if (oldValue != positionY) {
            this.positionY = positionY;
           // this.firePropertyChange("positionY", oldValue, positionY);
        }
    };


    this.getName= function () {
        return this.name;
    };

    this.setName= function (name) {
        var oldValue = this.name;
        if (oldValue != name) {
            this.name = name;
           // this.firePropertyChange("name", oldValue, name);
        }
    };

    this.getTranslate= function () {
        return this.translate;
    };

    this.setTranslate= function (translate) {
        var oldValue = this.translate;
        if (oldValue != translate) {
            this.translate = translate;
           // this.firePropertyChange("translate", oldValue, translate);
        }
    };

    this.getRotate= function () {
        return this.rotate;
    };

    this.setRotate= function (rotate) {
        var oldValue = this.rotate;
        if (oldValue != rotate) {
            this.rotate = rotate;
           // this.firePropertyChange("rotate", oldValue, rotate);
        }
    };

    this.getData= function () {
        return this.data;
    };

    this.setData= function (data) {
        var oldValue = this.data;
        if (oldValue != data) {
            this.data = data;
           // this.firePropertyChange("data", oldValue, data);
        }
    };

    this.getClient= function (client) {
        return this.client;
    };

    this.setClient= function (client) {
        var oldValue = this.client;
        if (oldValue != client) {
            this.client = client;
           // this.firePropertyChange("client", oldValue, client);
        }
    };

    this.getChildren= function (children) {
        return this.children;
    };

    this.setChildren= function (children) {
        var oldValue = this.children;
        if (oldValue != children) {
            this.children = children;
           // this.firePropertyChange("children", oldValue, children);
        }
    };


    this.serializeJson= function (newInstance, dataObject) {
        this.serializePropertyJson("id", newInstance, dataObject);
        this.serializePropertyJson("type", newInstance, dataObject);
        this.serializePropertyJson("name", newInstance, dataObject);
        this.serializePropertyJson("width", newInstance, dataObject);
        this.serializePropertyJson("height", newInstance, dataObject);
        this.serializePropertyJson("depth", newInstance, dataObject);
        this.serializePropertyJson("translate", newInstance, dataObject);
        this.serializePropertyJson("translates", newInstance, dataObject);
        this.serializePropertyJson("rotate", newInstance, dataObject);
        this.serializePropertyJson("data", newInstance, dataObject);
        this.serializePropertyJson("radius", newInstance, dataObject);
        this.serializePropertyJson("color", newInstance, dataObject);
        this.serializePropertyJson("positionY", newInstance, dataObject);
        this.serializePropertyJson("client", newInstance, dataObject);
        this.serializePropertyJson("children", newInstance, dataObject);
    };
    this.serializePropertyJson= function (property, newInstance, dataObject) {
        dataObject[property] = newInstance[property];
    };

    this.deserializeJson= function (newInstance, json) {
        for (var name in json) {
            this.deserializePropertyJson(newInstance, json[name], name);
        }
    };

    this.deserializePropertyJson= function (newInstance, value, property) {
        newInstance[property] = value;
    }


};

// $.extend(true, mono.JsonObject, {
// });
