import mainRender from './Main';

mainRender();

if (module.hot) {
  module.hot.accept('./Main', () => {
    const nextMainRender = require('./Main').default;

    nextMainRender();
  });
}