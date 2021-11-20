// const GroupSchema = new mongoose.Schema({
//     plate_number: {
//       type: String,
//       // only have a fleet of 4 angkots! Will expand soon! Right now, just randomly assigned
//       enum: ["B75604", "D2483AC", "BP2843GF", "B4907D"],
//       required: true,
//     }
//   });

const Group = require("../model/Group");
const ApiError = require("../model/ApiError");

class GroupDao {
    async create({plate_number}) {
        if (plate_number === undefined || plate_number === "") {
            throw new ApiError(400, "Insert a plate_number");
        }
        const group = await Group.create({plate_number});
        return group;
    }
    async update(id, {plate_number}) {
        const group = await Group.findByIdAndUpdate(
            id,
            {plate_number},
            {new: true, runValidators: true}
        );

        if (group === null) {
            throw new ApiError(404, "There is no plate_number associated with the ID!");
        }

        return group;
    }


    async delete(id) {
        const group = await Group.findByIdAndDelete(id);
        if (group === null) {
            throw new ApiError(404, "There is no user with the given ID!");
        }
        return group;
    }

    async read(id) {
        const group = await Group.findById(id);
        return group ? group : [];
    }
}

module.exports = GroupDao; 