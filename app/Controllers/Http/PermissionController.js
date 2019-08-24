'use strict'

const Permission = use('Permission')
const Database = use('Database')
const APIException = use('App/Exceptions/APIException')

class PermissionController {

    async index({request}){
        let { page } = request.get() 

        page = Number(page) ? Number(page) : 1

        const permissions = await Database.from('permissions').paginate(page, 10)

        return permissions
    }


    async store({ request }){
        const data = request.only(['name', 'slug', 'description'])

        const permission = await Permission.create(data)

        return permission
    }

    async update({ request, params }){
        const data = request.only(['name', 'slug', 'description'])

        const permission = await Permission.findOrFail(params.id)

        permission.merge(data)

        await permission.save()

        return permission
    }

    async show({response, params}){

        try {
            const permission = await Permission.find(params.id)

            if(!permission) throw new APIException('Permission not found', 'PERMISSION_NOT_FOUND', 404)

            return permission

        } catch (error) {

            return response.status(error.status || 500).send({
                message : error.message,
                code : error.code || 'SERVER_ERROR'
            })
        }
       
    }

    async destroy({params, response}){
        
        try {
            const permission = await Permission.find(params.id)

            
            if(!permission) throw new APIException('Permission not found', 'PERMISSION_NOT_FOUND', 404)

            await permission.delete()    

        } catch (error) {
            return response.status(error.status).send({
                message : error.message,
                code : error.code
            })
        }
        
    }
}

module.exports = PermissionController
