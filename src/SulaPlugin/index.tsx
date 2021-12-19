import { registerFieldPlugin } from 'sula';
import InputEnterField from './components/inputEnterField';

registerFieldPlugin('inputEnterField')(InputEnterField, true, true);
