import {FUNCTION} from 'proxy-target';
export default typeof Worker === FUNCTION ? Worker : class {};
