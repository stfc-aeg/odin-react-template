import 'bootstrap/dist/css/bootstrap.min.css';

import { OdinApp } from 'odin-react'
import { TemplatePage } from './TemplatePage';

function App() {

  return (
    <OdinApp title='Template App' navLinks={["Page One"]}>
      {/* Add pages as children of the OdinApp component. Add a nav link to each page in the navLinks
          prop of OdinApp*/}
      <TemplatePage/>
    </OdinApp>
  )
}

export default App
