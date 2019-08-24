'use strict'

const Antl = use('Antl')

class Permission {

  get validateAll(){
    return true
  }
  
  get rules () {
    return {
      // validation rules
      name : 'required',
      slug : 'required',
      description : 'required'     
    }
  }

  get messages(){
    return Antl.list('validation')
  }
}

module.exports = Permission
