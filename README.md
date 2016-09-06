# propathink

### rethinkdb client
rethinkdb client focused on maintainable code organization. 
Store rethinkdb request logic in modular way by labelling and storing requests in plugins/modules. 
In theory, propathink's architecture is extendable allowing you to add plugins at will 
in order to better maintain and manage all db request logic. 

#### configuration centric plugin design

Project utilizes a manifest file for each project. The manifest configures the 
database connection and all request plugins to be loaded in a project. Those who are familiar
with [hapijs/glue](https://github.com/hapijs/glue) will be comfortable with this design.

#### provisions rethink connection

Every request built using a propathink plugin is provisioned with and database connection
before the request is executed. 
<br/>
```
this._connection.db     // configured database name from the manifest file.
this.conn               // rethinkdb connection object
```
<br/>

#### joi validation

propathink imitates hapi's use of [joi](https://github.com/hapijs/joi) to validate parameters set in a request.
Sample request below:

```
{
    name: 'testTwo',
    comment: 'testTwo documentation here.',
    validate: {
        0: { // parameter at arguments[0] to be validated.
            username: Joi.string().min(3).max(6),
            password: Joi.string().min(3).max(8)
        }
    },
    handler: function (user, next, callback) {

             return callback(null, 'test two result', next);
    }
}
```

Note: The object key determines which parameter will be evaluated by joi in the request.
The above valdation configuration applies the joi test to the first parameter in the handler.

#### request lifecycle

propathink again imitates hapijs by utilizing a request lifecyle for all request logic.
The lifecyle has four steps: pre, validate, request, after.
* *pre* generates the connection for the request. 
* *validate* applies joi validations to appropriate parameters in requests. 
* *request* executes the request built in the handle.
* *after* runs after everything else is completed.


#### constructing the handle

The handle element in a propathink request object must have the last two 
parameters in order for the request lifecycle to work (next & callback):
*next* is executed at the end of each step in the life cycle and needs to 
be passed to the callback in the handle. then, next() is executed in the  callback code
when callback logic is completed.  this ensures the *after* step of the lifecyle
is really executed "after" the request is completed.  plus, it allows for monitoring of 
performance and quantity of code execution.   

#### influence of hapijs design

propathink is highly influenced by hapijs architecture. After studying hapi's architecture
decided to build propathink using a plugin architecture in order to better maintain 
database request logic and all the other good stuff propathink does. 
