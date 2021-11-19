import React, { FC } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'
import Print from '@/pages/print'

const App: FC = (props) => { 
  return (
    <Router>
      <Route exact path="/login" component={Login} />
      <Route  
        path="/print" 
        key="print"
        component={Print}
      />
      <Route
        path="/"
        key="container"
        render={(props: unknown) => <Container {...props} />}
      /> 
    </Router>
  )
}

export default App
