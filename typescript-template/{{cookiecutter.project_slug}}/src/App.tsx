import 'bootstrap/dist/css/bootstrap.min.css';

import { OdinApp, useAdapterEndpoint } from 'odin-react';
import { TemplatePage } from './TemplatePage';

const App: React.FC = () => {

  const endpoint = useAdapterEndpoint("{{cookiecutter.adapter_name}}", import.meta.env.VITE_ENDPOINT_URL);

  return (
    <OdinApp title='{{cookiecutter.project_name}}' navLinks={["Page One"]}>
      {/* Add pages as children of the OdinApp component. Add a nav link to each page in the navLinks
          prop of OdinApp*/}
      <TemplatePage/>
    </OdinApp>
  )
}

export default App
