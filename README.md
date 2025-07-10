# cj-odoo
json-rpc connection for odoo

## Methods
1. odoo.login()
2. odoo.count(object, ...args)
3. odoo.create(object, ...args)
4. odoo.search(object, ...args)
5. odoo.searchRead(object, ...args)
6. odoo.read(object, ...args)
7. odoo.update(object, ...args)
8. odoo.delete(object, ...args)

## Installation
```
npm i @customerjourney/cj-odoo
```
## Configuration
```json
{
    "odoo":{
        "host":"https://url",
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
- [CustomerJourneyJS project](https://customerjourney.ninja/).
- [cj-odoo](https://customerjourney.ninja/documentation/odoo/odoo-client/).
- [Get started](customerjourney.ninja/getting-started/).
## License
bj-odoo is [GPL-3.0-or-later](./LICENSE).
