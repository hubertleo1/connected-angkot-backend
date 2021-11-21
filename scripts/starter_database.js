const faker = require("faker");

const db = require("../server/data/db");

const User = require("../server/model/User");
const Group = require("../server/model/Group");
const Route = require("../server/model/Route");

const UserDao = require("../server/data/UserDao");
const GroupDao = require("../server/data/GroupDao");
const RouteDao = require("../server/data/RouteDao");
const { listeners } = require("../server/model/User");

const users = new UserDao();
const routes = new RouteDao();
const groups = new GroupDao();

// -6.177828022783735 to -6.179154469118252 (latitude)
// 106.77350302422087 to 106.87907129086342 (longitude)
function getRnd(min, max) {
    return (Math.random() * (max - min) ) + min;
}
function randomLatWithinJakarta() {
    return getRnd(-6.177828022783735, -6.179154469118252);
}

function randomLongWithinJakarta() {
    return getRnd(106.77350302422087, 106.87907129086342)
}

async function populateDatabase() {
  try {
    await db.connect();
    await User.deleteMany({});
    await Group.deleteMany({});
    await Route.deleteMany({});

    const user_ids = [];

    //20 users sign up for the platform
    for (let i = 0; i < 20; i++) {
      const profile = faker.helpers.contextualCard();
      const created_user = await users.create({
        email: profile.email,
        password: "AngkotRockzz",
        name: profile.name,
        occupation: Math.floor(Math.random() * 2)
          ? faker.name.jobType()
          : "Student",
      });
      user_ids.push(created_user._id);
    }

    //among these 20 first users, 100 new routes get created (5 on average)
    for(let i = 0; i < 100; i++) {
        let random_id = user_ids[Math.floor(Math.random() * 20)];
        routes.create({
            from: [randomLatWithinJakarta(), randomLongWithinJakarta()],
            to: [randomLatWithinJakarta(), randomLongWithinJakarta()],
            user: random_id
        })
    }
  } catch (err) {
    console.log(err);
  }
}

populateDatabase();
