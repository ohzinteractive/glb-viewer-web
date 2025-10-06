import { spawn } from 'child_process';

class StartApp
{
  constructor()
  {
    this.core_process = null;
    this.app_process = null;
  }

  async start(env_variables_string)
  {
    try
    {
      const env_variables = this.get_env_variables(env_variables_string);

      Object.assign(env_variables, process.env);

      this.run_core_process(env_variables);

      // Handle termination
      const terminate = () =>
      {
        console.log('\nStopping processes...');

        if (this.core_process)
        {
          this.core_process.kill('SIGINT');
        }
        if (this.app_process)
        {
          this.app_process.kill('SIGINT');
        }

        // Exit after a short delay to allow cleanup
        setTimeout(() => process.exit(), 1000);
      };

      process.on('SIGINT', terminate);
      process.on('SIGTERM', terminate);
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }

  run_app_process(env_variables)
  {
    console.log('run_app_process, Starting app process...');

    this.app_process = spawn('yarn', ['start-vite'], { env: env_variables, shell: true }); //, { stdio: 'pipe' }

    this.app_process.stdout.on('data', (data) =>
    {
      const data_str = '' + data;
      // console.log('Stdout2: ' + data);
      console.log(data_str);

      if (data_str.includes('http://localhost'))
      {
        console.log('App process started');
      }
    });

    // this.app_process.stderr.on('data', (data) =>
    // {
    //   const data_str = '' + data;

    //   console.log('stderr', data_str);
    // });
  }

  run_core_process(env_variables)
  {
    console.log('run_core_process, Starting core process...');

    this.core_process = spawn('yarn', ['start-core'], { shell: true, env: env_variables });

    this.core_process.stdout.on('data', (data) =>
    {
      const data_str = '' + data;
      console.log('Stdout1: ' + data);

      if (data_str.includes('http://localhost'))
      {
        console.log('Core process started');

        if (!this.app_process)
        {
          this.run_app_process(env_variables);
        }
      }
    });

    this.core_process.stderr.on('data', (data) =>
    {
      const data_str = '' + data;

      console.log(data_str);
    });
  }

  get_env_variables(env_variables_string)
  {
    const env_variables = {};

    if (env_variables_string)
    {
      const env_variables_array = env_variables_string.split(',');

      for (const env_variable of env_variables_array)
      {
        const env_variable_array = env_variable.split('=');
        env_variables[env_variable_array[0]] = env_variable_array[1];
      }
    }

    return env_variables;
  }
}

const start_app = new StartApp();
start_app.start(process.argv[2] === 'true', process.argv[3]);
