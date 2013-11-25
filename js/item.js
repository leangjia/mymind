MM.Item = function() {
	this._dom = {
		node: document.createElement(this._nodeName),
		content: document.createElement("span"),
		children: document.createElement("ul")
	}
	this._dom.node.classList.add("item");
	this._dom.content.classList.add("text");
	this._dom.children.classList.add("children");
	this._children = [];
	this._parent = null;
	this._dom.node.appendChild(this._dom.content);
	
	this._oldText = "";
}
MM.Item.prototype._nodeName = "li";

MM.Item.prototype.setText = function(text) {
	this._dom.content.innerHTML = text;
	return this;
}

MM.Item.prototype.getText = function() {
	return this._dom.content.innerHTML;
}

MM.Item.prototype.getChildren = function() {
	return this._children;
}

MM.Item.prototype.getNode = function() {
	return this._dom.node;
}

MM.Item.prototype.getParent = function() {
	return this._parent;
}

MM.Item.prototype.getSide = function() {
	var node = this;

	while (node.getParent()) { 
		var parent = node.getParent();
		if (!parent.getParent()) {
			return parent.getSide(node);
		}
		node = parent;
	}
}

MM.Item.prototype.setParent = function(parent) {
	this._parent = parent;
	return this;
}

MM.Item.prototype.insertChild = function(child, index) {
	if (arguments.length == 1) { index = this._children.length; }
	if (!this._children.length) {
		this._dom.node.appendChild(this._dom.children);
	}
	
	var next = null;
	if (index < this._children.length) { next = this._children[index].getNode(); }
	this._dom.children.insertBefore(child.getNode(), next);
	this._children.splice(index, 0, child);
	
	child.setParent(this);
	return child;
}

MM.Item.prototype.removeChild = function(child) {
	var index = this._children.indexOf(child);
	this._children.splice(index, 1);
	var node = child.getNode();
	node.parentNode.removeChild(node);
	
	child.setParent(null);
	
	if (!this._children.length) {
		this._dom.children.parentNode.removeChild(this._dom.children);
	}
	
	return child;
}

MM.Item.prototype.startEditing = function() {
	this._oldText = this.getText();
	this._dom.content.contentEditable = true;
	this._dom.content.focus();
	return this;
}

MM.Item.prototype.stopEditing = function() {
	this._dom.content.blur();
	this._dom.content.contentEditable = false;
	var result = this._dom.content.innerHTML;
	this._dom.content.innerHTML = this._oldText;
	this._oldText = "";
	return result;
}