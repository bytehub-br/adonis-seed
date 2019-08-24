'use strict'

const Role = use('Role')
const APIException = use('App/Exceptions/APIException')
const Database = use('Database')

class RoleController {

    async index({request, response}){
        try {
            let { page } = request.get() 

            page = Number(page) ? Number(page) : 1
    
            const roles = await Database.from('roles').paginate(page, 10)
            
    
            return roles

        } catch (error) {            
             return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
    }

    async show({params, response}){
        try {

            const role = await Role.find(params.id)

            if(!role) throw new APIException('Role not found', 'ROLE_NOT_FOUND', 404)   

            await role.load('permissions')
            
            return role
            
        } catch (error) {
            return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
    }

    async store({request, response}){
        const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permissions'])

        try {
            const role = await Role.create(data)

            if(permissions){
                await role.permissions().attach(permissions)
            }

            await role.save()

            await role.load('permissions')

            return role
            
        } catch (error) {
            return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
        
    }

    async update({request, response, params}){
        const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permissions'])

        try {
            const role = await Role.find(params.id)

            if(!role) throw new APIException('Role not found', 'ROLE_NOT_FOUND', 404)   
            
            role.merge(data)

            await role.save()

            if(permissions){
                await role.permissions().sync(permissions)
            }

            await role.save()
    
            await role.load('permissions')
    
            return role

        } catch (error) {
            return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
        
    }

    async destroy({params, response}){
        try {
            const role = await Role.find(params.id)

            if(!role) throw new APIException('Role not found', 'ROLE_NOT_FOUND', 404)   

            await role.delete()

        } catch (error) {
            return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
    }
}

module.exports = RoleController
