# Odin React App Templates

These templates are designed to be the minimum recommended boilerplate for creating an Odin React App for your Odin Control project.

## Recommended Usage

1. Create a new repo from this one for your GUI, by clicking the `Use This Template` button above.

2. Delete the directory containing the template you do not wish to use. Using Typescript is recommended. Rename the remaining directory to whatever you wish your application to be named

3. `cd` into the directory and run `npm install` to install the dependencies. This step may take some time, and will create the `node_modules` directory.
> :memo: **Note:** This does not install the `plotly.js` packages required to use `OdinGraph`. Should you require the graphing component, please install this package yourself:
>
>```bash
>npm install react-plotly.js plotly.js
>```

4. Create your GUI!

## Alternate Usage

If you do not want to have your GUI as a separate repo, but instead maintain it within the repo of your Detector Control project, it is recommended that you clone this repo somewhere local, and copy the template you wish to use into the `test/static` path in your Odin Control Repo. You can then follow on from step **2** above.

## Testing your App

Run `npm run dev` within the application's directory to run the development server version of your Application. This will monitor changes made to the files and automatically reload when things change.

This will also enable React's [Strict Mode](https://react.dev/reference/react/StrictMode), which tests components to find bugs. You may notice some Effects are run twice when they first load. This is a normal part of `Strict Mode` and is done to test for unexpected side effects.

## Building your App

Run `npm run build` within the application's directory to compile the application into a `dist` directory. This directory can then be referenced as a static website by Odin Control.

> :warning: **Warning:** if using Typescript, the build will fail if you have any unused variables or imports. This behaviour can be removed by editing `tsconfig.app.json` and `tsconfig.node.json`, but it is recommended.

## Further Information
Please see the [Odin React Wiki](https://github.com/stfc-aeg/odin-react/wiki) for additional information about how to use the components.
