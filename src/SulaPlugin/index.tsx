import { registerFieldPlugin } from 'sula';
import InputEnterField from './components/inputEnterField';
import SelectEnterField from './components/selectEnterField';

registerFieldPlugin('inputEnterField')(InputEnterField, true, true);
registerFieldPlugin('selectEnterField')(SelectEnterField, true, true)