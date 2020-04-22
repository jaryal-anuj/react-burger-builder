import axios from 'axios';

const instance =axios.create({
    baseURL:"https://react-burger-builder-4c4fc.firebaseio.com/"
});

export default instance;
