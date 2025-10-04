import { execSync } from 'child_process';

class BuildApp
{
  async build(env_variables_string)
  {
    try
    {
      const env_variables = this.get_env_variables(env_variables_string);

      Object.assign(env_variables, process.env);

      execSync('yarn build-vite', { env: env_variables, stdio: 'inherit' });
    }
    catch (e)
    {
      console.error('Error:', e);
    }
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

const build_app = new BuildApp();
build_app.build(process.argv[2]);
