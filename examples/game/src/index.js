import mainRender from './components/Main';

mainRender();

if (module.hot) {
  module.hot.accept('./components/Main', () => {
    const nextMainRender = require('./components/Main').default;

    nextMainRender();
  });
}