define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LNode = (function () {
        function LNode() {
        }
        return LNode;
    }());
    exports.LNode = LNode;
    var LinkList = (function () {
        function LinkList() {
            this.HeadNode = new LNode();
            this.HeadNode.Data = 0;
        }
        LinkList.prototype.Count = function () {
            return this.HeadNode.Data;
        };
        LinkList.prototype.Add = function (node) {
            if (!node)
                return;
            if (!this.EndHandle)
                this.HeadNode.Next = this.EndHandle = node;
            else {
                this.EndHandle.Next = node;
                this.EndHandle = node;
            }
            this.HeadNode.Data++;
            return node;
        };
        LinkList.prototype.Get_ByFn = function (fn) {
            if (!fn)
                return;
            var node = this.HeadNode, preNode = node, result = [];
            while (node = node.Next) {
                if (fn(node)) {
                    result.push(node);
                    preNode.Next = node.Next;
                }
                preNode = node;
            }
            return result;
        };
        LinkList.prototype.Get_ByData = function (data) {
            if (!data)
                return;
            var node = this.HeadNode;
            while (node = node.Next)
                if (node.Data == data)
                    return node;
        };
        LinkList.prototype.Del_ByData = function (data) {
            if (!data)
                return;
            var node = this.HeadNode, preNode = node;
            while (node = node.Next) {
                if (node.Data == data)
                    break;
                preNode = node;
            }
            preNode.Next = node.Next;
            this.HeadNode.Data--;
            return node;
        };
        LinkList.prototype.Del_ByFn = function (fn) {
            if (!fn)
                return;
            var node = this.HeadNode, preNode = node, result = [];
            while (node = node.Next) {
                if (fn(node)) {
                    result.push(node);
                    preNode.Next = node.Next;
                    this.HeadNode.Data--;
                }
                preNode = node;
            }
            return result;
        };
        /**
         * return index of special data beginning from 0
         * @param data
         */
        LinkList.prototype.IndexOf = function (data) {
            if (!data)
                return;
            var node = this.HeadNode, i = -1;
            while (node = node.Next) {
                i++;
                if (node.Data == data)
                    return i;
            }
            return -1;
        };
        LinkList.prototype.Insert = function (index, inNode) {
            if (index === undefined || !inNode)
                return;
            var node = this.HeadNode, preNode = node, i = -1;
            while (node = node.Next) {
                if (++i == index) {
                    preNode.Next = inNode;
                    inNode.Next = node;
                    return inNode;
                }
                preNode = node;
            }
        };
        LinkList.prototype.ForEach = function (fn) {
            if (!fn)
                return;
            var node = this.HeadNode, result = [];
            while (node = node.Next) {
                fn(node);
            }
        };
        return LinkList;
    }());
    exports.LinkList = LinkList;
});
