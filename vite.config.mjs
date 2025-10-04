import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import vitePugPlugin from 'vite-plugin-pug-transformer';
import sections_meta from './app/data/sections_meta.json';
import packagejson from './package.json';

const useHttps = process.env.VITE_USE_HTTPS === 'true';

export default defineConfig({
  plugins: [
    glsl(),
    vitePugPlugin({ pugLocals: {
          sections_meta,
          package: packagejson
        }
    }),
    {
      name: "ohzi-static-files-dont-exist",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          const extensions = ['mp3', 'mp4', 'webm', 'glb', 'jpg', 'png', 'webp', 'hdr', 'json', 'gltf', 'xml', 'json']
          
          // Check if the url contains a dot (.) which means it's probably a static file request
          if (url.includes('.') && extensions.includes(url.split('.').pop())) {
            const filePath = path.join(process.cwd(), 'public', url);
            
            // Check if the file exists in the public directory
            if (!fs.existsSync(filePath)) {
              res.statusCode = 404;
              return;
            }
          } 
          next(); // Continue to the next middleware if the file exists
        })
      }
    }
    // watch({
    //   pattern: "./core/**/*.js",
    //   command: "cd core && yarn build",
    // }),
  ],
  build: {
    target: 'esnext', // browsers can handle the latest ES features
    rollupOptions: {
      input: ['index.html'],
      // output: {
      //   manualChunks: {
      //     'ohzi-core': ['ohzi-core'],
      //     three: ['three']
      //   }
      // },
    },
    chunkSizeWarningLimit: 700
  },
  resolve: {
    alias: {
      // 'ohzi-components': path.resolve(__dirname, './components/src'),
      // 'ohzi-core': path.resolve(__dirname, './core/src'),
      // 'pit-js': path.resolve(__dirname, './pit/src'),
      // 'three': path.resolve(__dirname, './node_modules/three')
    }
  },
  server: {
    https: useHttps
      ? {
        key: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certificates', 'localhost.pem'))
      }
      : false,
    host: true // allows external access
  },
  envPrefix: 'OHZI'
})
