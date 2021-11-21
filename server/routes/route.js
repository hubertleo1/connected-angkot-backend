const express = require("express");
const { decodeToken, verifyToken } = require("../util/token");
const router = express.Router();

const {
    fourEndPointsDiff} = require("../util/distance_cal");

const RouteDao = require("../data/RouteDao");
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

//to post a route
router.post("/api/route", checkToken, async (req, res) => {
  try {
    const { from, to, user, group } = req.body;
    const route = await routes.create({ from, to, user, group });
    res.status(200).json({ route });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
});

//user checks for their group/ungrouped routes.put the token (with their id) into the authorization
router.get("/api/userroutes", checkToken, async (req, res) => {
  try {
    const user_routes = await routes.readByUser({ user: req.user.id });
    res.json({ user_routes: user_routes ? user_routes : [] });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
});

//user checks for their most relevant routing option
router.get("/api/relevantroute", checkToken, async (req, res) => {

  try {
    const { route_id } = req.body;

    const selected_route = await routes.readById(route_id);

    const user_id = selected_route.user;

    const not_user_routes = await routes.everythingButUser({user: user_id});

    let most_relevant_routes = not_user_routes.sort((route1, route2) => {
    const distance_one = fourEndPointsDiff(route1.from[0], route1.from[1], route1.to[0], route1.to[0], 
        selected_route.from[0], selected_route.from[1], selected_route.to[0], selected_route.to[0]);

        const distance_two = fourEndPointsDiff(route2.from[0], route2.from[1], route2.to[0], route2.to[0], 
            selected_route.from[0], selected_route.from[1], selected_route.to[0], selected_route.to[0]);

    if (distance_one < distance_two) {
        return -1;
    } else if (distance_one > distance_two) {
        return 1;
    } else {
        return 0;
    }


    });

    //top 8 only!
    most_relevant_routes.splice(8, most_relevant_routes.length - 8)

    res.status(200).json({ data: most_relevant_routes });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
  }
});

module.exports = router;
