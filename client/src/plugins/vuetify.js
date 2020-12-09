import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        // dark: true,
        themes: {
            light: {
                primary: '#5f5cff',
                secondary: '#00BFA5',
            }
        }
    }
});
