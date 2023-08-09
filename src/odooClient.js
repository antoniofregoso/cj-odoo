import { Client } from "./jsonRPC";

class OdooClient{

    #client;

    constructor(host, db, username, password, port){
        this.host = host;
        this.port = port;
        this.url = port===undefined|| port===80?`${host}/jsonrpc/`:`${host}:${port}/jsonrpc/`;
        this.db = db;
        this.uid = 0;
        this.username = username;
        this.password = password;
        this.#client = new Client(this.url);
    }

    async login(){
        try {
            let uid = await this.#client.call("common","login", this.db, this.username, this.password)
            if (uid===false){
                console.error("Invalid Credentials");
            }else{
                return uid;
            }
        }catch(error) {
            console.error(error);
          }        
        
    }

    async count(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "search_count", args);
        return res;
    }

    async create(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "create", args);
        return res;
    }

    async search(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "search", args);
        return res;
    }


    async searchRead(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "search_read", args);
        return res;
    }

    async read(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "read", args);
        return res;
    }

    async update(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "create", args);
        return res;
    }

    async delete(object, ...args){
        let res = await this.#client.call("object","execute", this.db, this.uid, this.password, object, "create", args);
        return res;
    }

}
