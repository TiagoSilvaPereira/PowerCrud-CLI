PowerCRUD
=========

A small and powerful library providing CRUD generation for all frameworks that I and you can write "Plugs"

## Installation

    npm install powercrud -g

## Usage

First, to use PowerCRUD, you need to create a JSON file that represents your project:

```javascript      
{
  "name": "Blog Admin Example",
  "output_directory": "C:/Foo/Bar", //The directory that the project will be generated
  "database_plugs": [
    {
      "plug": "mysql", // The plug used to generate the Database (at this moment, only mysql)
      "name": "blog_admin", // The database name
      "connection": { // Connection data
        "host": "localhost",
        "port": "3306",
        "user": "root",
        "password": ""
      }
    }
  ],

  // Connectors are Plugs that generate the backend code, direct connected to the Database.
  // Can be of the types:
  // api - is a Plug that generates a Restful API
  "connectors_plugs": [
    {
      "type": "api",
      "plug": "api-php-slim"
    }
  ],
  // This plugs creates a SPA application. Is recommended to use this plug with a API plug. Use only one plug 
  // in this section at this moment
  "spa_plugs": [
    {
      "plug": "spa-angular1-bootstrap"
    }
  ],
  "data": {
    "objects": [ // Objects. Each object generates a table in a relational database
      {
        "name": "posts",
        "name_singular": "post",
        "child_of": [ // Objects that this object is child. Create foreign relations in the database and 
          "users"     // a Select in the HTML
        ],
        "structure": [ // Structure of this object, each is a field
          {
            "name": "title", // Name of this field
            "type": "text",  // Type: can be text, password, integer, float and file
            "component": "text", // At this moment can be text, textarea, number, file-image and file
            "size": "128", // Size of this field (Database and HTML). Can be numeric or "no-limit"
            "required": true, // If this field is required
            "in_list": true // If this field is show in the listage
          },
          {
            "name": "content",
            "type": "text",
            "component": "textarea",
            "size": "no-limit",
            "required": true
          },
          {
            "name": "image",
            "type": "file",
            "component": "file-image",
            "accept": "image/*"
          }
        ]
      },
      {
        "name": "users",
        "name_singular": "user",
        "child_of": null,
        "structure": [
          {
            "name": "name",
            "type": "text",
            "component": "text",
            "size": "128",
            "required": true,
            "in_list": true
          }
        ]
      }
    ]
  }
}
```

Before run the power crud, you need install each Plug that you need to create the project. The name of the npm plug modules are the same that you describe in the JSON project file, but preceeded with "powercrud-";

Example:

If in your SPA Plugs Section you specify:

```javascript    
"spa_plugs": [
    {
      "plug": "spa-angular1-bootstrap"
    }
  ],
```

You need to install the powercrud-spa-angular1-bootstrap plug, that is a NPM module. Install it globally:

    npm install -g powercrud-spa-angular1-bootstrap

The unique exception is the powercrud-mysql plug. It is native, you don't need to install it.

So finally, you can run
    powercrud name_project.json

This command will generate all the project in the specified "output_directory".

## Available Plugs

At this moment, the available plugs are:
* powercrud-mysql (Generate the mysql database, is Native, you cannot install it)
* powercrud-spa-angular1-bootstrap (Used to generate a Angular 1 + Bootstrap SPA App)
* powercrud-api-php-slim (Used to generate a API with PHP and Slim Framework)

I'll create more Plugs coming soon. This only the first version.

## Creating your own plugs
  I'll create a tutorial "How to create PowerCRUD Plugs". If you are curious, and want to try how to make the plugs,
  please see the "powercrud-spa-angular1-bootstrap". This is the last plug I have created and use all of the tools of Powercrud-PlugUtils.


## Contributing

You can create other plugs, increase the code (because I'm starting with nodejs), send PR's and issues.

## Release History

* 0.1.4 Initial release