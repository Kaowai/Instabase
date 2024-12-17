/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        popup: 'minmax(700px, 800px) 500px'
      },
      colors: {
        'hover-color': '#f5f5f5',
        'primary-color1': '#37afe1',
        'primary-color2': '#4cc9fe',
        'primary-color3': '#789dbc',
        'grey-color1': '#bdbdbd',
        'grey-color2': '#848484',
        'grey-color3': '#dbdbdb',
        'grey-color4': '#efefef'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #f9ce34, #ee2a7b, #6228d7)'
      }
    }
  },
  plugins: []
}
