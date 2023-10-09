import {FUNCTION} from "./types.js";
export default typeof Worker === FUNCTION ? Worker : class {};
