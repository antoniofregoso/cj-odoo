# bj-odoo
json-rpc connection for odoo
## Sponsors
[<img src="https://www.conference.com.mx/web/image/website/3/logo/Conference?unique=cb769b7">](https://www.conference.com.mx/comercializacion-digital)

## Methods
1. login()
2. count(object, ...args)
3. create(object, ...args)
4. search(object, ...args)
5. searchRead(object, ...args)
6. read(object, ...args)
7. update(object, ...args)
8. delete(object, ...args)

## Installation
```
npm i @buyerjourney/bj-odoo
```
## Configuration
```json
{
    "odoo":{
        "host":"http://url",
        "db":"odooDB",
        "port":8069,
        "username":"user",
        "password":"apiKey",
        "endpoint":"/jsonrpc"
    }
}
```
## Usage
```javascript
import { OdooClient } from "@buyerjourney/bj-odoo";
import config from '/.env/conf.json' assert { type: 'json' };

async function createLead(props={}){
    try {
        let odoo = new OdooClient(config.odoo)
        let uid = await odoo.login();
        crmLead = {
            name:props.subject,
            contact_name:props.name,
            function: props.function,
            partner_name:props.company,
            email_from:props.email,
            phone:props.phone,
            description:props.description
         }
        let lead = await odoo.create('crm.lead',crmLead);
    }catch (error){
        console.error('Error:', error);
    }
}
```

## Documentation 
- [BuyerJourneyJS project](https://buyerjourney.ninja/).
- [bj-components](https://buyerjourney.ninja/odoo).
- [Get started](https://buyerjourney.ninja/get-started).
## License
bj-odoo is [GPL-3.0-or-later](./LICENSE).
