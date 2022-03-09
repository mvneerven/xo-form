import PropertyMapper from './PropertyMapper';
import DataBinding from './DataBinding';

class Context{
    constructor(form){
        this._form = form;
        this._model = new DataBinding(this);
        this._mapper = new PropertyMapper(this)
    }

    get form() {
        return this._form;
    }

    get data(){
        return this._model;
    }

    get mapper(){
        return this._mapper;
    }
}

export default Context;