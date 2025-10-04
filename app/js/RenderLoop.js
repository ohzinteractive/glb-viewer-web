export class RenderLoop
{
  constructor(application)
  {
    this.application = application;
  }

  start()
  {
    this.application.start();

    this.update();
  }

  update()
  {
    this.application.update();

    requestAnimationFrame(this.update.bind(this));
  }
}
