export class LNode {
    Data: any
    Next: LNode
}
export class LinkList<T extends LNode> {
    public Id: string
    private HeadNode: LNode = new LNode()
    private EndHandle: LNode
    constructor() {
        this.HeadNode.Data = 0;
    }
    public Count(): number {
        return this.HeadNode.Data as number;
    }
    public Add(node: T): T {
        if (!node) return;
        if (!this.EndHandle)
            this.HeadNode.Next = this.EndHandle = node;
        else {
            this.EndHandle.Next = node;
            this.EndHandle = node;
        }
        this.HeadNode.Data++;
        return node;
    }
    public Get_ByFn(fn: (node: T) => boolean): T[] {
        if (!fn) return;
        let node = this.HeadNode, preNode = node, result: T[] = [];
        while (node = node.Next) {
            if (fn(node as T)) {
                result.push(node as T);
                preNode.Next = node.Next;
            }
            preNode = node;
        }
        return result;
    }
    public Get_ByData(data: any): T {
        if (!data) return;
        let node = this.HeadNode;
        while (node = node.Next)
            if (node.Data == data) return node as T;
    }
    public Del_ByData(data: any): T {
        if (!data) return;
        let node = this.HeadNode, preNode = node;
        while (node = node.Next) {
            if (node.Data == data) break;
            preNode = node;
        }
        preNode.Next = node.Next;
        this.HeadNode.Data--;
        return node as T;
    }
    public Del_ByFn(fn: (node: T) => boolean): T[] {
        if (!fn) return;
        let node = this.HeadNode, preNode = node, result: T[] = [];
        while (node = node.Next) {
            if (fn(node as T)) {
                result.push(node as T);
                preNode.Next = node.Next;
                this.HeadNode.Data--;
            }
            preNode = node;
        }
        return result;
    }
    /**
     * return index of special data beginning from 0
     * @param data 
     */
    public IndexOf(data: any): number {
        if (!data) return;
        let node = this.HeadNode, i = -1;
        while (node = node.Next) {
            i++;
            if (node.Data == data) return i;
        }
        return -1;
    }
    public Insert(index: number, inNode: T) {
        if (index === undefined || !inNode) return;
        let node = this.HeadNode, preNode = node, i = -1;
        while (node = node.Next) {
            if (++i == index) {
                preNode.Next = inNode; inNode.Next = node as T;
                return inNode;
            }
            preNode = node;
        }
    }
    public ForEach(fn: (node: T) => void) {
        if (!fn) return;
        let node = this.HeadNode, result: T[] = [];
        while (node = node.Next) {
            fn(node as T)
        }
    }
}
