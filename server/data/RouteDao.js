const Route = require("../model/Route");
const ApiError = require("../model/ApiError");
const mongoose = require("mongoose");
class RouteDao {

    async create({ from, to, user, group}) {
        if (from.length === 2 || to.length === 2) {
            if(!user) {
                throw new ApiError(400, "Invalid/Missing User");
            }

            //group doesn't have to be defined
            const route = await Route.create({from, to, user, group});
            return route;
        } else {
            throw new ApiError(400, "Insert lat/long coordinate for from/to");
        }
        
    }

    async readById(id) {
        const route = await Route.findById(id);
        if (route === null) {
            throw new ApiError(404, "There is no such route with the given ID");
        }

        return route;
    }

    // or rather, read by user's id!
    async readByUser({user}) {
        if(!user) {
            throw new ApiError(400, "User is invalid or missing!");
        }
        const routes = await Route.find({user});
        return routes;
    }

    async everythingButUser({user}) {
        if(!user) {
            throw new ApiError(400, "User is invalid or missing!");
        }
        const user_id = user;
        const routes = await Route.find({user: { $not: { $eq: user_id } }});
        return routes;
    }

    async readAll() {
        return await Route.find({});
    }

    async update({id, from, to, user, group}) {
        const route = await Route.findById(id);
        if (route === null) {
            throw new ApiError(404, "There is no such route with the given ID");
        }

        const new_route = await Route.findByIdAndUpdate(
            id,
            { from, to, user, group},
            {new: true, runValidators: true}
        );
        return new_route;
    }
    async delete(id) {

        await readById(id);
        const deleted_route = Route.findByIdAndDelete(id);
        return deleted_route;
    }

}

module.exports = RouteDao;