import {v4}                                               from "uuid";
import {DataTypes, Model as BaseModel}                    from "sequelize";
import {ModelAttributeColumnOptions, ModelIndexesOptions} from "sequelize/types/lib/model";

import Interface from "./Interface";

export default class NotificationModel extends BaseModel<Interface> {
    /**
     * @name UUID
     */
    public static UUID?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "UUID",
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: v4,
        validate: {
            notEmpty: true,
        }
    };

    /**
     * @name modelName
     */
    public static modelName = "Client";

    /**
     * @name tableName
     */
    public static tableName = "client";

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        UUID: NotificationModel.UUID,
    };

    /**
     * @name fieldSet
     */
    static get fieldSet() {
        return this._fieldSet;
    }

    /**
     * @name indexes
     */
    static get indexes(): ModelIndexesOptions[] {
        return [{
            fields: [NotificationModel.UUID.field],
            type: "UNIQUE",
        },];
    }
}
