import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/db";

const UserType = sequelize.define(
    "UserType",
    {
        user_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_type_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "user_type",
        timestamps: false,
        underscored: true,
    }
);

export default UserType;
