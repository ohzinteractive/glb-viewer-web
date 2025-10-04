
import package_json from '../../package.json';
import { MainApplication } from './MainApplication';
import { RenderLoop } from './RenderLoop';

// APP

class Api
{
  init(settings)
  {
    this.application = new MainApplication();

    this.render_loop = new RenderLoop(this.application);

    window.app = this.application;
    window.ViewApi = this;
    window.settings = settings;
    window.author = 'OHZI Interactive Studio';
    window.version = package_json.version;

    this.start();
  }

  dispose()
  {
    this.application.dispose();
  }

  start()
  {
    this.render_loop.start();
  }

  stop()
  {
    this.render_loop.stop();
  }
}

const api = new Api();
export { api as Api };
