import { jsonRpcClient } from "./jsonRPC";

export class OdooClient{

    client;

    constructor(props = {}){
        this.host = props.host;
        let endpoint = props.endpoint === undefined?"jsonrpc":props.endpoint
        this.url = props.port===undefined|| props?.port===80?`${props.host}/${endpoint}/`:`${props.host}:${props.port}/${endpoint}/`;
        this.db = props.db;
        this.uid = 0;
        this.username = props.username;
        this.password = props.password;
        this.client = new jsonRpcClient(this.url);
    }

    async login(){
        try {
            let uid = await this.client.call("common","login", this.db, this.username, this.password)
            if (uid===false){
                console.error("Invalid Credentials");
            }else{
                this.uid = uid
                return this.uid;
            }
        }catch(error) {
            console.error(error);
          }        
        
    }

    async count(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "search_count", args);
        return res;
    }

    async create(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "create", args);
        return res;
    }

    async search(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "search", args);
        return res;
    }


    async searchRead(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "search_read", args);
        return res;
    }

    async read(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "read", args);
        return res;
    }


    async update(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "write", id, args);
        return res;
    }

    async delete(object, ...args){
        let res = await this.client.call("object","execute", this.db, this.uid, this.password, object, "unlink", args);
        return res;
    }

}
