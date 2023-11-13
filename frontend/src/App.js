import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WeatherApp from './WeatherApp';

function App() {
  return (
    <Router>
      <Switch>
        <Route path ="/" exact component={WeatherApp} />
      </Switch>
    </Router>
  );
}

export default App;
