import {FUNCTION} from 'proxy-target/types';
export default typeof Worker === FUNCTION ? Worker : class {};
