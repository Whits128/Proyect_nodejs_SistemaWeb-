




import app from '../Api/app';
import config from './config';

app.listen(config.port, () => {
  console.log('Server en puerto', config.port);
});