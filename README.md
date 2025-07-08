# Odin React App Templates

These templates are designed to be the minimum recommended boilerplate for creating an Odin React App for your Odin Control project.

## How to Use

The templates utilize [CookieCutter](https://www.cookiecutter.io/) for templating, which is a python package. Ensure you're running a **Python 3 Virtual Environment** with CookieCutter installed:

```bash
pip install cookiecutter
```

Then, use cookiecutter to copy the template of your choice into your project. Standard practice is for the GUI to be copied into the `/test/static` directory of an Odin Control project.

```bash
cd <project_root>/test/static
cookiecutter git+ssh://git@github.com/stfc-aeg/odin-react-template
```

Cookiecutter provides configuration parameters when creating a new project based on a template. The following are the parameters provided by these template:

| Name | Description | Default Value |
| ---- | ----------- | ------------- |
| project_name | The name of the project. | `Project Name` |
| package_name | The name of the react package that will be created. | `projectname` |
| adapter_name | The name of the adapter the GUI will connect to. This creates a default `AdapterEndpoint`, but this can be modified | `projectnameAdapter` |
| project_slug | The name of the Directory that the React app will be created in | `app` |
| endpoint_url | The URL that the Odin Control API will be available on. | `http://localhost:8889` |
| include_plotly | A boolean telling Cookiecutter if it should include the plotly libraries in the dependencies | `false` |

Once the template has created your local project, be sure to install the dependencies before trying to run it:

```bash
cd <project_slug>
npm install # this step may take a minute or two to install all the dependencies
```

## Testing your App

Run `npm run dev` within the application's directory to run the development server version of your Application. This will monitor changes made to the files and automatically reload when things change.

This will also enable React's [Strict Mode](https://react.dev/reference/react/StrictMode), which tests components to find bugs. You may notice some Effects are run twice when they first load. This is a normal part of `Strict Mode` and is done to test for unexpected side effects.

## Building your App

Run `npm run build` within the application's directory to compile the application into a `dist` directory. This directory can then be referenced as a static website by Odin Control.

> :warning: **Warning:** if using Typescript, the build will fail if you have any unused variables or imports. This behaviour can be removed by editing `tsconfig.app.json` and `tsconfig.node.json`, but it is recommended to keep these linting options active to help catch errors.

## Further Information
Please see the [Odin React Wiki](https://github.com/stfc-aeg/odin-react/wiki) for additional information about how to use the components.
