var Dialog = function(title, buttons, params){
	var title = title || 'Dialog';
	this.dialog = $('<div id="export-message" title = "'+ title +'"></div>');
	this.content = $('<div class="inner" ></div>');
	this.dialog.append(this.content);
	this.buttons = buttons;
	this.params = params;
}


Dialog.prototype.setData = function(data){
	if(typeof(data) === "string"){
		this.content.html(data);
	}else{
		this.content.append(data);
	}
	
}

Dialog.prototype.getView = function(){
	return this.dialog;
}

Dialog.prototype.init = function(){
	if(!this.buttons){
		this.buttons = {
			// Ok: function() {
			// 	$( this ).dialog( "close" );
			// },
			确定: function() {
				$( this ).dialog( "close" );
			},
		}
	}
	this.dialog.dialog({
		height: 300,
		width: 350,
		autoOpen: false,
		show: {
			effect: "fade",
		},
		hide: {
			effect: "fade",
		},
		modal: true,
		buttons: this.buttons,
	});
}

Dialog.prototype.show = function(){
	this.dialog.dialog( "open" );
}