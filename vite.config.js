import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base debe coincidir con la carpeta del VPS: http://IP_DE_SU_VPS/t3_act8_eq10/
export default defineConfig({
  plugins: [react()],
  base: '/t3_act8_eq10/',
})
