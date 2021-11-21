const express = require("express");
const router = express.Router();
const { decodeToken, verifyToken } = require("../util/token");
const GroupDao = require("../data/GroupDao");
const RouteDao = require("../data/RouteDao");
const groups = new GroupDao();
const routes = new RouteDao();

const checkToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const [_, token] = authorization.trim().split(" ");
    const valid = await verifyToken(token);
    if (!valid) {
      return res.status(403).json({
        message: "You are not authorized to access this resource.",
      });
    }
    req.user = decodeToken(token);
    next();
};


router.post("/api/group", checkToken, async (req, res) => {
    try {
        const { plate_number } = req.body;
        const group = await groups.create({plate_number});
        res.status(200).json({group});
    } catch (err) {
        res.status(err.status).json({message: err.message});
    }
})

router.post("/api/two-nogroups", checkToken, async (req, res) => {
    const { route_id_1, route_id_2 } = req.body;

    const valid_plate_numbers = ["B75604", "D2483AC", "BP2843GF", "B4907D"];
    const plate_number = valid_plate_numbers[Math.floor(Math.random() * (4))]
    try {
        //assign new group, they are a brand new group!
        const group = await groups.create({plate_number});

        const original_route_1 = await routes.readById(route_id_1);
        const original_route_2 = await routes.readById(route_id_2);

        if (original_route_1.group === null && original_route_2.group === null) {
            //assign group_id to both routes!
            await routes.update({id: route_id_1, from: original_route_1.from, to: original_route_1.to, user: original_route_1.user, group: group._id})
            await routes.update({id: route_id_2, from: original_route_2.from, to: original_route_2.to, user: original_route_2.user, group: group._id})
            res.status(200).json({group});
        } else {
            res.status(400).json({message: "Both routes have to be ungrouped!"});
        }
    
        
    } catch (err) {
        res.status(err.status).json({message: err.message});
    }

})


router.patch("/api/group-nogroup-combine", checkToken, async (req, res) => {
    const { route_id_1, route_id_2 } = req.body;
    try {
        const original_route_1 = await routes.readById(route_id_1);
        const original_route_2 = await routes.readById(route_id_2);

        if (original_route_1.group === null && original_route_2.group === null) {
            res.status(400).json({message: "Both groups can't be null!"});
        }

        if (original_route_1.group !== null && original_route_2.group !== null) {
            res.status(400).json({message: "Both groups can't already be grouped!"});
        }

        if (original_route_1.group) {
            await routes.update({id: route_id_2, from: original_route_2.from, to: original_route_2.to, user: original_route_2.user, group: original_route_1.group});
            res.status(200).json({group_id: original_route_1.group});
        } else {
            await routes.update({id: route_id_1, from: original_route_1.from, to: original_route_1.to, user: original_route_1.user, group: original_route_2.group});
            res.status(200).json({group_id: original_route_2.group});

        }

       
    } catch (err) {
        res.status(err.status).json({message: err.message});
    }

}) 


module.exports = router;